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

        this.addItemListener = this.addItemListener.bind(this);
        this.addListListener = this.addListListener.bind(this);
        this.removeItemListener = this.removeItemListener.bind(this);
    }

    componentWillUpdate() {
        localStorage.setItem('lists', JSON.stringify(this.state));
    }

    addItemListener(key, item) {
        this.setState((prevState) => {
            let list = prevState.lists.filter(list => list.key === key)[0];
            list && list.items.push(item);

            return prevState;
        });
    }

    addListListener(title) {
        this.setState((prevState) => {
            prevState.lists.push({ 'title': title, 'key': prevState.lists.length, 'items': [] });
            return prevState;
        });
    }

    removeItemListener(key, itemIndex) {
        this.setState((prevState) => {
            let list = prevState.lists.filter(list => list.key === key)[0];
            list.items.splice(itemIndex, 1);
            return prevState;
        });
    }

    render() {
        const Lists = this.state.lists.map(list => (
            <List key={list.key}
                id={list.key}
                title={list.title}
                items={list.items}
                addItemListener={this.addItemListener}
                removeItemListener={this.removeItemListener} />
        ));
        Lists.push(<List key={Lists.length} addListListener={this.addListListener} />);

        return (
            <div className="board">
                {Lists}
            </div>
        );
    }
}

export default DragDropContext(HTML5Backend)(Board);