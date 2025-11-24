import { useCallback, useState } from "react";
import Button from "../../components/buttons/Button";
import PopUp from "../../components/popup/PopUp";
import { endPoints } from "../../constants/endPoints";
import { courseStatus } from "../../constants/enums";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import SelectOptionInput from "./../../components/inputs/SelectOptionInput";
import { useFormik } from "formik";
import * as yup from "yup";
import APIClient from "../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
const AddStudentCourse = ({ studentId, isUpdate, setIsUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const apiClient = new APIClient(endPoints["student-courses"]);
  const formik = useFormik({
    initialValues: {
      studentId,
      courseId: isUpdate?.course || "",
      status: isUpdate?.status || "",
    },
    validationSchema: yup.object({
      studentId: yup.string().required(),
      courseId: yup.object().required("error.please_choose_subject"),
      status: yup
        .string()
        .required("error.please_choose_course_status")
        .oneOf(Object.values(courseStatus)),
    }),
    enableReinitialize: true,
    onSubmit: (values) => handleConfirm.mutate(values),
  });
  const query = useQueryClient();
  const handleConfirm = useMutation({
    mutationFn: (values) =>
      isUpdate
        ? apiClient.updateData({
            data: { ...values, courseId: values?.courseId?.id },
            id: isUpdate?.id,
          })
        : apiClient.addData({ ...values, courseId: values?.courseId?.id }),
    onSuccess: () => {
      formik.resetForm();
      query.invalidateQueries([endPoints["student-courses"], studentId]);
      handleClose();
    },
  });

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsUpdate(false);
  }, [setIsUpdate]);

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);

  const { t } = useTranslation();

  return (
    <>
      <Button onClick={toggleOpen}>
        <i className="fa-solid fa-plus" />
        {t("navBar.add_subjects")}
      </Button>
      <PopUp
        isOpen={isOpen || isUpdate}
        className="add-course-popup"
        onClose={handleClose}
      >
        <form onSubmit={formik.handleSubmit}>
          <SelectOptionInput
            label={t("students.course_status")}
            wrapperProps={{
              className: `course-status ${formik.values.status}`,
            }}
            placeholder={formik.values.status || t("students.course_status")}
            options={[
              {
                text: "Active",
                value: courseStatus.Active,
                props: { className: "active" },
              },
              {
                text: "completed",
                value: courseStatus.Completed,
                props: { className: "completed" },
              },
              {
                text: "Dropped",
                value: courseStatus.Dropped,
                props: { className: "dropped" },
              },
            ]}
            onSelectOption={(e) => formik.setFieldValue("status", e.value)}
            errorText={t(formik?.errors?.status)}
          />
          <SelectInputApi
            endPoint={endPoints.courses}
            label={t("exams.subject_input")}
            placeholder={
              formik.values.courseId?.name || t("exams.subject_placeholder")
            }
            optionLabel={(e) => e.name}
            onChange={(e) => formik.setFieldValue("courseId", e)}
            errorText={t(formik?.errors?.courseId)}
          />
          <div className="actions">
            <Button type="submit" isSending={handleConfirm.isPending}>
              {t("exams.save_btn")}
            </Button>
            <Button btnType="cancel" type="button" onClick={handleClose}>
              {t("exams.cancel_btn")}
            </Button>
          </div>
        </form>
      </PopUp>
    </>
  );
};

export default AddStudentCourse;
