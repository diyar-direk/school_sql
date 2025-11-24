import { useState } from "react";
import "../../components/profile.css";
import { useAuth } from "../../context/AuthContext";
import dateFormatter from "../../utils/dateFormatter";
import { Link, useParams } from "react-router-dom";
import { pagesRoute } from "./../../constants/pagesRoute";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import APIClient from "./../../utils/ApiClient";
import StudentCourse from "./StudentCourse";
import AddStudentCourse from "./AddStudentCourse";
import { useInfiniteFetch } from "../../hooks/useInfiniteFetch";
import AllowedTo from "./../../components/AllowedTo";
import { roles } from "../../constants/enums";
import Skeleton from "../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.students);
const StudentProfile = () => {
  const { isAdmin } = useAuth();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.students, id],
    queryFn: () => apiClient.getOne(id),
  });

  const { t } = useTranslation();

  const {
    data: course,
    isFetching,
    loadMoreRef,
  } = useInfiniteFetch({
    endPoint: endPoints["student-courses"],
    studentId: id,
  });
  const courses = course?.pages?.[0]?.data;

  const [updatedCourse, setUpdatedCourse] = useState(null);

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container">
      <h1 className="title"> {`${data?.firstName} ${data?.lastName}`} </h1>
      <div className="profile">
        <div className="image">
          <i className="photo fa-solid fa-user"></i>
          {isAdmin && (
            <Link to={pagesRoute.student.update(id)} className="center gap-10">
              {t("students.edit_btn")}
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
          )}
        </div>
        <div className="info">
          {isAdmin && (
            <h2 className="name">
              <Link to={pagesRoute.student.update(id)}>
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </h2>
          )}

          <div className="flex">
            <h2>{t("students.name")} :</h2>
            <p>
              {data?.firstName} {data?.middleName} {data?.lastName}
            </p>
          </div>
          <div className="flex">
            <h2>{t("students.gender")} :</h2>
            <p> {data?.gender} </p>
          </div>

          <div className="flex">
            <h2>{t("students.date_of_birth")} :</h2>
            <p> {dateFormatter(data?.dateOfBirth)} </p>
          </div>

          <div className="flex">
            <h2>{t("students.email")} :</h2>
            <p className="email">{data?.email}</p>
          </div>
          <div className="flex">
            <h2>{t("students.phone")} :</h2>
            <p>{data?.phone}</p>
          </div>

          <div className="flex">
            <h2>{t("students.enrollment_date")} :</h2>
            <p>{dateFormatter(data?.enrollmentDate)}</p>
          </div>

          <div className="flex">
            <h2>{t("students.guardian_name")} :</h2>
            <p>{data?.guardianName}</p>
          </div>
          <div className="flex">
            <h2>{t("students.relationship")} :</h2>
            <p>{data?.guardianRelationship}</p>
          </div>
          <div className="flex">
            <h2>{t("students.guardian_phone")} :</h2>
            <p>{data?.guardianPhone}</p>
          </div>
          <div className="flex">
            <h2>{t("createdAt")} :</h2>
            <p>{dateFormatter(data?.createdAt, "fullDate")}</p>
          </div>
        </div>
      </div>
      <h1 className="title"> {t("dashboard.courses")} </h1>
      <AllowedTo roles={[roles.admin]}>
        <AddStudentCourse
          studentId={id}
          isUpdate={updatedCourse}
          setIsUpdate={setUpdatedCourse}
        />
      </AllowedTo>
      {courses?.length === 0 && !isFetching && (
        <h3 className="font-color"> {t("dashboard.no_courses_yet")} </h3>
      )}
      <div className="grid-3" style={{ marginTop: "10px" }}>
        {courses?.map((e) => (
          <StudentCourse
            key={e?.id}
            data={e}
            studentId={id}
            setUpdatedCourse={setUpdatedCourse}
          />
        ))}

        <div ref={loadMoreRef} />
      </div>
      {isFetching && <h3 className="font-color"> {t("teachers.loading")} </h3>}
    </div>
  );
};

export default StudentProfile;
