import { ADD_LIST, ADD_ITEM, REMOVE_ITEM, REMOVE_LIST } from '../actions';

export default function (lists = [], action) {
    switch (action.type) {
        case ADD_LIST:
            return [...lists,
            {
                title: action.title,
                items: [],
                key: lists.length
            }
            ];
        case ADD_ITEM:
            return lists.map(list => {
                if (list.key === action.listId) {
                    return {
                        ...list,
                        items: [
                            ...list.items.slice(0, action.targetIndex),
                            action.itemToAdd,
                            ...list.items.slice(action.targetIndex)
                        ]
                    };
                }
                return list;
            });
        case REMOVE_ITEM:
            return lists.map(list => {
                if (list.key === action.listId) {
                    let itemIndex = list.items.findIndex(item => item.key === action.key);
                    return {
                        ...list,
                        items: [
                            ...list.items.slice(0, itemIndex),
                            ...list.items.slice(itemIndex + 1)
                        ]
                    };
                }
                return list;
            });
        case REMOVE_LIST:
            return lists.filter(list => list.key !== action.listId);
        default:
            return lists;
    }
}