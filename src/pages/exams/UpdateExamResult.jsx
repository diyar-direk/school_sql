import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { examResultSchema } from "./../../schemas/examResult";
import { useParams } from "react-router-dom";
import Skeleton from "../../components/skeleton/Skeleton";
const apiClient = new APIClient(endPoints["exam-results"]);
const UpdateExamResult = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints["exam-results"], id],
    queryFn: () => apiClient.getOne(id),
  });
  const context = useContext(Context);
  const formik = useFormik({
    initialValues: {
      studentId: data?.studentId || "",
      type: data?.type || "",
      examId: data?.examId || "",
      score: data?.score || "",
    },
    validationSchema: examResultSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints["exam-results"]]);
      formik.resetForm();
    },
  });

  const language = context?.selectedLang;

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

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
          <SelectInputApi
            endPoint={endPoints.exams}
            label="exam"
            placeholder={formik.values?.examId?.title || "select exam"}
            optionLabel={(opt) => opt?.title}
            onChange={(opt) => formik.setFieldValue("examId", opt)}
            errorText={formik.errors?.examId}
          />

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

export default UpdateExamResult;
