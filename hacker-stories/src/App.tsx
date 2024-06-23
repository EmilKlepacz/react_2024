import * as React from 'react';

type Story = {
    title: string;
    url: string;
    author: string;
    num_comments: number;
    points: number;
    objectID: number;
};

const App = () => {
    const [searchTerm, setSearchTerm] = React.useState('React');

    const handleSearch = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setSearchTerm(event.target.value);
    };

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

    const searchedStories = stories.filter(function (story) {
        return story.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <h1>My Hacker Stories</h1>

            <Search onSearch={handleSearch} search={searchTerm}/>

            <hr/>

            <List list={searchedStories}/>
        </div>
    );
};

type SearchProps = {
    onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    search: string
};

const Search = (props: SearchProps) => {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input id="search"
                   type="text"
                   value={props.search}
                   onChange={props.onSearch}/>

        </div>
    );
};

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

export default App;