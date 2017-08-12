export const ADD_LIST = 'ADD_LIST';
export const ADD_ITEM = 'ADD_ITEM';
export const REMOVE_ITEM = 'REMOVE_ITEM';
export const REMOVE_LIST = 'REMOVE_LIST';
export const GET_LISTS = 'GET_LISTS';
export const SHOW_HOVER = 'SHOW_HOVER';

export function addList(title) {
    return {
        type: ADD_LIST,
        title
    }
}

export function getLists() {
    return {
        type: GET_LISTS
    }
}

export function addItem(listId, itemToAdd, targetIndex) {
    return {
        type: ADD_ITEM,
        listId, itemToAdd, targetIndex
    };
}

export function removeItem(listId, { key }) {
    return {
        type: REMOVE_ITEM,
        listId,
        key
    };
}

export function removeList(listId) {
    return {
        type: REMOVE_LIST,
        listId
    };
}

export function showHover(listId, index) {
    return {
        type: SHOW_HOVER,
        listId,
        index
    }
}