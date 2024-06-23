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
    search: string;
};

const Search = ({onSearch, search}: SearchProps) => {
    return (
        <div>
            <label htmlFor="search">Search: </label>
            <input
                id="search"
                type="text"
                value={search}
                onChange={onSearch}
            />
        </div>
    );
};

type ListProps = {
    list: Story[];
};
const List = ({list}: ListProps) => (
    <ul>
        {list.map((item) => (
            <Item
                key={item.objectID}
                title={item.title}
                url={item.url}
                author={item.author}
                num_comments={item.num_comments}
                points={item.points}
            />
        ))}
    </ul>
);

type ItemProps = {
    title: string,
    url: string,
    author: string,
    num_comments: number,
    points: number,
};

const Item = ({title, url, author, num_comments, points}: ItemProps) => (
    <li>
    <span>
      <a href={url}>{title}</a>
    </span>
        <span>{author}</span>
        <span>{num_comments}</span>
        <span>{points}</span>
    </li>
);

export default App;