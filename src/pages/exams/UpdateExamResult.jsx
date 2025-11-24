import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { examResultSchema } from "./../../schemas/examResult";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../../components/skeleton/Skeleton";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints["exam-results"]);
const UpdateExamResult = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints["exam-results"], id],
    queryFn: () => apiClient.getOne(id),
  });
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      studentId: data?.student || "",
      type: data?.type || "",
      examId: data?.exam || "",
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
      nav(-1);
    },
  });

  const { t } = useTranslation();

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <div className="container relative">
      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap">
          <AllowedTo roles={[roles.admin]}>
            <SelectInputApi
              endPoint={endPoints.students}
              label={t("students.student")}
              optionLabel={(opt) =>
                `${opt?.firstName} ${opt?.middleName} ${opt?.lastName}`
              }
              placeholder={
                formik.values.studentId
                  ? `${formik.values.studentId?.firstName} ${formik.values.studentId?.middleName} ${formik.values.studentId?.lastName}`
                  : t("students.student_placeholder")
              }
              onChange={(opt) => formik.setFieldValue("studentId", opt)}
              errorText={t(formik?.errors?.studentId)}
            />
            <SelectInputApi
              endPoint={endPoints.exams}
              label={t("navBar.exam")}
              placeholder={
                formik.values?.examId?.title || t("examResult.exam_placeholder")
              }
              optionLabel={(opt) => opt?.title}
              onChange={(opt) => formik.setFieldValue("examId", opt)}
              errorText={t(formik?.errors?.examId)}
            />
          </AllowedTo>

          <Input
            title={t("examResult.score")}
            onInput={formik.handleChange}
            value={formik.values.score}
            placeholder={t("examResult.score_placeholder")}
            name="score"
            errorText={t(formik?.errors?.score)}
            type="number"
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default UpdateExamResult;
