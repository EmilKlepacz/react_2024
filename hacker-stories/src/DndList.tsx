import * as React from "react";
import {DragDropContext, Draggable, Droppable, DropResult} from "react-beautiful-dnd";
import {User} from "./App.tsx";

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

export {DndList, DndItem};