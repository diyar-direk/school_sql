import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { examResultSchema } from "./../../schemas/examResult";
import { examTypes } from "../../constants/enums";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
const apiClient = new APIClient(endPoints["exam-results"]);
const AddExamResult = () => {
  const { state } = useLocation();
  const examId = state?.examId || null;
  const context = useContext(Context);

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || false;

  const formik = useFormik({
    initialValues: {
      studentId: "",
      type: examTypes?.Exam,
      examId,
      score: "",
    },
    validationSchema: examResultSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints["exam-results"]]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <h1 className="title">{language?.examResult?.add_exam_result}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{language.exams && language.exams.please_complete_form}</h1>
        <div className="flex wrap">
          <SelectInputApi
            endPoint={endPoints.students}
            label="student"
            optionLabel={(opt) =>
              `${opt?.firstName} ${opt?.middleName} ${opt?.lastName}`
            }
            placeholder={
              formik.values.studentId
                ? `${formik.values.studentId?.firstName} ${formik.values.studentId?.middleName} ${formik.values.studentId?.lastName}`
                : "select student"
            }
            onChange={(opt) => formik.setFieldValue("studentId", opt)}
            errorText={formik.errors?.studentId}
          />
          {!examId && isAdmin && (
            <SelectInputApi
              endPoint={endPoints.exams}
              label="exam"
              placeholder={formik.values?.examId?.title || "select exam"}
              optionLabel={(opt) => opt?.title}
              onChange={(opt) => formik.setFieldValue("examId", opt)}
              errorText={formik.errors?.examId}
            />
          )}

          <Input
            title={"language?.exam?.score"}
            onInput={formik.handleChange}
            value={formik.values.score}
            placeholder={"language?.exam?.score"}
            name="score"
            errorText={formik.errors?.score}
            type="number"
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddExamResult;
