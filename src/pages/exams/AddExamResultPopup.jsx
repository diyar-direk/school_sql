import { useFormik } from "formik";
import IconButton from "../../components/buttons/IconButton";
import { courseStatus, examTypes } from "../../constants/enums";
import { examResultSchema } from "../../schemas/examResult";
import { useCallback, useMemo, useState } from "react";
import PopUp from "../../components/popup/PopUp";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { endPoints } from "../../constants/endPoints";
import Input from "../../components/inputs/Input";
import Button from "../../components/buttons/Button";
import "../students/student.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { formatInputsData } from "../../utils/formatInputsData";

const apiClient = new APIClient(endPoints["exam-results"]);
const AddExamResultPopup = ({ examId }) => {
  const formik = useFormik({
    initialValues: {
      studentId: "",
      type: examTypes?.Exam,
      examId,
      score: "",
    },
    validationSchema: examResultSchema,
    onSubmit: (d) => handleConfirm.mutate(formatInputsData(d)),
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleStudentFilter = useMemo(
    () => ({
      endPoint: endPoints["student-courses"],
      label: "student",
      placeholder: formik?.values?.studentId
        ? `${formik?.values?.studentId?.firstName} ${formik?.values?.studentId?.lastName}`
        : "select student",
      optionLabel: (opt) => {
        return `${opt?.student?.firstName} ${opt?.student?.middleName} ${opt?.student?.lastName}`;
      },
      onChange: (opt) => formik.setFieldValue("studentId", opt.student),
      errorText: formik?.errors?.studentId,
    }),
    [formik]
  );

  const query = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (d) => apiClient.addData(d),
    onSuccess: () => {
      query.invalidateQueries([endPoints["exam-results"]]);
      handleClose();
      formik.resetForm();
    },
  });

  return (
    <>
      <IconButton
        color="secondry-color"
        title="Add"
        onClick={() => setIsOpen(true)}
      >
        <i className="fa-solid fa-plus" />
      </IconButton>

      <PopUp className="add-course-popup" isOpen={isOpen} onClose={handleClose}>
        <form onSubmit={formik.handleSubmit}>
          <SelectInputApi
            endPoint={handleStudentFilter.endPoint}
            label={handleStudentFilter.label}
            optionLabel={handleStudentFilter.optionLabel}
            placeholder={handleStudentFilter.placeholder}
            onChange={handleStudentFilter.onChange}
            errorText={handleStudentFilter.errorText}
            params={{ status: courseStatus.Active }}
          />
          <Input
            title="score"
            type="number"
            name="score"
            onChange={formik.handleChange}
            placeholder="score"
            value={formik.values?.score}
            errorText={formik.errors?.score}
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

export default AddExamResultPopup;
