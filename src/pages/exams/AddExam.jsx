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
            title={t("exam.title")}
            onInput={formik.handleChange}
            value={formik.values.title}
            placeholder={t("exam.title")}
            name="title"
            errorText={formik.errors?.title}
          />
          {isAdmin && !courseId && (
            <SelectInputApi
              endPoint={endPoints.courses}
              label="course"
              placeholder={formik.values?.courseId?.name || "select course "}
              optionLabel={(opt) => opt?.name}
              onChange={(opt) => formik.setFieldValue("courseId", opt)}
              errorText={formik.errors?.courseId}
            />
          )}
          <Input
            title={t("exam.date")}
            onInput={formik.handleChange}
            value={formik.values.date}
            type="datetime-local"
            name="date"
            errorText={formik.errors?.date}
          />
          <Input
            title={t("exam.duration")}
            onInput={formik.handleChange}
            value={formik.values.duration}
            placeholder={t("exam.duration")}
            name="duration"
            errorText={formik.errors?.duration}
            type="number"
          />
          <Input
            title={t("exam.totalMarks")}
            onInput={formik.handleChange}
            value={formik.values.totalMarks}
            placeholder={t("exam.totalMarks")}
            name="totalMarks"
            errorText={formik.errors?.totalMarks}
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
