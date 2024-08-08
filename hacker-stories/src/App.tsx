import * as React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';
import html2canvas from "html2canvas";
import styled from 'styled-components';
import {useState} from "react";


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

const StyledButton = styled.button`
    cursor: pointer;
    background: transparent;
    font-size: 16px;
    border-radius: 3px;
    color: palevioletred;
    border: 2px solid palevioletred;
    margin: 0 1em;
    padding: 0.25em 1em;
    transition: 0.5s all ease-out;

    &:hover {
        background-color: palevioletred;
        color: white;
    }
`;

const StyledSlider = styled.div`
    position: relative;
    border-radius: 3px;
    background: #dddddd;
    height: 15px;
`;

const StyledThumb = styled.div`
    width: 10px;
    height: 25px;
    border-radius: 3px;
    position: relative;
    top: -5px;
    opacity: 0.5;
    background: #823eb7;
    cursor: pointer;
`;


const getPercentage = (current: number, max: number) => (100 * current) / max;

const getLeft = (percentage: number) => `calc(${percentage}% - 5px)`;

const Slider = () => {
    const sliderRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);

    const diff = React.useRef<HTMLDivElement>(null);

    const handleMouseMove = (event: MouseEvent) => {
        let newX =
            event.clientX -
            diff.current -
            sliderRef.current.getBoundingClientRect().left;

        const end = sliderRef.current.offsetWidth - thumbRef.current.offsetWidth;

        const start = 0;

        if (newX < start) {
            newX = 0;
        }

        if (newX > end) {

            newX = end;
        }

        const newPercentage = getPercentage(newX, end);

        thumbRef.current.style.left = getLeft(newPercentage);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
        diff.current =
            event.clientX - thumbRef.current.getBoundingClientRect().left;

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <>
            <StyledSlider ref={sliderRef}>
                <StyledThumb ref={thumbRef} onMouseDown={handleMouseDown}/>
            </StyledSlider>
        </>
    );
};

type DndItemProps = {
    index: number,
    item: User,
    dragItemStyle?: React.CSSProperties
}

const DndItem = ({index, item, dragItemStyle}: DndItemProps) => (
    <Draggable index={index} draggableId={item.id}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={{
                    // default item style
                    padding: '8px 16px',
                    // default drag style
                    ...provided.draggableProps.style,
                    // customized drag style
                    ...(snapshot.isDragging ? dragItemStyle : {})
                }}
            >
                {item.firstName} {item.lastName}
            </div>
        )}
    </Draggable>
)

type DndListProps = {
    list: User[],
    onDragEnd: (result: DropResult) => void,
    dragListStyle?: React.CSSProperties,
    dragItemStyle?: React.CSSProperties
}

const DndList = ({list, onDragEnd, dragListStyle = {}, ...props}: DndListProps) => (
    <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                        ...(snapshot.isDraggingOver ? dragListStyle : {}),
                    }}
                >
                    {list.map((item, index) => (
                        <DndItem
                            key={item.id}
                            index={index}
                            item={item}
                            {...props}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    </DragDropContext>
);

const useStorageState = (key: string, initialState: string) => {
    const [value, setValue] = React.useState(
        localStorage.getItem(key) || initialState
    );

    React.useEffect(() => {
        localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue] as const;
}

type ListProps = {
    list: Story[],
    onRemoveItem: (item: Story) => void
};

const List = ({list, onRemoveItem}: ListProps) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                item={item}
                onRemoveItem={onRemoveItem}
            />
        ))}
    </ul>
);

type ItemProps = {
    item: Story,
    onRemoveItem: (item: Story) => void
};


const Item = ({item, onRemoveItem}: ItemProps) => {
    return (
        <li>
            <span><a href={item.url}>{item.title}</a></span>
            <span> {item.author} </span>
            <span> {item.num_comments} </span>
            <span> {item.points} </span>
            <span>
                <button type="button" onClick={() => onRemoveItem(item)}>Remove item</button>
            </span>
        </li>
    );
};

type InputWithLabelProps = {
    id: string
    type?: string,
    // label: string,
    value: string,
    isFocused: boolean
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    children: React.ReactNode
};

const InputWithLabel = ({id, type = 'text', value, isFocused, onInputChange, children}: InputWithLabelProps) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (isFocused && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isFocused]);

    return (
        <>
            <label htmlFor={id}>{children}</label> &nbsp;
            <input
                ref={inputRef}
                id={id}
                type={type}
                value={value}
                autoFocus={isFocused}
                onChange={onInputChange}
            />
        </>
    )
}


type ButtonProps = {
    text: string,
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({text, onClick}: ButtonProps) => (
    <button type="button" onClick={onClick}>{text}</button>
);

type DrinkRadioButtonProps = {
    value: string,
    id: string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const DrinkRadioButton = ({value, id, onChange}: DrinkRadioButtonProps) => (
    <label>
        <input
            type="radio"
            name="drink"
            value={value}
            id={id}
            onChange={onChange}
        /> {value}
    </label>
)

type CheckboxProps = {
    text: string,
    onClick: (event: React.MouseEvent<HTMLInputElement>) => void
}

const CheckboxWithText = ({text, onClick}: CheckboxProps) => (
    <div>
        <label>
            <input type="checkbox" onClick={onClick}/>
            {text}
        </label>
    </div>
)

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

    const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

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

        fetch(url)
            .then((response) => response.json())
            .then((result) => {
                dispatchStories({
                    type: 'STORIES_FETCH_SUCCESS',
                    payload: result.hits,
                });
            })
            .catch(() =>
                dispatchStories({type: 'STORIES_FETCH_FAILURE'})
            );
    }, [url]);

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

    const reorder = (list: User[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        console.log("reorder: " + list.map(value => value.id));
        return result;
    };

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

    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = () => {
        setUrl(`${API_ENDPOINT}${searchTerm}`)
    }

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

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <h4>Slider component using refs example</h4>
            <div>
                <Slider/>
            </div>
            <br/><br/>

            <InputWithLabel id="search"
                            value={searchTerm}
                            isFocused={true}
                            onInputChange={handleSearchInput}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            &nbsp;&nbsp;&nbsp;

            <button
                type="button"
                disabled={!searchTerm}
                onClick={handleSearchSubmit}
            >
                Submit
            </button>

            {stories.isError && <p>Something went wrong ...</p>}

            {stories.isLoading ? (
                <p>is Loading...</p>
            ) : (
                <List list={stories.data} onRemoveItem={handleRemoveStory}/>
            )}

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