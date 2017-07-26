import React, { Component } from 'react';
import ListItem from './ListItem.js';
import { ItemTypes } from '../constants.js';
import { DropTarget } from 'react-dnd';

const itemTarget = {
    drop(props, monitor) {
        let itemObj = monitor.getItem();
        props.updateList(props.id, itemObj.index, itemObj.item);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class List extends Component {
    constructor(props) {
        super(props);
        this.onKeyPressListener = this.onKeyPressListener.bind(this);
        this.removeItemListener = this.removeItemListener.bind(this);
        this.removeListListener = this.removeListListener.bind(this);
    }

    onKeyPressListener(e) {
        if (e.charCode === 13 && e.target.value.trim().length > 0) {
            if (this.props.title)
                this.props.addItemListener(this.props.id, e.target.value);
            else
                this.props.addListListener(e.target.value);
            e.target.value = '';
        }
    }

    removeItemListener(index) {
        this.props.removeItemListener(this.props.id, index);
    }

    removeListListener() {
        this.props.removeListListener(this.props.id);
    }

    render() {
        const { connectDropTarget } = this.props;
        if (this.props.title) {
            const items = this.props.items.map((item, i) => (
                <ListItem key={i}
                    index={i}
                    listId={this.props.id}
                    item={item}
                    removeItemListener={this.removeItemListener}
                    itemHoverListener={this.props.itemHoverListener} />
            ));

            return connectDropTarget(
                <div className="list">
                    <span style={{ float: 'right', cursor: 'pointer', margin: 0 }} onClick={this.removeListListener}>x</span>
                    <h3>{this.props.title}</h3>
                    {items}
                    <input placeholder="Enter new task..."
                        onKeyPress={this.onKeyPressListener} />
                </div>
            );
        } else {
            return (
                <div className="list">
                    <input placeholder="Create new list..."
                        onKeyPress={this.onKeyPressListener} />
                </div>
            );
        }
    }
}

export default DropTarget(ItemTypes.KNIGHT, itemTarget, collect)(List);