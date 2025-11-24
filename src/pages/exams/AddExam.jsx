import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { examSchema } from "../../schemas/exam";
import dateFormatter from "../../utils/dateFormatter";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.exams);
const AddExam = () => {
  const { state } = useLocation();
  const courseId = state?.courseId ? JSON.parse(state?.courseId) : null;

  const formik = useFormik({
    initialValues: {
      title: "",
      courseId: courseId || "",
      date: dateFormatter(new Date()),
      duration: "",
      totalMarks: "",
    },
    validationSchema: examSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.exams]);
      formik.resetForm();
    },
  });

  const { t } = useTranslation();

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || false;

  return (
    <div className="container relative">
      <h1 className="title">{t("exams.add_exam")}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap ">
          <Input
            title={t("quizzes.title")}
            onInput={formik.handleChange}
            value={formik.values.title}
            placeholder={t("quizzes.exam_title_placeholder")}
            name="title"
            errorText={t(formik.errors?.title)}
          />
          {isAdmin && !courseId && (
            <SelectInputApi
              endPoint={endPoints.courses}
              label={t("exams.subject")}
              placeholder={
                formik.values?.courseId?.name || t("exams.subject_placeholder")
              }
              optionLabel={(opt) => opt?.name}
              onChange={(opt) => formik.setFieldValue("courseId", opt)}
              errorText={t(formik.errors?.courseId)}
            />
          )}
          <Input
            title={t("exams.date")}
            onInput={formik.handleChange}
            value={formik.values.date}
            type="datetime-local"
            name="date"
            errorText={t(formik.errors?.date)}
          />
          <Input
            title={t("exams.duration")}
            onInput={formik.handleChange}
            value={formik.values.duration}
            placeholder={t("exams.duration_palceholder")}
            name="duration"
            errorText={t(formik.errors?.duration)}
            type="number"
          />
          <Input
            title={t("exams.total_marks")}
            onInput={formik.handleChange}
            value={formik.values.totalMarks}
            placeholder={t("exams.total_marks_placeholder")}
            name="totalMarks"
            errorText={t(formik.errors?.totalMarks)}
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

export default AddExam;
