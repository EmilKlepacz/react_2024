import {describe, it, expect, vi} from 'vitest';
import axios from 'axios';
import {
    render,
    screen,
    fireEvent,
    waitFor, waitForElementToBeRemoved,
} from '@testing-library/react';

import App, {
    Story,
    StoriesRemoveAction,
    StoriesAddAction,
    StoriesFetchFailureAction,
    StoriesFetchSuccessAction,
    StoriesFetchInitAction,
    User,
    storiesReducer,
    reorder,
    Item,
    List,
    SearchForm,
    InputWithLabel
} from './App';

const storyOne: Story = {
    objectID: 0,
    url: 'https://reactjs.org/',
    title: 'React',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4
};

const storyTwo: Story = {
    objectID: 1,
    url: 'https://redux.js.org/',
    title: 'Redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5
};

const storyThree: Story = {
    objectID: 2,
    url: 'https://vitest.dev/',
    title: 'Vitest',
    author: 'Anthony Fu',
    num_comments: 99,
    points: 10
};

const stories = [storyOne, storyTwo]

const state = {
    data: stories,
    isLoading: false,
    isError: false
}

const userOne: User = {
    id: '1',
    firstName: 'Robin',
    lastName: 'Wieruch',
}

const userTwo: User = {
    id: '2',
    firstName: 'Aiden',
    lastName: 'Kettel',
}

const userThree: User = {
    id: '3',
    firstName: 'Jannet',
    lastName: 'Layn',
}

const users: User[] = [userOne, userTwo, userThree];

describe('dummy test', () => {
    it('true to be true', () => {
        expect(true).toBeTruthy();
    });

    it('false to be false', () => {
        expect(false).toBeFalsy;
    });
});

describe('reorder', () => {
    it('changes users order where start index < end index', () => {
        const reorderedUsers = reorder(users, 0, 1);
        const expectedUsers: User[] = [userTwo, userOne, userThree];
        expect(reorderedUsers).toStrictEqual(expectedUsers);
    });

    it('changes users order where start index > end index', () => {
        const reorderedUsers = reorder(users, 1, 0);
        const expectedUsers: User[] = [userTwo, userOne, userThree];
        expect(reorderedUsers).toStrictEqual(expectedUsers);

    });

});

describe('storiesReducer', () => {
    it('removes a story from all stories', () => {
        const action: StoriesRemoveAction = {
            type: 'REMOVE_STORY',
            payload: storyOne
        }

        const newState = storiesReducer(state, action);
        const expectedState = {
            data: [storyTwo],
            isLoading: false,
            isError: false,
        };
        expect(newState).toStrictEqual(expectedState);
    });

    it('adds a story to all stories', () => {
        const action: StoriesAddAction = {
            type: 'ADD_STORY',
            payload: storyThree
        }

        const newState = storiesReducer(state, action)
        const expectedState = {
            data: [storyOne, storyTwo, storyThree],
            isLoading: false,
            isError: false,
        };
        expect(newState).toStrictEqual(expectedState)
    });

    it('sets error = true when fetching stories fails', () => {
        const action: StoriesFetchFailureAction = {
            type: 'STORIES_FETCH_FAILURE'
        }

        const newState = storiesReducer(state, action)
        const expectedState = {
            data: [storyOne, storyTwo],
            isLoading: false,
            isError: true,
        };
        expect(newState).toStrictEqual(expectedState)
    });

    it('sets stories data from payload when fetching success', () => {
        const action: StoriesFetchSuccessAction = {
            type: 'STORIES_FETCH_SUCCESS',
            payload: [storyOne, storyTwo, storyThree]
        }

        const newState = storiesReducer(state, action);
        const expectedState = {
            data: [storyOne, storyTwo, storyThree],
            isLoading: false,
            isError: false,
        };

        expect(newState).toStrictEqual(expectedState);
    });

    it('sets isLoading = true when init fetching', () => {
        const action: StoriesFetchInitAction = {
            type: 'STORIES_FETCH_INIT',
        }

        const newState = storiesReducer(state, action);
        const expectedState = {
            data: [storyOne, storyTwo],
            isLoading: true,
            isError: false
        }

        expect(newState).toStrictEqual(expectedState);
    });
});

