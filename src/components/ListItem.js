import React, { Component } from 'react';
import { ItemTypes } from '../constants.js';
import { DragSource, DropTarget } from 'react-dnd';

const listItemSource = {
    beginDrag(props) {
        return {
            item: props.item,
            index: props.index,
            listId: props.listId
        };
    }
};

const itemDropTarget = {
    hover(props, monitor) {
        console.log(monitor.getItem());
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
        this.props.removeItemListener(this.props.index);
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