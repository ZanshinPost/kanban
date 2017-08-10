import React, { Component } from 'react';
import ListItem from './ListItem.js';
import DummyItem from './DummyItem.js';
import { ItemTypes } from '../constants.js';
import { DropTarget } from 'react-dnd';
import uuid from 'uuid';

const itemTarget = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        let dropPos = monitor.getClientOffset().y;
        let titleBottomPos = component.title.getBoundingClientRect().bottom;
        let targetIndex = dropPos < titleBottomPos ? 0 : props.items.length;
        let { listId, dragSource } = monitor.getItem();
        props.removeItemListener(listId, dragSource);
        props.addItemListener(props.id, dragSource, targetIndex);
    },
    hover(props, monitor) {
        if (monitor.isOver({ shallow: true })) {
            console.log(`hover over ${props.id}`);
        }
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver({ shallow: true })
    };
}

class List extends Component {
    constructor(props) {
        super(props);
        this.onKeyPressListener = this.onKeyPressListener.bind(this);
        this.itemDropListener = this.itemDropListener.bind(this);

        this.state = {};
    }

    onKeyPressListener(e) {
        if (e.charCode === 13 && e.target.value.trim().length > 0) {
            if (this.props.title) {
                let item = { key: uuid.v4(), value: e.target.value };
                this.props.addItemListener(this.props.id, item, this.props.items.length);
            }
            else {
                this.props.addListListener(e.target.value);
            }
            e.target.value = '';
        }
    }

    itemDropListener(targetId, { listId, dragSource }) {
        let targetIndex = this.props.items.findIndex(item => item.key === targetId);
        this.props.removeItemListener(listId, dragSource);
        this.props.addItemListener(this.props.id, dragSource, targetIndex);
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        if (this.props.title) {
            const items = this.props.items.map((item, i) => (
                <ListItem key={i}
                    id={item.key}
                    listId={this.props.id}
                    item={item.value}
                    removeItemListener={this.props.removeItemListener}
                    itemDropListener={this.itemDropListener} />
            ));
            // const dummy = <DummyItem key="-1" />

            // if (this.state.onHoverPos !== undefined) {
            //     items.splice(this.state.onHoverPos, 0, dummy);
            // } else if (isOver) {
            //     items.push(dummy);
            // } else {
            //     delete this.state.onHoverPos;
            // }

            return connectDropTarget(
                <div className="list">
                    <span style={{ float: 'right', cursor: 'pointer', margin: 0 }}
                        onClick={() => this.props.removeListListener(this.props.id)}>
                        x
                    </span>
                    <h3 ref={title => (this.title = title)}>
                        {this.props.title}
                    </h3>
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