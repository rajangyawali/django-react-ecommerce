import { FETCH_CART } from "../actions/types";

const initialState = {
  shoppingCart: [],
  numberOfCartProducts: 0,
};

const fetchCart = (state, action) => {
  return {
    ...state,
    shoppingCart: state.data.order_products,
    numberOfCartProducts: state.data.total_quantity,
  };
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART:
      return fetchCart(action, state);
    default:
      return state;
  }
};
export default cartReducer;
