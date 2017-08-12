import React, { Component } from 'react';
import ListItem from './ListItem.js';
import DummyItem from './DummyItem.js';
import { ItemTypes } from '../constants.js';
import { DropTarget } from 'react-dnd';
import uuid from 'uuid';

let hoverCalled = false;
const itemTarget = {
    drop(props, monitor, component) {
        if (monitor.didDrop()) {
            return;
        }
        let targetIndex = getTargetIndexForDropAndHover(props, monitor, component);
        let { listId, dragSource } = monitor.getItem();
        callDropListeners(props, listId, props.id, dragSource, targetIndex);
    },
    hover(props, monitor, component) {
        if (!hoverCalled) {
            if (monitor.isOver({ shallow: true })) {
                let targetIndex = getTargetIndexForDropAndHover(props, monitor, component);
                props.showHover(props.id, targetIndex);
            }
            hoverCalled = true;
            setTimeout(() => hoverCalled = false, 250);
        }
    }
};

function getTargetIndexForDropAndHover(props, monitor, component) {
    let dropPos = monitor.getClientOffset().y;
    let titleBottomPos = component.title.getBoundingClientRect().bottom;
    return dropPos < titleBottomPos ? 0 : props.items.length;
}

function callDropListeners({ addItemListener, removeItemListener, showHover }, sourcelistId, targetListId, dragSource, targetIndex) {
    removeItemListener(sourcelistId, dragSource);
    addItemListener(targetListId, dragSource, targetIndex);
    showHover(undefined, undefined);
}

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
        this.itemHoverListener = this.itemHoverListener.bind(this);

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
        callDropListeners(this.props, listId, this.props.id, dragSource, targetIndex);
    }

    itemHoverListener(targetId) {
        let targetIndex = this.props.items.findIndex(item => item.key === targetId);
        this.props.showHover(this.props.id, targetIndex);
    }

    render() {
        const { connectDropTarget, hoverPos } = this.props;
        if (this.props.title) {
            const items = this.props.items.map((item, i) => (
                <ListItem key={i}
                    id={item.key}
                    listId={this.props.id}
                    item={item.value}
                    removeItemListener={this.props.removeItemListener}
                    itemDropListener={this.itemDropListener}
                    itemHoverListener={this.itemHoverListener} />
            ));
            if (hoverPos && hoverPos.listId === this.props.id) {
                const dummy = <DummyItem key="-1" />
                console.log(hoverPos.index);
                items.splice(hoverPos.index, 0, dummy);
            }
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