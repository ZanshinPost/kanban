import React, { Component } from 'react';
import Header from '../components/Header';
import Board from '../components/Board';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from '../actions';
import 'normalize.css';
import '../App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Board lists={this.props.lists}
                    hoverPos={this.props.hoverPos}
                    addList={this.props.actions.addList}
                    addItem={this.props.actions.addItem}
                    removeItem={this.props.actions.removeItem}
                    removeList={this.props.actions.removeList}
                    showHover={this.props.actions.showHover} />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        lists: state.lists,
        hoverPos: state.hoverPos
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
