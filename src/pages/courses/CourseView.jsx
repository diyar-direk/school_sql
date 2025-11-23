import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, Outlet, useParams } from "react-router-dom";
import { endPoints } from "../../constants/endPoints";
import APIClient from "./../../utils/ApiClient";
import { useAuth } from "../../context/AuthContext";
import { pagesRoute } from "../../constants/pagesRoute";
import dateFormatter from "../../utils/dateFormatter";
import "../../components/profile.css";
import "./subjects.css";
import { spritObject } from "../../utils/spritObject";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
import Skeleton from "../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";

const api = new APIClient(endPoints.courses);
const CourseView = () => {
  const { id } = useParams();
  const { userDetails } = useAuth();
  const { isAdmin, profileId } = userDetails || {};
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.courses, id],
    queryFn: () => api.getOne(id),
  });
  const { t } = useTranslation();

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container">
      <div className="profile">
        <div className="info">
          {isAdmin && (
            <h2 className="name">
              <Link to={pagesRoute.courses.update(id)}>
                <i className="fa-regular fa-pen-to-square" />
              </Link>
            </h2>
          )}

          <div className="flex">
            <h2>{t("subject.name")} :</h2>
            <p>{data?.name}</p>
          </div>
          <div className="flex">
            <h2>{t("subject.code")} :</h2>
            <p>{data?.code}</p>
          </div>
          <div className="flex">
            <h2>{t("subject.description")} :</h2>
            <p>{data?.description}</p>
          </div>

          <div className="flex">
            <h2>{t("navBar.teachers")} :</h2>
            <p>
              {spritObject(data?.teacherId, (e) => (
                <Link to={pagesRoute.teacher.view(e.id)} className="visit-text">
                  {e.firstName} {e.lastName}
                </Link>
              ))}
            </p>
          </div>
          <div className="flex">
            <h2>{t("createdAt")} :</h2>
            <p>{dateFormatter(data?.createdAt, "fullDate")}</p>
          </div>
        </div>
      </div>
      <div className="course-pages">
        <NavLink to={pagesRoute.courses.timeTable(id)}>
          {t("navBar.time_table")}
        </NavLink>
        <NavLink to={pagesRoute.courses.exams(id)}> {t("navBar.exam")}</NavLink>
        <NavLink to={pagesRoute.courses.quiz(id)}>{t("navBar.quiz")}</NavLink>
        <AllowedTo roles={[roles.admin, roles.teacher]}>
          {(data?.teacherId?.some((e) => e?.id === profileId?.id) ||
            isAdmin) && (
            <>
              <NavLink to={pagesRoute.courses.students(id)}>
                {t("navBar.students")}
              </NavLink>
              <NavLink to={pagesRoute.courses.attendance(id)}>
                {t("navBar.attendance")}
              </NavLink>
            </>
          )}
        </AllowedTo>
      </div>
      <Outlet />
    </div>
  );
};

export default CourseView;
