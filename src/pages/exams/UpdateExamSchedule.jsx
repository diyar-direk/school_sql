import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { examSchema } from "../../schemas/exam";
import dateFormatter from "../../utils/dateFormatter";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./../../components/skeleton/Skeleton";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.exams);
const UpdateExamSchedule = () => {
  const { userDetails } = useAuth();
  const { isTeacher, profileId } = userDetails || {};
  const nav = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.exams, id],
    queryFn: () => apiClient.getOne(id),
  });
  const formik = useFormik({
    initialValues: {
      title: data?.title || "",
      courseId: data?.course || "",
      date: dateFormatter(data?.date || new Date()),
      duration: data?.duration || "",
      totalMarks: data?.totalMarks || "",
    },
    validationSchema: examSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.exams]);
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
        <div className="flex wrap ">
          <Input
            title={t("quizzes.title")}
            onInput={formik.handleChange}
            value={formik.values.title}
            placeholder={t("quizzes.exam_title_placeholder")}
            name="title"
            errorText={t(formik?.errors?.title)}
          />
          <SelectInputApi
            endPoint={endPoints.courses}
            label={t("exams.subject")}
            placeholder={
              formik.values?.courseId?.name || t("exams.subject_placeholder")
            }
            optionLabel={(opt) => opt?.name}
            onChange={(opt) => formik.setFieldValue("courseId", opt)}
            errorText={t(formik?.errors?.courseId)}
            params={{ teacherId: isTeacher ? profileId?.id : null }}
          />
          <Input
            title={t("exams.date")}
            onInput={formik.handleChange}
            value={formik.values.date}
            type="datetime-local"
            name="date"
            errorText={t(formik?.errors?.date)}
          />
          <Input
            title={t("exams.duration")}
            onInput={formik.handleChange}
            value={formik.values.duration}
            placeholder={t("exams.duration_palceholder")}
            name="duration"
            errorText={t(formik?.errors?.duration)}
            type="number"
          />
          <Input
            title={t("exams.total_marks")}
            onInput={formik.handleChange}
            value={formik.values.totalMarks}
            placeholder={t("exams.total_marks_placeholder")}
            name="totalMarks"
            errorText={t(formik?.errors?.totalMarks)}
            type="number"
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams?.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default UpdateExamSchedule;
