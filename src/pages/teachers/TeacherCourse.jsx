import "./teacher.css";
import { useInfiniteFetch } from "./../../hooks/useInfiniteFetch";
import { endPoints } from "./../../constants/endPoints";
import { Link, useParams } from "react-router-dom";
import { pagesRoute } from "../../constants/pagesRoute";
import { useTranslation } from "react-i18next";
const TeacherCourse = () => {
  const { id } = useParams();
  const { data, loadMoreRef, isFetching } = useInfiniteFetch({
    endPoint: endPoints.courses,
    teacherId: id,
    fields: "name,code,description,id",
  });

  const { t } = useTranslation();
  const courses = data?.pages?.[0]?.data;
  if (courses?.length === 0 && !isFetching)
    return <h3 className="font-color"> {t("dashboard.no_courses_yet")} </h3>;

  return (
    <>
      <div className="grid-3">
        {courses?.map((e) => (
          <Link
            className="teacher-course"
            key={e?.id}
            to={pagesRoute.courses.view(e?.id)}
          >
            <div>
              <h3>{t("users.name")}</h3>
              <span> {e?.name} </span>
            </div>
            <div>
              <h3>{t("subject.code")}</h3>
              <span> {e?.code} </span>
            </div>
            {e?.description && (
              <div>
                <h3>{t("subject.description")}</h3>
                <span>{e?.description}</span>
              </div>
            )}
          </Link>
        ))}

        <div ref={loadMoreRef} />
      </div>
      {isFetching && <h3 className="font-color"> {t("subject.loading")} </h3>}
    </>
  );
};

export default TeacherCourse;
