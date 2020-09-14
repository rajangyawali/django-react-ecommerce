import axios from "axios";
import { endPoint } from "./constants";

export const authAxios = axios.create({
  baseURL: endPoint,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
