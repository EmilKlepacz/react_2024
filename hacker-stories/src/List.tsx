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
                    <ButtonWithSVGSortingIcon
                        sortKeyColumn={SortKey.TITLE}
                        sortKey={sort.sortKey}
                        isReverse={sort.isReverse}
                        handleSort={handleSort}
                    />
                </span>
                <span style={{width: '30%'}}>
                    <ButtonWithSVGSortingIcon
                        sortKeyColumn={SortKey.AUTHOR}
                        sortKey={sort.sortKey}
                        isReverse={sort.isReverse}
                        handleSort={handleSort}
                    />
                </span>
                <span style={{width: '10%'}}>
                   <ButtonWithSVGSortingIcon
                       sortKeyColumn={SortKey.COMMENT}
                       sortKey={sort.sortKey}
                       isReverse={sort.isReverse}
                       handleSort={handleSort}
                   />
                </span>
                <span style={{width: '10%'}}>
                   <ButtonWithSVGSortingIcon
                       sortKeyColumn={SortKey.POINTS}
                       sortKey={sort.sortKey}
                       isReverse={sort.isReverse}
                       handleSort={handleSort}
                   />
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

type ButtonWithSVGSortingIconProps = {
    sortKeyColumn: SortKey,
    sortKey: SortKey,
    isReverse: boolean,
    handleSort: (sortKey: SortKey) => void
}

const ButtonWithSVGSortingIcon =
    ({sortKeyColumn, sortKey, isReverse, handleSort}: ButtonWithSVGSortingIconProps) => {
        return (
            <div>
                <button
                    style={{
                        backgroundColor: sortKey === sortKeyColumn ? 'lightblue' : 'transparent',
                    }}
                    type="button" onClick={() => handleSort(sortKeyColumn)}>
                    {sortKeyColumn === SortKey.TITLE ? 'TITLE' : ''}
                    {sortKeyColumn === SortKey.AUTHOR ? 'AUTHOR' : ''}
                    {sortKeyColumn === SortKey.POINTS ? 'POINTS' : ''}
                    {sortKeyColumn === SortKey.COMMENT ? 'COMMENTS' : ''}
                </button>
                {sortKey === sortKeyColumn && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="16"
                        width="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{marginLeft: '8px'}} // Add some space between the text and the icon
                    >
                        <path d={isReverse ? "M18 15l-6-6-6 6" : "M6 9l6 6 6-6"}/>
                    </svg>
                )}
            </div>
        );
    }

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