describe('Item', () => {
    it('renders all properties', () => {
        render(<Item item={storyOne}/>);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('React')).toHaveAttribute(
            'href',
            'https://reactjs.org/'
        );
    });

    it('renders a clickable remove item button', () => {
        render(<Item item={storyOne}/>);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('clicking the dismiss button calls the callback handler', () => {
        const handleRemoveItem = vi.fn();

        render(<Item item={storyOne} onRemoveItem={handleRemoveItem}/>);

        fireEvent.click(screen.getByRole('button'));

        expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    });
});

describe('SearchForm', () => {
    const searchFormProps = {
        searchTerm: 'React',
        onSearchSubmit: vi.fn(),
        onSearchInput: vi.fn()
    };

    it('renders the input field with its value', () => {
        render(<SearchForm {...searchFormProps} />)
        screen.debug();

        expect(screen.getByDisplayValue('React')).toBeInTheDocument();
    });

    it('renders the correct label', () => {
        render(<SearchForm {...searchFormProps} />);

        expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
    });

    it('calls onSearchInput on input field change', () => {
        render(<SearchForm {...searchFormProps} />);

        fireEvent.change(screen.getByDisplayValue('React'), {
            target: {value: 'Redux'}
        });

        expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    });

    it('calls onSearchSubmit on button submit click', () => {
        render(<SearchForm {...searchFormProps} />);

        fireEvent.submit(screen.getByRole('button'));

        expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    });
});

/* integration tests */

// Mock axios
vi.mock('axios');

// Cast axios.get to a mock function
const mockedAxios = axios as unknown as { get: vi.Mock };

describe('App', () => {
    it('succeeds fetching data', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories,
            },
        });

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        expect(screen.queryByText(/Loading/)).toBeInTheDocument();

        await waitFor(async () => await promise);

        screen.debug;

        expect(screen.queryByText(/Loading/)).toBeNull();

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('Redux')).toBeInTheDocument();
        expect(screen.getAllByText('Remove item').length).toBe(2);
    });

    it('fails fetching data', async () => {
        const promise = Promise.reject();

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        expect(screen.getByText(/Loading/)).toBeInTheDocument();

        try {
            await waitFor(async () => await promise);
        } catch (error) {
            expect(screen.queryByText(/Loading/)).toBeNull();
            expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
        }
    });

    it('removes a story', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        })

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        expect(screen.getAllByText('Remove item').length).toBe(2);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();

        fireEvent.click(screen.getAllByText('Remove item')[0]);

        expect(screen.getAllByText('Remove item').length).toBe(1);
        expect(screen.queryByText('Jordan Walke')).toBeNull();
    });

    it('searches for specific stories', async () => {
        const reactPromise = Promise.resolve({
            data: {
                hits: stories
            }
        });

        const anotherStory = {
            title: 'JavaScript',
            url: 'https://en.wikipedia.org/wiki/JavaScript',
            author: 'Brendan Eich',
            num_comments: 15,
            points: 10,
            objectID: 3,
        }

        const javascriptPromise = Promise.resolve({
            data: {
                hits: [anotherStory]
            }
        });

        mockedAxios.get.mockImplementation((url) => {
            if (url.includes('React')) {
                return reactPromise;
            }

            if (url.includes('JavaScript')) {
                return javascriptPromise;
            }

            throw Error();
        });

        //Initial Render
        render(<App/>);

        //First Data Fetching
        await waitFor(async () => await reactPromise);

        expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
        expect(screen.queryByDisplayValue('JavaScript')).toBeNull();
        expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
        expect(screen.queryByText('Brendan Eich')).toBeNull();

        //User interaction
        fireEvent.change(screen.queryByDisplayValue('React'), {
           target: {
               value: 'JavaScript'
           }
        });

        expect(screen.queryByDisplayValue('React')).toBeNull();
        expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

        fireEvent.submit(screen.queryByText('Submit'));

        //Second Data Fetching
        await waitFor(async () => await javascriptPromise);

        expect(screen.queryByText('Jordan Walke')).toBeNull();
        expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
        expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
    });

    it('adds dummy item', async () => {
        const promise = Promise.resolve({
            data: {
                hits: stories
            }
        })

        mockedAxios.get.mockImplementationOnce(() => promise);

        render(<App/>);

        await waitFor(async () => await promise);

        expect(screen.getAllByText('Remove item').length).toBe(2);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();

        fireEvent.click(screen.queryByText('Add dummy item'));

        expect(screen.getAllByText('Remove item').length).toBe(3);
        expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
        expect(screen.getByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
        expect(screen.getByText('Dummy Author')).toBeInTheDocument();

    });
});