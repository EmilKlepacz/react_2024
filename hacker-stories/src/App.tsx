import * as React from 'react';

type Story = {
    objectID: number;
    url: string;
    title: string;
    author: string;
    num_comments: number;
    points: number;
};

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
    label: string,
    value: string,
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
};

const InputWithLabel = ({id, type = 'text', label, value, onInputChange}: InputWithLabelProps) => (
    <>
        <label htmlFor={id}>{label}</label> &nbsp;
        <input
            id={id}
            type={type}
            value={value}
            onChange={onInputChange}
        />
    </>
);

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

    const [searchTerm, setSearchTerm] = useStorageState('search', 'React');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // The selected drink
    const [selectedDrink, setSelectedDrink] = React.useState('');

    // This function will be triggered when a radio button is selected
    const handleRadioSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDrink(event.target.value);
    };

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
                            label="Search"
                            value={searchTerm}
                            onInputChange={handleSearch}/>

            <hr/>

            <List list={searchedStories}/>

            <hr/>

            {/*custom REUSABLE components examples*/}
            <Button onClick={onClickOne} text={'button 1'}/> <br/>
            <Button onClick={onClickTwo} text={'button 2'}/> <br/>
            <Button onClick={onClickThree} text={'button 3'}/> <br/>

            <DrinkRadioButton value={"Coffee"} id={"coffee"} onChange={handleRadioSelection}/>
            <DrinkRadioButton value={"Water"} id={"water"} onChange={handleRadioSelection}/>
            &nbsp;&nbsp;&nbsp; Selected drink: {selectedDrink}

        </div>
    );
};

export default App;