import { combineReducers } from 'redux';
import lists from './lists';
import hoverPos from './hoverPos';

export default combineReducers({
    lists: lists,
    hoverPos: hoverPos
});