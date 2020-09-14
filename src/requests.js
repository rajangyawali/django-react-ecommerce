import axios from "axios";
import {
  addToCartUrl,
  orderProductDeleteUrl,
  orderSummaryUrl,
} from "../constants";

const config = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchCart = () => {
  axios
    .get(orderSummaryUrl, config(localStorage.getItem("token")))
    .then((res) => {
      dispatch(fetchProductFromCart(res.data));
    })
    .catch((err) => {});
};
