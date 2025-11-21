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

const AddStudentsToCourse = ({ courseId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const api = new APIClient(endPoints["student-courses"]);
  const formik = useFormik({
    initialValues: {
      courseId,
      studentId: "",
      status: "",
    },
    validationSchema: yup.object({
      studentId: yup.object().required("please select a student"),
      status: yup
        .string()
        .required("please selecte student course status")
        .oneOf(Object.values(courseStatus)),
    }),
    onSubmit: (values) => handleConfirm.mutate(formatInputsData(values)),
  });

  const queryClient = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (data) => api.addData(data),
    onSuccess: () => {
      handleClose();
      formik.resetForm();
      queryClient.invalidateQueries([endPoints["student-courses"], courseId]);
    },
  });

  const handleClose = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <i className="fa-solid fa-plus" /> add students
      </Button>
      <PopUp isOpen={isOpen} onClose={handleClose} className="add-course-popup">
        <form onSubmit={formik.handleSubmit}>
          <SelectInputApi
            endPoint={endPoints.students}
            label="student"
            onChange={(e) => formik.setFieldValue("studentId", e)}
            placeholder={
              formik?.values?.studentId
                ? `${formik?.values?.studentId?.firstName} ${formik?.values?.studentId?.lastName}`
                : "select student"
            }
            optionLabel={(e) =>
              `${e?.firstName} ${e?.middleName} ${e?.lastName}`
            }
            errorText={formik.errors?.studentId}
          />

          <SelectOptionInput
            label="course status"
            wrapperProps={{
              className: `course-status ${formik.values.status}`,
            }}
            placeholder={formik.values.status || "course status"}
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
            errorText={formik.errors?.status}
          />

          <div className="actions">
            <Button type="submit" isSending={handleConfirm.isPending}>
              save
            </Button>
            <Button btnType="cancel" type="button" onClick={handleClose}>
              cancel
            </Button>
          </div>
        </form>
      </PopUp>
    </>
  );
};

export default AddStudentsToCourse;
