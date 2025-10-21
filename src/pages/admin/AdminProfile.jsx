import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
const AdminProfile = () => {
  const context = useContext(Context);
  const language = context?.selectedLang;

  const { userDetails } = useAuth();
  const [data, setData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    teachersFemale: false,
    teachersMale: false,
    studentsMale: false,
    studentsFemale: false,
    classes: false,
  });
  useEffect(() => {
    async function fetchData() {
      try {
        const teachers = await axiosInstance.get("teachers/count-gender");
        const students = await axiosInstance.get("students/count-gender");
        const classes = await axiosInstance.get("classes/count");

        setData({
          teachersFemale: teachers.data.numberOfFemaleTeachers,
          teachersMale: teachers.data.numberOfMaleTeachers,
          studentsMale: students.data.numberOfFemaleStudents,
          studentsFemale: students.data.numberOfMaleStudents,
          email: userDetails?.profileId?.email,
          firstName: userDetails?.profileId?.firstName,
          lastName: userDetails?.profileId?.lastName,
          role: userDetails?.role,
          classes: classes.data.numberOfDocuments,
        });
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container">
          <div className="grid-3 admin-page gap-20">
            <article className="center">
              <i className="fa-solid fa-people-group teacher"></i>
              <div className="flex-1">
                <h2 className="flex gap-10">
                  <p>
                    {" "}
                    {data.teachersFemale
                      ? `${data.teachersFemale + data.teachersMale}`
                      : "..."}
                  </p>
                  {language.dashboard && language.dashboard.teachers}
                </h2>
                <div className="flex gap-20">
                  <h3 className="center flex-direction">
                    {language.dashboard && language.dashboard.female} <br />
                    <span>
                      {data.teachersFemale ? data.teachersFemale : "..."}
                    </span>
                  </h3>
                  <h3 className="center flex-direction">
                    {language.dashboard && language.dashboard.male} <br />
                    <span>{data.teachersMale ? data.teachersMale : "..."}</span>
                  </h3>
                </div>
              </div>
            </article>
            <article className="center">
              <i className="fa-solid fa-children student"></i>
              <div className="flex-1">
                <h2 className="flex gap-10">
                  <p>
                    {" "}
                    {data.studentsMale
                      ? `${data.studentsFemale + data.studentsMale}`
                      : "..."}
                  </p>
                  {language.dashboard && language.dashboard.stundets}
                </h2>
                <div className="flex gap-20">
                  <h3 className="center flex-direction">
                    {language.dashboard && language.dashboard.female} <br />
                    <span>
                      {data.studentsFemale ? data.studentsFemale : "..."}
                    </span>
                  </h3>
                  <h3 className="center flex-direction">
                    {language.dashboard && language.dashboard.male} <br />
                    <span>{data.studentsMale ? data.studentsMale : "..."}</span>
                  </h3>
                </div>
              </div>
            </article>
            <article className="center">
              <i className="fa-solid fa-school-flag classes"></i>
              <div className="flex-1">
                <h2 className="flex gap-10">
                  <p> {data.classes ? data.classes : "..."}</p>
                  {language.dashboard && language.dashboard.classes}
                </h2>
              </div>
            </article>
          </div>
          <div className="profile admin">
            <div className="image">
              <i className=" photo fa-solid fa-user"></i>
            </div>
            <div className="info">
              <h2 className="name">
                <Link to={`/update_admin/${userDetails?._id}`}>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              </h2>

              <div className="flex">
                <h2>{language.dashboard && language.dashboard.first_name}</h2>
                <p> {data.firstName} </p>
              </div>

              <div className="flex">
                <h2>{language.dashboard && language.dashboard.last_name}</h2>
                <p> {data.lastName} </p>
              </div>
              <div className="flex">
                <h2>{language.dashboard && language.dashboard.role}</h2>
                <p> {data.role} </p>
              </div>

              <div className="flex">
                <h2>{language.dashboard && language.dashboard.email}</h2>
                <p className="email"> {data.email} </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminProfile;
