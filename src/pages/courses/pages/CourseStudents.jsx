import "../../students/student.css";
import { courseStatus, roles } from "../../../constants/enums";
import { useInfiniteFetch } from "../../../hooks/useInfiniteFetch";
import { endPoints } from "../../../constants/endPoints";
import { Link, useParams } from "react-router-dom";
import { pagesRoute } from "../../../constants/pagesRoute";
import AddStudentsToCourse from "../components/AddStudentsToCourse";
import AllowedTo from "../../../components/AllowedTo";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../../utils/ApiClient";
import ConfirmPopUp from "../../../components/popup/ConfirmPopUp";

const apiClient = new APIClient(
  `${endPoints["student-courses"]}/${endPoints["delete-many"]}`
);

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

  const { t } = useTranslation();

  const [isOptionOpen, setIsOptionOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isUpdate, setIsUpdate] = useState(null);

  const toggleOpenOptions = useCallback((e) => {
    e.stopPropagation();
    setIsOptionOpen((s) => !s);
  }, []);

  useEffect(() => {
    const handleClick = () => isOptionOpen && setIsOptionOpen(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [isOptionOpen]);
  const queryClient = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (data) => apiClient.deleteAll([data]),
    onSuccess: () => {
      setSelectedItem(null);
      setIsOptionOpen(false);
      queryClient.invalidateQueries([endPoints["student-courses"]]);
    },
  });

  return (
    <>
      {students?.length === 0 && !isFetching && (
        <h3> {t("students.no_students")} </h3>
      )}

      <AllowedTo roles={[roles.admin]}>
        <AddStudentsToCourse
          courseId={id}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
        />
      </AllowedTo>

      <div className="grid-3" style={{ marginTop: "10px" }}>
        {students?.map((data) => (
          <div className={`student-course ${data?.status}`} key={data?.id}>
            <AllowedTo roles={[roles.admin]}>
              <div className="options">
                <i
                  className="fa-solid fa-ellipsis-vertical"
                  onClick={toggleOpenOptions}
                />
                {isOptionOpen && (
                  <div>
                    <span
                      className="delete"
                      onClick={() => setSelectedItem(data?.id)}
                    >
                      <i className="fa-solid fa-trash" />
                      {t("examResult.delete")}
                    </span>
                    <span className="update" onClick={() => setIsUpdate(data)}>
                      <i className="fa-solid fa-pen-to-square" />
                      {t("examResult.update")}
                    </span>
                  </div>
                )}
              </div>
            </AllowedTo>

            <div>
              <h3>{t("students.name")}</h3>
              <Link
                className="visit-text"
                to={pagesRoute.student.view(data?.studentId)}
              >
                {data?.student?.firstName} {data?.student?.middleName}{" "}
                {data?.student?.lastName}
              </Link>
            </div>
            <div>
              <h3>{t("exams.status")}</h3>
              {data?.status === courseStatus.Dropped ? (
                <span>
                  <i className="fa-solid fa-circle-xmark" />
                  {t(`enums.${data?.status}`)}
                </span>
              ) : data?.status === courseStatus.Active ? (
                <span>
                  <i className="fa-solid fa-hourglass-half" />
                  {t(`enums.${data?.status}`)}
                </span>
              ) : (
                <span>
                  <i className="fa-solid fa-circle-check" />
                  {t(`enums.${data?.status}`)}
                </span>
              )}
            </div>
          </div>
        ))}

        <div ref={loadMoreRef} />
      </div>
      {isFetching && <h3 className="font-color"> {t("subject.loading")} </h3>}

      <AllowedTo roles={[roles.admin]}>
        <ConfirmPopUp
          isOpen={selectedItem}
          onClose={() => setSelectedItem(null)}
          onConfirm={() => handleConfirm.mutate(selectedItem)}
          confirmButtonProps={{
            isSending: handleConfirm.isPending,
            isSendingText: "deleting",
          }}
        />
      </AllowedTo>
    </>
  );
};

export default CourseStudents;
