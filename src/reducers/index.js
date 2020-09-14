import { combineReducers } from "redux";

import alertReducer from "./alert";
import authReducer from "./auth";
import cartReducer from "./cart";
import wishListReducer from "./wishlist";

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishListReducer,
});

export default rootReducer;
