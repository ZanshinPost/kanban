import React from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import List from './List.js';

function Board(props) {
    const Lists = props.lists.map(list => (
        <List key={list.key}
            id={list.key}
            title={list.title}
            items={list.items}
            addItemListener={props.addItem}
            removeItemListener={props.removeItem}
            removeListListener={props.removeList} />
    ));
    Lists.push(<List key={-1} addListListener={props.addList} />);

    return (
        <div className="board">
            {Lists}
        </div>
    );
}

export default DragDropContext(HTML5Backend)(Board);