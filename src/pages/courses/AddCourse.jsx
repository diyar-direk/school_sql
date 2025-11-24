import { useCallback } from "react";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { courseSchema } from "../../schemas/course";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { courseStatus } from "../../constants/enums";
import axiosInstance from "../../utils/axios";
import { useTranslation } from "react-i18next";
import { formatInputsData } from "./../../utils/formatInputsData";
const apiClient = new APIClient(endPoints.courses);

const AddCourse = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      code: "",
      description: "",
      teacherId: [],
      students: [],
    },
    validationSchema: courseSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(formatInputsData(data)),
    onSuccess: (data) => {
      queryClient.invalidateQueries([endPoints.courses]);
      addStudentCourse.mutate(data.id);
    },
  });
  const addStudentCourse = useMutation({
    mutationFn: async (courseId) => {
      if (formik.values.students?.length > 0) {
        const docs = formik?.values?.students?.map((e) => ({
          studentId: e.id,
          courseId,
          status: courseStatus.Active,
        }));
        await axiosInstance.post(
          `${endPoints["student-courses"]}/${endPoints["create-many"]}`,
          { docs }
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints["student-courses"]]);
      formik.resetForm();
    },
  });
  const { t } = useTranslation();

  const multiSelect = useCallback(
    (value, field) => {
      const prev = formik.values?.[field]?.map((s) => s?.id);
      if (!prev.includes(value?.id)) {
        const newValues = [...(formik?.values?.[field] || []), value];
        formik.setFieldValue(field, newValues);
      }
    },
    [formik]
  );

  const ignoreSelect = useCallback(
    (value, field) => {
      const filterd = formik.values?.[field]?.filter(
        (s) => s?.id !== value?.id
      );
      formik.setFieldValue(field, filterd);
    },
    [formik]
  );

  return (
    <div className="container relative">
      <h1 className="title">{t("navBar.add_subjects")}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap">
          <Input
            title={t("subject.name")}
            onInput={formik.handleChange}
            value={formik.values.name}
            placeholder={t("subject.name_placeholder")}
            name="name"
            errorText={t(formik?.errors?.name)}
          />
          <Input
            title={t("subject.code")}
            onInput={formik.handleChange}
            value={formik.values.code}
            placeholder={t("subject.code_placeholder")}
            name="code"
            errorText={t(formik?.errors?.code)}
          />
          <SelectInputApi
            endPoint={endPoints.teachers}
            label={t("navBar.teachers")}
            placeholder={t("navBar.teachers")}
            optionLabel={(e) => `${e.firstName} ${e.lastName}`}
            isArray
            onChange={(e) => multiSelect(e, "teacherId")}
            value={formik.values.teacherId}
            onIgnore={(e) => ignoreSelect(e, "teacherId")}
          />
          <Input
            title={t("subject.description")}
            onInput={formik.handleChange}
            value={formik.values.description}
            placeholder={t("subject.description_placeholder")}
            name="description"
            errorText={t(formik?.errors?.description)}
            elementType="textarea"
            rows={5}
          />
        </div>
        <div className="flex wrap" style={{ marginTop: "10px" }}>
          <SelectInputApi
            endPoint={endPoints.students}
            label={t("navBar.students")}
            placeholder={t("navBar.students")}
            optionLabel={(e) => `${e.firstName} ${e.lastName}`}
            isArray
            onChange={(e) => multiSelect(e, "students")}
            value={formik.values.students}
            onIgnore={(e) => ignoreSelect(e, "students")}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default AddCourse;
