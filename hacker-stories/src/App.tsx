import './App.css'
import React from "react";

const list = [
    {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    }, {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
    }
];

const getTitle = (title: string) => title;

const App = () =>
    (
        <div>
            <h1>My Hacker News</h1>

            <h1>Hello {getTitle('React')}</h1>

            <Search/>

            <hr/>

            <List/>
        </div>
    )

const Search = () => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //sythetic event
        console.log(event);
        // value of target (here: input HTML element)
        console.log(event.target.value);
    };

    const handleOnBlur = (event: React.BaseSyntheticEvent) => {
        //sythetic event
        console.log("on blur triggered!");
        console.log(event);
        // value of target (here: input HTML element)
        console.log(event.target.value);
    }


    return (
        <div>
            <label htmlFor="search">Search:</label>
            <input id="search" type="text" onChange={handleChange} onBlur={handleOnBlur}/>
        </div>
    );

}

const List = () =>
    (
        <ul>
            {list.map((item) => (
                <li key={item.objectID}>
                            <span>
                                <a href={item.url}>{item.title}</a>
                            </span>
                    <span>{item.author}</span>
                    <span>{item.num_comments}</span>
                    <span>{item.points}</span>
                </li>
            ))}
        </ul>
    );


export default App
