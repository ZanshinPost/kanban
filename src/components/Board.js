import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List.js';

class Board extends Component {
    constructor(props) {
        super(props);
        this.currentOperation = {};

        this.itemHoverListener = this.itemHoverListener.bind(this);
        this.updateListAfterDrop = this.updateListAfterDrop.bind(this);
    }

    componentDidUpdate() {
        localStorage.setItem('lists', JSON.stringify(this.state));
    }

    updateListAfterDrop(listId, itemIndex, item) {
        let source = this.currentOperation.source;
        let target = this.currentOperation.target;

        if (!source && !target) {
            this.addItemListener(listId, item);
            return;
        }

        this.removeItemListener(source[0], itemIndex);
        if (!target && source[1] === itemIndex && source[2] === item) {
            this.addItemListener(listId, item);
            return;
        }
        let targetIndex = target[1];
        this.addItemListener(listId, item, targetIndex);
    }

    itemHoverListener({ source, target }) {
        this.currentOperation.source = source;
        this.currentOperation.target = target;
    }

    render() {
        const Lists = this.props.lists.map(list => (
            <List key={list.key}
                id={list.key}
                title={list.title}
                items={list.items}
                addItemListener={this.props.addItem}
                removeItemListener={this.props.removeItem}
                removeListListener={this.props.removeList} />
        ));
        Lists.push(<List key={-1} addListListener={this.props.addList} />);

        return (
            <div className="board">
                {Lists}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);