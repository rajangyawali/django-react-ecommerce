import { FETCH_CART } from "./types";
import axios from "axios";
import { orderSummaryUrl } from "../constants";

const config = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchProductFromCart = (data) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_CART,
      data: data,
    });
  };
};

export const fetchCart = () => {
  return (dispatch) => {
    axios
      .get(orderSummaryUrl, config(localStorage.getItem("token")))
      .then((res) => {
        dispatch(fetchProductFromCart(res.data));
      })
      .catch((err) => {});
  };
};
