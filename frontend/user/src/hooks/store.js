// store.js
import { createStore } from 'redux';

// Action Types
const SEND_DATA = 'SEND_DATA';

// Action Creator
export const sendData = (data) => ({
    type: SEND_DATA,
    payload: data,
});

export const TOGGLE_ITEM_SELECTION = 'TOGGLE_ITEM_SELECTION';

export const toggleItemSelection = (id) => ({
    type: TOGGLE_ITEM_SELECTION,
    payload: id,
});

// Initial State
const initialState = {
    data: [], // Đảm bảo khởi tạo là một mảng
};

// Reducer
const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEND_DATA:
            return {
                ...state,
                data: [...state.data, action.payload], // Thêm sản phẩm vào mảng
            };
        case TOGGLE_ITEM_SELECTION:
            return {
                ...state,
                data: state.data.map(item =>
                    item.id === action.payload ? { ...item, selected: !item.selected } : item
                ),
            };
        default:
            return state;
    }
};

// Create Store
const store = createStore(dataReducer);

export default store;