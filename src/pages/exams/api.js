import { endPoints } from "../../constants/endPoints";
import { roles } from "../../constants/enums";
import axiosInstance from "../../utils/axios";

export const getMyExamsApi = async (role, profileId) => {
  if (role === roles.admin) return null;
  const params = {
    limit: 100,
    page: 1,
  };

  const url =
    role === roles.teacher ? endPoints.courses : endPoints["student-courses"];

  if (role === roles.student) params.studentId = profileId;
  else params.teacherId = profileId;

  const { data } = await axiosInstance.get(url, {
    params,
  });
  return data?.data;
};
