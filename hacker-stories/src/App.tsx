import * as React from 'react';
import html2canvas from "html2canvas";
import {useState} from "react";
import axios from "axios";
import {List} from "./List.tsx";
import {SearchForm} from "./SearchForm.tsx";
import {DropResult} from "react-beautiful-dnd";
import {DndList} from "./DndList.tsx";
import {Slider} from "./Slider.tsx";
import {Button} from "./Button.tsx";
import {StyledButton} from "./StyledButton.tsx";
import {DrinkRadioButton} from "./DrinkRadioButton.tsx";
import {CheckboxWithText} from "./CheckboxWithText.tsx";

export {
    reorder,
    storiesReducer
};

export type {
    Story,
    StoriesState,
    StoriesAddAction,
    StoriesRemoveAction,
    StoriesFetchFailureAction,
    StoriesFetchSuccessAction,
    StoriesFetchInitAction,
    User
};

type Story = {
    objectID: number;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
};

type User = {
    id: string,
    firstName: string,
    lastName: string
}

const useStorageState = (key: string, initialState: string) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue] as const;
}

type StoriesState = {
    data: Story[];
    isLoading: boolean;
    isError: boolean;
};

type StoriesFetchInitAction = {
    type: 'STORIES_FETCH_INIT';
};

type StoriesFetchSuccessAction = {
    type: 'STORIES_FETCH_SUCCESS';
    payload: Story[];
};

type StoriesFetchFailureAction = {
    type: 'STORIES_FETCH_FAILURE';
};

type StoriesRemoveAction = {
    type: 'REMOVE_STORY';
    payload: Story;
};

type StoriesAddAction = {
    type: 'ADD_STORY';
    payload: Story;
};

type StoriesAction =
    StoriesFetchInitAction |
    StoriesFetchSuccessAction |
    StoriesFetchFailureAction |
    StoriesRemoveAction |
    StoriesAddAction

