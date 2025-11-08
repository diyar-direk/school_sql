import axios from "axios";
import Cookies from "js-cookie";
export const baseURL = `http://localhost:8000/api/`;

const axiosInstance = axios.create({
  baseURL,
  headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
});

export default axiosInstance;
