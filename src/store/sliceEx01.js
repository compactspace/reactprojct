import { createSlice, createSelector } from "@reduxjs/toolkit";

let cart = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    increaseCount(state, action) {
      const item = state.find((obj) => obj.id === action.payload);
      if (item) {
        item.count += 1;
      }
    },
    decreaseCount(state, action) {
      const itemId = action.payload;
      const updatedState = state.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            count: Math.max(0, item.count - 1),
          };
        }
        return item;
      });
      return updatedState.filter((item) => item.count > 0);
    },
    insertItem(state, action) {
      const newItem = action.payload;
      const existingIndex = state.findIndex((obj) => obj.id === newItem.id);

      if (existingIndex === -1) {
        return [...state, newItem];
      } else {
        return state.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                count: item.count + newItem.count,
              }
            : item
        );
      }
    },
    clearCart() {
      return [];
    },
  },
});

export let { increaseCount, decreaseCount, insertItem, clearCart } = cart.actions;

export const selectCartItems = (state) => state.cart;

export const selectCartTotal = createSelector([selectCartItems], (cartItems) =>
  cartItems.reduce(
    (total, item) =>
      total +
      (item.discountPercent === 0
        ? item.price * item.count
        : (item.price * (100 - item.discountPercent)) / 100) *
        item.count,
    0
  )
);

export default cart;