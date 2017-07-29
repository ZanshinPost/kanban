import React, { Component } from 'react';
import { ItemTypes } from '../constants.js';
import { DragSource, DropTarget } from 'react-dnd';

const listItemSource = {
    beginDrag(props) {
        return {
            item: { key: props.id, value: props.item },
            listId: props.listId
        };
    }
};

// const itemDropTarget = (function () {
//     let hoverCalled = false;
//     return {
//         hover(props, monitor) {
//             if (!hoverCalled) {
//                 props.itemHoverListener({
//                     'target': [props.listId, props.id, props.item],
//                     'source': [monitor.getItem().listId, monitor.getItem().id, monitor.getItem().item]
//                 });
//                 hoverCalled = true;
//                 setTimeout(() => (hoverCalled = false), 250);
//             }
//         }
//     };

// })();

const itemDropTarget = {
    drop(props, monitor) {
        props.itemDropListener(props.id, monitor.getItem());
    }
};

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

class ListItem extends Component {
    onClickListener(e) {
        this.props.removeItemListener(this.props.listId, { key: this.props.id, value: this.props.item });
    }

    render() {
        const { connectDragSource, connectDropTarget, isDragging } = this.props;

        return connectDropTarget(connectDragSource(
            <div className="item" style={{ opacity: isDragging ? 0.5 : 1 }}>
                {this.props.item}
                <span onClick={this.onClickListener.bind(this)}>x</span>
            </div>
        ));
    }
}

export default DropTarget(ItemTypes.KNIGHT, itemDropTarget, dropCollect)(
    DragSource(ItemTypes.KNIGHT, listItemSource, dragCollect)(ListItem)
);