const reorder = (list: User[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const storiesReducer = (
    state: StoriesState,
    action: StoriesAction
) => {
    switch (action.type) {
        case 'STORIES_FETCH_INIT':
            return {
                ...state,
                isLoading: true,
                isError: false,
            };
        case 'STORIES_FETCH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                isError: false,
                data: action.payload,
            };
        case 'STORIES_FETCH_FAILURE':
            return {
                ...state,
                isLoading: false,
                isError: true,
            };
        case 'REMOVE_STORY':
            return {
                ...state,
                data: state.data.filter(
                    (story) => action.payload.objectID !== story.objectID
                ),
            };
        case 'ADD_STORY':
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        default:
            throw new Error();
    }
};

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const extractSearchTerm = (url: string) => url.replace(API_ENDPOINT, '');

//gets only 5 proceeding searches
const getLastSearches = (urls: string[]) =>
    urls
        .reduce<string[]>((result, url, index) => {
            const searchTerm = extractSearchTerm(url); // Step 1: Extract the search term from the URL
            if (index === 0) {
                return result.concat(searchTerm); // Step 2: If it's the first URL, add the search term to the result
            }
            const previousSearchTerm = result[result.length - 1]; // Step 3: Get the last search term in the result
            if (searchTerm === previousSearchTerm) {
                return result; // Step 4: If the search term is the same as the last one, skip it (avoid duplicates)
            } else {
                return result.concat(searchTerm); // Step 5: Otherwise, add the search term to the result
            }
        }, []) // Start with an empty array `result`
        .slice(-6) // Step 6: Take the last 6 search terms
        .slice(0, -1); // Step 7: Exclude the most recent search term

const getUrl = (searchTerm: string) => `${API_ENDPOINT}${searchTerm}`;

const App = () => {
    const users = [
        {
            id: '1',
            firstName: 'Robin',
            lastName: 'Wieruch',
        },
        {
            id: '2',
            firstName: 'Aiden',
            lastName: 'Kettel',
        },
        {
            id: '3',
            firstName: 'Jannet',
            lastName: 'Layn',
        },
    ];

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

    const [urls, setUrls] = React.useState([getUrl(searchTerm)]);

    const [stories, dispatchStories] = React.useReducer(
        storiesReducer,
        {data: [], isLoading: false, isError: false}
    );

    const [selectedDrink, setSelectedDrink] = React.useState('');

    const [usersList, setUsersList] = React.useState(users);

    const [dummyIdSeq, setDummyIdSeq] = React.useState<number>(100);

    const printRef = React.useRef<HTMLInputElement>(null);

    const handleFetchStories = React.useCallback(() => {
        dispatchStories({type: 'STORIES_FETCH_INIT'});

        const lastUrl = urls[urls.length - 1];

        axios
            .get(lastUrl)
            .then((result) => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.data.hits,
                });
            })
            .catch(() =>
                dispatchStories({type: 'STORIES_FETCH_FAILURE'})
            );
    }, [urls]);

    React.useEffect(() => {
        handleFetchStories();
    }, [handleFetchStories]);

    const handleRemoveStory = (item: Story) => {
        dispatchStories({
            type: 'REMOVE_STORY',
            payload: item,
        });
    }

    const addDummyStory = () => {
        const nextDummySeqId = dummyIdSeq + 1;
        setDummyIdSeq(nextDummySeqId);

        const dummyStory = {
            title: 'Dummy',
            url: 'https://dummy.org/',
            author: 'Dummy Author',
            num_comments: 99,
            points: 99,
            objectID: nextDummySeqId
        }

        dispatchStories({
            type: 'ADD_STORY',
            payload: dummyStory
        });
    }

    const handleDownloadImage = async () => {
        if (printRef.current) {
            const element = printRef.current;
            const canvas = await html2canvas(element);

            const data = canvas.toDataURL('image/jpeg'); // Corrected to 'jpeg'
            const link = document.createElement('a');

            if (typeof link.download === 'string') {
                link.href = data;
                link.download = 'image.jpg';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                window.open(data);
            }
        } else {
            console.error('printRef is not defined');
        }
    };

    const handleDragEnd = (result: DropResult,) => {
        const {destination, source} = result;
        if (!destination) return;
        setUsersList(reorder(usersList, source.index, destination.index));
        console.log(source.index);
        console.log(destination.index);
        console.log(usersList);
    };

    const handleSearch = (searchTerm: string) => {
        const url = getUrl(searchTerm);
        setUrls(urls.concat(url));
    };

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        handleSearch(searchTerm);

        event.preventDefault();
    }

    const handleLastSearch = (searchTerm: string) => {
        handleSearch(searchTerm);
    };

    const handleRadioSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDrink(event.target.value);
    };

    const handleCheckbox1Selection = (event: React.MouseEvent<HTMLInputElement>) => {
        console.log(event.type + ": checkbox selection changes!");
    }
    const handleCheckbox2Selection = (event: React.MouseEvent<HTMLInputElement>) => {
        console.log(event.type + ":checkbox selection changes also there!");
    }

    const onClickOne = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("button one clicked! type of event: " + event.type);
    }

    const onClickTwo = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("button two clicked! type of event: " + event.type);
    }

    const onClickThree = (event: React.MouseEvent<HTMLButtonElement>) => {
        console.log("button three clicked! type of event: " + event.type);
    }

    const lastSearches = getLastSearches(urls);

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <h4>Slider component using refs example</h4>
            <div>
                <Slider/>
            </div>
            <br/><br/>

            <SearchForm
                searchTerm={searchTerm}
                onSearchInput={handleSearchInput}
                onSearchSubmit={handleSearchSubmit}
            />

            {stories.isError && <p>Something went wrong ...</p>}

            {stories.isLoading ? (
                <p>is Loading...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory}/>
            )}

            {lastSearches.map((searchTerm, index) => (
                <button
                    key={searchTerm + index} //Make the key more specific by concatenating it with the index
                    type="button"
                    onClick={() => handleLastSearch(searchTerm)}
                >
                    {searchTerm}
                </button>
            ))}

            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;
            <span>
                <button type="button" onClick={addDummyStory}>Add dummy item</button>
            </span>
            <hr/>


            {/*custom REUSABLE components examples*/}
            <h4>buttons example:</h4>
            <Button onClick={onClickOne} text={'button 1'}/> <br/>
            <Button onClick={onClickTwo} text={'button 2'}/> <br/>
            <Button onClick={onClickThree} text={'button 3'}/> <br/>

            <h4>radio buttons example:</h4>
            <DrinkRadioButton value={"Coffee"} id={"coffee"} onChange={handleRadioSelection}/>
            <DrinkRadioButton value={"Water"} id={"water"} onChange={handleRadioSelection}/>
            &nbsp;&nbsp;&nbsp; Selected drink: {selectedDrink}

            <h4>checkbox example:</h4>
            <CheckboxWithText text={"some text"} onClick={handleCheckbox1Selection}/>
            <CheckboxWithText text={"some text 2"} onClick={handleCheckbox2Selection}/>

            <h4>drag and drop list exampe:</h4>
            <DndList
                list={usersList}
                onDragEnd={handleDragEnd}
                dragItemStyle={{
                    background: 'pink',
                    borderRadius: '16px',
                }}
                dragListStyle={{
                    background: 'lightblue',
                    borderRadius: '16px',
                }}
            />

            <h4>Download As image example using refs in React and html2canvas lib</h4>
            <button type="button" onClick={handleDownloadImage}>Download as Image</button>
            <div>I will NOT be in the image</div>
            <div ref={printRef}>I will be in the image</div>

            <h4>Styled components using styled-components example</h4>
            <div>
                <StyledButton>example</StyledButton>
            </div>

        </div>
    );
};

export default App;