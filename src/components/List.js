import React, { Component } from 'react';
import ListItem from './ListItem.js';
import DummyItem from './DummyItem.js';
import { ItemTypes } from '../constants.js';
import { DropTarget } from 'react-dnd';

const itemTarget = {
    drop(props, monitor, component) {
        let itemObj = monitor.getItem();
        props.updateList(props.id, itemObj.index, itemObj.item);
        component.setState({
            onHoverPos: undefined
        });
    },
    hover(props, monitor) {
        if (monitor.isOver({ shallow: true }) !== monitor.isOver()) {
            console.log('hovering');
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
        this.removeItemListener = this.removeItemListener.bind(this);
        this.removeListListener = this.removeListListener.bind(this);
        this.itemHoverListener = this.itemHoverListener.bind(this);

        this.state = {};
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

    itemHoverListener({ source, target }) {
        this.setState({
            onHoverPos: target[1]
        });
        this.props.itemHoverListener({ source, target });
    }

    componentDidUpdate(prevProps, prevState) {
        // if (prevState.onHoverPos !== undefined && !prevProps.isOver) {
        //     this.setState({
        //         onHoverPos: undefined
        //     });
        // }
    }

    render() {
        const { connectDropTarget, isOver } = this.props;
        if (this.props.title) {
            const items = this.props.items.map((item, i) => (
                <ListItem key={i}
                    index={i}
                    listId={this.props.id}
                    item={item}
                    removeItemListener={this.removeItemListener}
                    itemHoverListener={this.itemHoverListener} />
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