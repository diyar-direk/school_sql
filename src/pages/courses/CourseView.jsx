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

const api = new APIClient(endPoints.courses);
const CourseView = () => {
  const { id } = useParams();
  const { userDetails } = useAuth();
  const { isAdmin, profileId } = userDetails || {};
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.courses, id],
    queryFn: () => api.getOne(id),
  });

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
            <h2>{"language?.course?.name"} :</h2>
            <p>{data?.name}</p>
          </div>
          <div className="flex">
            <h2>{"language?.course?.code"} :</h2>
            <p>{data?.code}</p>
          </div>
          <div className="flex">
            <h2>{"language?.course?.description"} :</h2>
            <p>{data?.description}</p>
          </div>

          <div className="flex">
            <h2>{"language?.students?.teachers"} :</h2>
            <p>
              {spritObject(data?.teacherId, (e) => (
                <Link
                  to={pagesRoute.teacher.view(e._id)}
                  className="visit-text"
                >
                  {e.firstName} {e.lastName}
                </Link>
              ))}
            </p>
          </div>
          <div className="flex">
            <h2>{"language?.students?.created_at"} :</h2>
            <p>{dateFormatter(data?.createdAt, "fullDate")}</p>
          </div>
        </div>
      </div>
      <div className="course-pages">
        <NavLink to={pagesRoute.courses.timeTable(id)}> time table </NavLink>
        <NavLink to={pagesRoute.courses.exams(id)}> exams</NavLink>
        <AllowedTo roles={[roles.admin, roles.teacher]}>
          <NavLink to={pagesRoute.courses.students(id)}> students</NavLink>
          {(data?.teacherId?.some((e) => e?._id === profileId?._id) ||
            isAdmin) && (
            <NavLink to={pagesRoute.courses.attendance(id)}>attendance</NavLink>
          )}
        </AllowedTo>
      </div>
      <Outlet />
    </div>
  );
};

export default CourseView;
