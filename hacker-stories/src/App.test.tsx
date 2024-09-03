import {describe, it, expect} from 'vitest';

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