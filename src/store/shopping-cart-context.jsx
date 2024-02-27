import { createContext, useReducer, useState } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

const ADD_ITEM = 'ADD_ITEM';
const UPDATE_QTY = 'UPDATE_QTY';

export const CartContext = createContext({
  items: [],
  addItemToCart: () => {},
  updateQtyInCart: () => {},
});

function shoppingCartReducer(state, action) {
  let {type, payload} = action

  if(type === ADD_ITEM){
    //payload === id
    const updatedItems = [...state.items];

      const existingCartItemIndex = updatedItems.findIndex(
        (cartItem) => cartItem.id === payload
      );
      const existingCartItem = updatedItems[existingCartItemIndex];

      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          quantity: existingCartItem.quantity + 1,
        };
        updatedItems[existingCartItemIndex] = updatedItem;
      } else {
        const product = DUMMY_PRODUCTS.find((product) => product.id === payload);
        updatedItems.push({
          id: payload,
          name: product.title,
          price: product.price,
          quantity: 1,
        });
      }

      return {
        ...state,
        items: updatedItems,
      };
  }

  if(type === UPDATE_QTY){
    let {productId, amount} = payload;
    const updatedItems = [...state.items];
      const updatedItemIndex = updatedItems.findIndex(
        (item) => item.id === productId
      );

      const updatedItem = {
        ...updatedItems[updatedItemIndex],
      };

      updatedItem.quantity += amount;

      if (updatedItem.quantity <= 0) {
        updatedItems.splice(updatedItemIndex, 1);
      } else {
        updatedItems[updatedItemIndex] = updatedItem;
      }

      return {
        ...state,
        items: updatedItems,
      };
  }

  return state;
}

export default function CartContextProvider({ children }) {
  const [cartState, cartStateDispatch] = useReducer(shoppingCartReducer, {
    items: [],
  });

  function handleAddItemToCart(id) {
    cartStateDispatch({
      type: ADD_ITEM,
      payload: id
    })

  }

  function handleUpdateCartItemQuantity(productId, amount) {
    cartStateDispatch({
      type: UPDATE_QTY,
      payload: {productId, amount}
    })
  }

  const ctxValue = {
    items: cartState.items,
    addItemToCart: handleAddItemToCart,
    updateQtyInCart: handleUpdateCartItemQuantity,
  };

  return (
    <CartContext.Provider value={ctxValue}>{children}</CartContext.Provider>
  );
}
