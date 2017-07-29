import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List.js';

class Board extends Component {
    constructor(props) {
        super(props);
        let { lists } = JSON.parse(localStorage.getItem('lists')) || { lists: [] };
        this.state = {
            lists: lists
        };
        this.currentOperation = {};

        this.addItemListener = this.addItemListener.bind(this);
        this.addListListener = this.addListListener.bind(this);
        this.removeItemListener = this.removeItemListener.bind(this);
        this.removeListListener = this.removeListListener.bind(this);
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

    addItemListener(key, item, targetIndex) {
        this.setState((prevState) => {
            let list = prevState.lists.filter(list => list.key === key)[0];
            if (typeof targetIndex !== 'undefined') {
                list.items.splice(targetIndex, 0, item);
            } else {
                list.items.push(item);
            }

            return prevState;
        });
    }

    addListListener(title) {
        this.setState((prevState) => {
            prevState.lists.push({ 'title': title, 'key': prevState.lists.length, 'items': [] });
            return prevState;
        });
    }

    removeItemListener(listId, itemIndex) {
        this.setState((prevState) => {
            let list = prevState.lists.filter(list => list.key === listId)[0];
            list.items.splice(itemIndex, 1);
            return prevState;
        });
    }

    removeListListener(listId) {
        this.setState(prevState => ({
            lists: prevState.lists.filter(list => list.key !== listId)
        }));
    }

    render() {
        const Lists = this.state.lists.map(list => (
            <List key={list.key}
                id={list.key}
                title={list.title}
                items={list.items}
                updateList={this.updateListAfterDrop}
                addItemListener={this.addItemListener}
                removeItemListener={this.removeItemListener}
                removeListListener={this.removeListListener}
                itemHoverListener={this.itemHoverListener} />
        ));
        Lists.push(<List key={-1} addListListener={this.addListListener} />);

        return (
            <div className="board">
                {Lists}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);