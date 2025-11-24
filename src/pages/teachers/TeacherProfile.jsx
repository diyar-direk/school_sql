import "../../components/profile.css";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { pagesRoute } from "../../constants/pagesRoute";
import dateFormatter from "./../../utils/dateFormatter";
import TeacherCourse from "./TeacherCourse";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
import Skeleton from "../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.teachers);
const TeacherProfile = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.teachers, id],
    queryFn: () => apiClient.getOne(id),
  });

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || false;

  const { t } = useTranslation();

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container">
      <h1 className="title"> {data?.firstName + " " + data?.lastName} </h1>
      <div className="profile">
        <div className="image">
          <i className=" photo fa-solid fa-user" />
          {isAdmin && (
            <Link to={pagesRoute.teacher.update(id)} className="center gap-10">
              {t("teachers.edit_btn")}
              <i className="fa-regular fa-pen-to-square" />
            </Link>
          )}
        </div>
        <div className="info">
          {isAdmin && (
            <h2 className="name">
              <Link to={pagesRoute.teacher.update(id)}>
                <i className="fa-regular fa-pen-to-square" />
              </Link>
            </h2>
          )}

          <div className="flex">
            <h2>{t("teachers.first_name")}:</h2>
            <p> {data?.firstName} </p>
          </div>
          <div className="flex">
            <h2>{t("teachers.middle_name")}:</h2>
            <p>{data?.middleName}</p>
          </div>
          <div className="flex">
            <h2>{t("teachers.last_name")}:</h2>
            <p> {data?.lastName} </p>
          </div>
          <div className="flex">
            <h2>{t("teachers.gender")}:</h2>
            <p>{t(`enums.${data.gender}`)}</p>
          </div>

          <div className="flex">
            <h2>{t("teachers.email")}:</h2>
            <p className="email"> {data?.email} </p>
          </div>

          <div className="flex">
            <h2>{t("teachers.phone_number")}:</h2>
            <p>{data?.phoneNumber}</p>
          </div>
          <AllowedTo roles={[roles.admin]}>
            <div className="flex">
              <h2>{t("teachers.created_at")}:</h2>
              <p>{dateFormatter(data?.createdAt, "fullDate")}</p>
            </div>
          </AllowedTo>
        </div>
      </div>
      <h1 className="title"> {t("teachers.courses")} </h1>
      <TeacherCourse />
    </div>
  );
};

export default TeacherProfile;
