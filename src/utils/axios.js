import axios from "axios";
import Cookies from "js-cookie";
export const baseURL = `http://127.0.0.1:8000/api/`;

const axiosInstance = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${Cookies.get("school-token")}` },
});

export default axiosInstance;
