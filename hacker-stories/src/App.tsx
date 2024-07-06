import * as React from 'react';
import {DragDropContext, Droppable, Draggable, DropResult} from 'react-beautiful-dnd';


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

// type UserProps = {
//     users: User[]
//     onDragEnd: (result: DropResult) => void
// }

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

// const UsersList = ({users, onDragEnd}: UserProps) => (
//     <DragDropContext onDragEnd={onDragEnd}>
//         <Droppable droppableId="droppable">
//             {(provided) => (
//                 <div ref={provided.innerRef} {...provided.droppableProps}>
//                     {users.map((item, index) => (
//                         <Draggable key={item.id}
//                                    draggableId={item.id}
//                                    index={index}>
//                             {(provided) => (
//                                 <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                 >
//                                     {item.firstName} {item.lastName}
//                                 </div>
//                             )}
//                         </Draggable>
//                     ))}
//                     {provided.placeholder}
//                 </div>
//             )}
//         </Droppable>
//     </DragDropContext>
// );

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
    list: Story[];
};

const List = ({list}: ListProps) => (
    <ul>
        {list.map((item) => (
            <Item key={item.objectID} item={item}/>
        ))}
    </ul>
);

type ItemProps = {
    item: Story;
};

const Item = ({item}: ItemProps) => (
    <li>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
        <span>{item.author}</span>
        <span>{item.num_comments}</span>
        <span>{item.points}</span>
    </li>
);

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

const App = () => {
    const stories = [
        {
            title: 'React',
            url: 'https://reactjs.org/',
            author: 'Jordan Walke',
            num_comments: 3,
            points: 4,
            objectID: 0,
        },
        {
            title: 'Redux',
            url: 'https://redux.js.org/',
            author: 'Dan Abramov, Andrew Clark',
            num_comments: 2,
            points: 5,
            objectID: 1,
        },
    ];

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
    const [selectedDrink, setSelectedDrink] = React.useState('');
    const [usersList, setUsersList] = React.useState(users);

    const reorder = (list: User[], startIndex: number, endIndex: number) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        console.log("reorder: " + list.map(value => value.id));
        return result;
    };

    const handleDragEnd = (result: DropResult,) => {
        const {destination, source} = result;
        if (!destination) return;
        setUsersList(reorder(usersList, source.index, destination.index));
        console.log(source.index);
        console.log(destination.index);
        console.log(usersList);
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleRadioSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDrink(event.target.value);
    };

    const handleCheckbox1Selection = (event: React.MouseEvent<HTMLInputElement>) => {
        console.log("checkbox selection changes!");
    }
    const handleCheckbox2Selection = (event: React.MouseEvent<HTMLInputElement>) => {
        console.log("checkbox selection changes also there!");
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

    const searchedStories = stories.filter((story) =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <InputWithLabel id="search"
                // label="Search"
                            value={searchTerm}
                            isFocused={true}
                            onInputChange={handleSearch}
            >
                <strong>Search:</strong>
            </InputWithLabel>

            <List list={searchedStories}/>

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

        </div>
    );
};

export default App;