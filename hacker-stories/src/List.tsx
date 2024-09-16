import {Story} from "./App.tsx";
import React from "react";
import {sortBy} from 'lodash';

type ListProps = {
    list: Story[],
    onRemoveItem: (item: Story) => void
};

const SORTS: Record<string, (list: Story[]) => Story[]> = {
    NONE: (list: Story[]) => list,
    TITLE: (list: Story[]) => sortBy(list, 'title'),
    AUTHOR: (list: Story[]) => sortBy(list, 'author'),
    COMMENT: (list: Story[]) => sortBy(list, 'num_comments').reverse(),
    POINTS: (list: Story[]) => sortBy(list, 'points'),
};

const List = ({list, onRemoveItem}: ListProps) => {
    const [sort, setSort] = React.useState('NONE');

    const handleSort = (sortKey: string) => {
        setSort(sortKey);
    }

    const sortFunction: (list: Story[]) => Story[] = SORTS[sort];
    const sortedList: Story[] = sortFunction(list);

    return (
        <ul>
            <li style={{display: 'flex'}}>
                <span style={{width: '40%'}}>
                    <button
                        style={{
                            backgroundColor: sort === 'TITLE' ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort('TITLE')}>Title
                    </button>
                </span>
                <span style={{width: '30%'}}>
                    <button
                        style={{
                            backgroundColor: sort === 'AUTHOR' ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort('AUTHOR')}>Author
                    </button>
                </span>
                <span style={{width: '10%'}}>
                    <button
                        style={{
                            backgroundColor: sort === 'COMMENT' ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort('COMMENT')}>Comments
                    </button>
                </span>
                <span style={{width: '10%'}}>
                    <button
                        style={{
                            backgroundColor: sort === 'POINTS' ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort('POINTS')}>Points
                    </button>
                </span>
                <span style={{width: '10%'}}>
                    Actions
                </span>
            </li>

            {sortedList.map((item) => (
                <Item
                    key={item.objectID}
                    item={item}
                    onRemoveItem={onRemoveItem}
                />
            ))}
        </ul>
    )
};

type ItemProps = {
    item: Story,
    onRemoveItem: (item: Story) => void
};

const Item = ({item, onRemoveItem}: ItemProps) => {
    return (
        <li style={{display: "flex"}}>
            <span style={{width: '40%'}}><a href={item.url}>{item.title}</a></span>
            <span style={{width: '30%'}}> {item.author} </span>
            <span style={{width: '10%'}}> {item.num_comments} </span>
            <span style={{width: '10%'}}> {item.points} </span>
            <span style={{width: '10%'}}>
                <button type="button" onClick={() => onRemoveItem(item)}>Remove item</button>
            </span>
        </li>
    );
};

export {List, Item};