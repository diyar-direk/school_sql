import { endPoints } from "../../constants/endPoints";
import axiosInstance from "../../utils/axios";

export const countDocs = async () => {
  const { data } = await axiosInstance.get(endPoints.count);
  return data?.data;
};
