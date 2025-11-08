import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import { countDocs } from "./api";
import "../../components/profile.css";
import { pagesRoute } from "../../constants/pagesRoute";
import Skeleton from "./../../components/skeleton/Skeleton";
const AdminProfile = () => {
  const context = useContext(Context);
  const language = context?.selectedLang;

  const { userDetails } = useAuth();
  const { profileId } = userDetails || {};

  const { data, isLoading } = useQuery({
    queryKey: [endPoints?.count],
    queryFn: () => countDocs(),
  });

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container">
      <div className="admin-page gap-20">
        <article className="center">
          <i className="fa-solid fa-people-group teacher" />
          <div className="flex-1">
            <h2 className="flex gap-10">
              <p>
                {`${data?.femaleTeacherCount + data?.maleTeacherCount}` ||
                  "..."}
              </p>
              {language?.dashboard?.teachers}
            </h2>
            <div className="flex gap-20">
              <h3 className="center flex-direction">
                {language?.dashboard?.female} <br />
                <span>{data?.femaleTeacherCount || "..."}</span>
              </h3>
              <h3 className="center flex-direction">
                {language?.dashboard?.male} <br />
                <span>{data?.maleTeacherCount || "..."}</span>
              </h3>
            </div>
          </div>
        </article>
        <article className="center">
          <i className="fa-solid fa-children student" />
          <div className="flex-1">
            <h2 className="flex gap-10">
              <p>
                {`${data?.femaleStudentCount + data?.maleStudentCount}` ||
                  "..."}
              </p>
              {language?.dashboard?.stundets}
            </h2>
            <div className="flex gap-20">
              <h3 className="center flex-direction">
                {language?.dashboard?.female} <br />
                <span>{data?.femaleStudentCount || "..."}</span>
              </h3>
              <h3 className="center flex-direction">
                {language?.dashboard?.male} <br />
                <span>{data?.maleStudentCount || "..."}</span>
              </h3>
            </div>
          </div>
        </article>
        <article className="center">
          <i className="fa-solid fa-school-flag classes" />
          <div className="flex-1">
            <h2 className="flex gap-10">
              <p> {data?.classCount || "..."}</p>
              {language?.dashboard?.classes}
            </h2>
          </div>
        </article>

        <article className="center">
          <i className="fa-solid fa-pen-nib courses" />
          <div className="flex-1">
            <h2 className="flex gap-10">
              <p> {data?.courseCount || "..."}</p>
              {"language?.dashboard?.course"}
            </h2>
          </div>
        </article>
      </div>
      <div className="profile admin">
        <div className="image">
          <i className=" photo fa-solid fa-user" />
        </div>
        <div className="info">
          <h2 className="name">
            <Link to={pagesRoute.admin.update(profileId?._id)}>
              <i className="fa-regular fa-pen-to-square" />
            </Link>
          </h2>

          <div className="flex">
            <h2>{language?.dashboard?.first_name}</h2>
            <p> {profileId?.firstName} </p>
          </div>

          <div className="flex">
            <h2>{language?.dashboard?.last_name}</h2>
            <p> {profileId?.lastName} </p>
          </div>
          <div className="flex">
            <h2>{language?.dashboard?.role}</h2>
            <p> {userDetails?.role} </p>
          </div>

          <div className="flex">
            <h2>{language?.dashboard?.email}</h2>
            <p className="email"> {profileId?.email} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
