import { useFormik } from "formik";
import { useCallback, useState } from "react";
import Button from "../../../components/buttons/Button";
import PopUp from "../../../components/popup/PopUp";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";
import { courseStatus } from "../../../constants/enums";
import * as yup from "yup";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import { endPoints } from "../../../constants/endPoints";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../../utils/ApiClient";
import { formatInputsData } from "../../../utils/formatInputsData";
import { useTranslation } from "react-i18next";

const AddStudentsToCourse = ({ courseId, isUpdate, setIsUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const api = new APIClient(endPoints["student-courses"]);
  const formik = useFormik({
    initialValues: {
      courseId,
      studentId: isUpdate?.student || "",
      status: isUpdate?.status || "",
    },
    validationSchema: yup.object({
      studentId: yup.object().required("error.please_choose_student"),
      status: yup
        .string()
        .required("error.please_choose_course_status")
        .oneOf(Object.values(courseStatus)),
    }),
    onSubmit: (values) => handleConfirm.mutate(formatInputsData(values)),
    enableReinitialize: true,
  });

  const queryClient = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (data) =>
      isUpdate ? api.updateData({ data, id: isUpdate.id }) : api.addData(data),
    onSuccess: () => {
      handleClose();
      formik.resetForm();
      queryClient.invalidateQueries([endPoints["student-courses"], courseId]);
    },
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsUpdate(false);
  }, [setIsUpdate]);

  const { t } = useTranslation();

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-plus" /> {t("students.add_student_btn")}
      </Button>
      <PopUp
        isOpen={isOpen || isUpdate}
        onClose={handleClose}
        className="add-course-popup"
      >
        <form onSubmit={formik.handleSubmit}>
          <SelectInputApi
            endPoint={endPoints.students}
            label={t("students.student")}
            onChange={(e) => formik.setFieldValue("studentId", e)}
            placeholder={
              formik?.values?.studentId
                ? `${formik?.values?.studentId?.firstName} ${formik?.values?.studentId?.lastName}`
                : t("students.student_placeholder")
            }
            optionLabel={(e) =>
              `${e?.firstName} ${e?.middleName} ${e?.lastName}`
            }
            errorText={t(formik?.errors?.studentId)}
          />

          <SelectOptionInput
            label={t("students.course_status")}
            wrapperProps={{
              className: `course-status ${formik.values.status}`,
            }}
            placeholder={t(
              formik.values?.status
                ? `enums.${formik.values?.status}`
                : "students.course_status_placeholder"
            )}
            options={[
              {
                text: t("students.active"),
                value: courseStatus.Active,
                props: { className: "active" },
              },
              {
                text: t("students.completed"),
                value: courseStatus.Completed,
                props: { className: "completed" },
              },
              {
                text: t("students.dropped"),
                value: courseStatus.Dropped,
                props: { className: "dropped" },
              },
            ]}
            onSelectOption={(e) => formik.setFieldValue("status", e.value)}
            errorText={t(formik?.errors?.status)}
          />

          <div className="actions">
            <Button type="submit" isSending={handleConfirm.isPending}>
              {t("students.save_btn")}
            </Button>
            <Button btnType="cancel" type="button" onClick={handleClose}>
              {t("students.cancel_btn")}
            </Button>
          </div>
        </form>
      </PopUp>
    </>
  );
};

export default AddStudentsToCourse;
