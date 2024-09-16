import {
    Story
} from "./App.tsx";
import React from "react";
import {sortBy} from 'lodash';

type ListProps = {
    list: Story[],
    onRemoveItem: (item: Story) => void
};

enum SortKey {
    NONE = 'NONE',
    TITLE = 'TITLE',
    AUTHOR = 'AUTHOR',
    COMMENT = 'COMMENT',
    POINTS = 'POINTS',
}

const SORTS: Record<SortKey, (list: Story[]) => Story[]> = {
    [SortKey.NONE]: (list: Story[]) => list,
    [SortKey.TITLE]: (list: Story[]) => sortBy(list, 'title'),
    [SortKey.AUTHOR]: (list: Story[]) => sortBy(list, 'author'),
    [SortKey.COMMENT]: (list: Story[]) => sortBy(list, 'num_comments').reverse(),
    [SortKey.POINTS]: (list: Story[]) => sortBy(list, 'points'),
};

const List = ({list, onRemoveItem}: ListProps) => {
    const [sort, setSort] = React.useState<{ sortKey: SortKey; isReverse: boolean }>({
        sortKey: SortKey.NONE,
        isReverse: false,
    });

    const handleSort = (sortKey: SortKey) => {
        const isReverse = sortKey === sort.sortKey && !sort.isReverse;
        setSort({sortKey, isReverse});
    }

    const sortFunction: (list: Story[]) => Story[] = SORTS[sort.sortKey];
    const sortedList: Story[] = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);

    return (
        <ul>
            <li style={{display: 'flex'}}>
                <span style={{width: '40%'}}>
                    <button
                        style={{
                            backgroundColor: sort.sortKey === SortKey.TITLE ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort(SortKey.TITLE)}>Title
                    </button>
                </span>
                <span style={{width: '30%'}}>
                    <button
                        style={{
                            backgroundColor: sort.sortKey === SortKey.AUTHOR ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort(SortKey.AUTHOR)}>Author
                    </button>
                </span>
                <span style={{width: '10%'}}>
                    <button
                        style={{
                            backgroundColor: sort.sortKey === SortKey.COMMENT ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort(SortKey.COMMENT)}>Comments
                    </button>
                </span>
                <span style={{width: '10%'}}>
                    <button
                        style={{
                            backgroundColor: sort.sortKey === SortKey.POINTS ? 'lightblue' : 'transparent',
                        }}
                        type="button" onClick={() => handleSort(SortKey.POINTS)}>Points
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