import {Story} from "./App.tsx";

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

export {List, Item};