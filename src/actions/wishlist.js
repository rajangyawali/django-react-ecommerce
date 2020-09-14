import { FETCH_WISHLIST } from "./types";
import axios from "axios";
import { wishlistSummaryUrl } from "../constants";

const config = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const fetchProductFromWishList = (data) => {
  return (dispatch) => {
    dispatch({
      type: FETCH_WISHLIST,
      data: data,
    });
  };
};

export const fetchWishList = () => {
  return (dispatch) => {
    axios
      .get(wishlistSummaryUrl, config(localStorage.getItem("token")))
      .then((res) => {
        dispatch(fetchProductFromWishList(res.data));
      })
      .catch((err) => {});
  };
};
