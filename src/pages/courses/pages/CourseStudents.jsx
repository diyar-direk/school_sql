import "../../students/student.css";
import { courseStatus, roles } from "../../../constants/enums";
import { useInfiniteFetch } from "../../../hooks/useInfiniteFetch";
import { endPoints } from "../../../constants/endPoints";
import { Link, useParams } from "react-router-dom";
import { pagesRoute } from "../../../constants/pagesRoute";
import AddStudentsToCourse from "../components/AddStudentsToCourse";
import AllowedTo from "../../../components/AllowedTo";
const CourseStudents = () => {
  const { id } = useParams();
  const {
    data: student,
    isFetching,
    loadMoreRef,
  } = useInfiniteFetch({
    endPoint: endPoints["student-courses"],
    courseId: id,
  });
  const students = student?.pages?.[0]?.data;

  return (
    <>
      {students?.length === 0 && !isFetching && <h3> no students yet </h3>}

      <AllowedTo roles={[roles.admin]}>
        <AddStudentsToCourse courseId={id} />
      </AllowedTo>

      <div className="grid-3" style={{ marginTop: "10px" }}>
        {students?.map((data) => (
          <div className={`student-course ${data?.status}`} key={data?._id}>
            <div>
              <h3>name</h3>
              <Link
                className="visit-text"
                to={pagesRoute.student.view(data?.studentId?._id)}
              >
                {data?.studentId?.firstName} {data?.studentId?.middleName}{" "}
                {data?.studentId?.lastName}
              </Link>
            </div>
            <div>
              <h3>status</h3>
              {data?.status === courseStatus.Dropped ? (
                <span>
                  <i className="fa-solid fa-circle-xmark" /> {data?.status}
                </span>
              ) : data?.status === courseStatus.Active ? (
                <span>
                  <i className="fa-solid fa-hourglass-half" /> {data?.status}
                </span>
              ) : (
                <span>
                  <i className="fa-solid fa-circle-check" /> {data?.status}
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={loadMoreRef} />
      </div>
      {isFetching && <h3> loading... </h3>}
    </>
  );
};

export default CourseStudents;
