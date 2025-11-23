import axiosInstance from "./axios";

class APIClient {
  constructor(endPoint) {
    this.endPoint = endPoint;
  }
  getAll = async ({ page = 1, sort = {}, limit = 10, ...params }) => {
    const sortStatus = sort
      ? Object.values(sort)
          .filter((v) => v && v.trim() !== "")
          .join(",")
      : "";

    const allParams = {
      ...params,
      page,
      limit,
    };

    if (sortStatus) allParams.sort = sortStatus;

    const paramFilters = new URLSearchParams();

    Object.entries(allParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;

      if (typeof value === "object" && !Array.isArray(value)) {
        const cleanedObj = Object.fromEntries(
          Object.entries(value).filter(
            ([_, v]) => v !== null && v !== undefined && v !== ""
          )
        );

        if (Object.keys(cleanedObj).length > 0) {
          paramFilters.append(key, JSON.stringify(cleanedObj));
        }
      } else if (Array.isArray(value)) {
        const cleanedArray = value
          .map((v) => (typeof v === "object" ? v.id || v.value || null : v))
          .filter((v) => v !== null && v !== undefined && v !== "");

        if (cleanedArray.length > 0) {
          paramFilters.append(key, cleanedArray.join(","));
        }
      } else {
        paramFilters.append(key, value.id || value);
      }
    });

    const { data } = await axiosInstance.get(this.endPoint, {
      params: paramFilters,
    });

    const { total, data: d } = data;

    return {
      data: d || data,
      totalCount: total || 0,
      limit,
    };
  };

  getOne = async (id) => {
    const { data } = await axiosInstance.get(`${this.endPoint}/${id}`);

    return data?.data;
  };
  deleteAll = async (ids) => {
    await axiosInstance.patch(`${this.endPoint}`, {
      ids,
    });
  };
  deleteOne = async ({ id }) => {
    await axiosInstance.patch(`${this.endPoint}${id}/`);
  };
  addData = async (data) => {
    const res = await axiosInstance.post(this.endPoint, data);
    return res?.data?.data || res?.data;
  };
  updateData = async ({ data, id }) => {
    const res = await axiosInstance.patch(`${this.endPoint}/${id}`, data);
    return res.results;
  };
}
export default APIClient;
