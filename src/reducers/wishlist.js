import { FETCH_WISHLIST } from "../actions/types";

const initialState = {
  shoppingWishList: [],
  numberOfWishListProducts: 0,
};

const fetchWishList = (state, action) => {
  return {
    ...state,
    shoppingWishList: state.data.order_products,
    numberOfWishListProducts: state.data.total_quantity,
  };
};

const wishListReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_WISHLIST:
      return fetchWishList(action, state);
    default:
      return state;
  }
};
export default wishListReducer;
