import { SHOW_HOVER } from '../actions';

export default function (hoverPos = {}, action) {
    switch (action.type) {
        case SHOW_HOVER:
            return Object.assign({}, hoverPos, { listId: action.listId, index: action.index });
        default:
            return hoverPos;
    }
}