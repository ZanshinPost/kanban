import React, { Component } from 'react';
import Header from './components/Header';
import Board from './components/Board';
import 'normalize.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Board />
      </div>
    );
  }
}

export default App;
