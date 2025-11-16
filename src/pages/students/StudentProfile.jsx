import { useContext, useState } from "react";
import "../../components/profile.css";
import { Context } from "../../context/Context";
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
const apiClient = new APIClient(endPoints.students);
const StudentProfile = () => {
  const { isAdmin } = useAuth();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.students, id],
    queryFn: () => apiClient.getOne(id),
  });

  const context = useContext(Context);
  const language = context?.selectedLang;

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
              {language?.students?.edit_btn}
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
            <h2>{"language?.students?.name"} :</h2>
            <p>
              {data?.firstName} {data?.middleName} {data?.lastName}
            </p>
          </div>
          <div className="flex">
            <h2>{language?.students?.gender} :</h2>
            <p> {data?.gender} </p>
          </div>

          <div className="flex">
            <h2>{language?.students?.date_of_birth} :</h2>
            <p> {dateFormatter(data?.dateOfBirth)} </p>
          </div>

          <div className="flex">
            <h2>{language?.students?.email} :</h2>
            <p className="email">{data?.email}</p>
          </div>
          <div className="flex">
            <h2>{language?.students?.phone} :</h2>
            <p>{data?.phoneNumber}</p>
          </div>

          <div className="flex">
            <h2>{language?.students?.enrollment_date} :</h2>
            <p>{dateFormatter(data?.enrollmentDate)}</p>
          </div>

          <div className="flex">
            <h2>{"language?.students?.guardianName"} :</h2>
            <p>{data?.guardianName}</p>
          </div>
          <div className="flex">
            <h2>{"language?.students?.guardianRelationship"} :</h2>
            <p>{data?.guardianRelationship}</p>
          </div>
          <div className="flex">
            <h2>{"language?.students?.guardianPhone"} :</h2>
            <p>{data?.guardianPhone}</p>
          </div>
          <div className="flex">
            <h2>{"language?.students?.created_at"} :</h2>
            <p>{dateFormatter(data?.createdAt, "fullDate")}</p>
          </div>
        </div>
      </div>
      <h1 className="title"> courses </h1>
      <AllowedTo roles={[roles.admin]}>
        <AddStudentCourse
          studentId={id}
          isUpdate={updatedCourse}
          setIsUpdate={setUpdatedCourse}
        />
      </AllowedTo>
      {courses?.length === 0 && !isFetching && <h3> no course yet </h3>}
      <div className="grid-3" style={{ marginTop: "10px" }}>
        {courses?.map((e) => (
          <StudentCourse
            key={e?._id}
            data={e}
            studentId={id}
            setUpdatedCourse={setUpdatedCourse}
          />
        ))}

        <div ref={loadMoreRef} />
      </div>
      {isFetching && <h3 className="font-color"> loading... </h3>}
    </div>
  );
};

export default StudentProfile;
