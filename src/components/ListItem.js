import React from 'react';
import { ItemTypes } from '../constants.js';
import { DragSource, DropTarget } from 'react-dnd';

const listItemSource = {
    beginDrag(props) {
        return {
            dragSource: { key: props.id, value: props.item },
            listId: props.listId
        };
    }
};

const itemDropTarget = (function () {
    let hoverCalled = false;
    return {
        hover(props, monitor) {
            if (!hoverCalled) {
                console.log(`hover on ${props.item} of ${props.listId}`);
                hoverCalled = true;
                setTimeout(() => (hoverCalled = false), 250);
            }
        },
        drop(props, monitor) {
            props.itemDropListener(props.id, monitor.getItem());
        }
    };

})();

function dragCollect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

function dropCollect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    }
}

function ListItem({ connectDragSource, connectDropTarget, isDragging, ...props }) {
    return connectDropTarget(connectDragSource(
        <div className="item_container">
            <div className="item" style={{ opacity: isDragging ? 0.5 : 1 }}>
                {props.item}
                <span onClick={() => props.removeItemListener(props.listId, { key: props.id, value: props.item })}>
                    x
                    </span>
            </div>
        </div>
    ));
}

export default DropTarget(ItemTypes.KNIGHT, itemDropTarget, dropCollect)(
    DragSource(ItemTypes.KNIGHT, listItemSource, dragCollect)(ListItem)
);