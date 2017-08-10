import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { loadState, saveState } from './store/localStorage';

let persistedState = loadState();

const store = configureStore(persistedState);

store.subscribe(() => saveState(store.getState()));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));