import { useCallback } from "react";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { courseSchema } from "../../schemas/course";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
import { formatInputsData } from "./../../utils/formatInputsData";
const apiClient = new APIClient(endPoints.courses);
const UpdateCourse = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.courses, id],
    queryFn: () => apiClient.getOne(id),
  });
  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      code: data?.code || "",
      description: data?.description || "",
      teacherId: data?.teacherId || [],
    },
    validationSchema: courseSchema,
    enableReinitialize: true,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.courses]);
      nav(-1);
    },
  });

  const { t } = useTranslation();

  const selectTeachers = useCallback(
    (value) => {
      const prev = formik.values?.teacherId?.map((s) => s?.id);
      if (!prev.includes(value?.id)) {
        const newTeachers = [...(formik?.values?.teacherId || []), value];
        formik.setFieldValue("teacherId", newTeachers);
      }
    },
    [formik]
  );
  const ignoreTeacher = useCallback(
    (value) => {
      const filterd = formik.values?.teacherId?.filter(
        (s) => s?.id !== value?.id
      );
      formik.setFieldValue("teacherId", filterd);
    },
    [formik]
  );

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="150px" />
      </div>
    );

  return (
    <div className="container relative">
      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap">
          <Input
            title={t("subject.name")}
            onInput={formik.handleChange}
            value={formik.values.name}
            placeholder={t("subject.name")}
            name="name"
            errorText={t(formik?.errors?.name)}
          />
          <Input
            title={t("subject.code")}
            onInput={formik.handleChange}
            value={formik.values.code}
            placeholder={t("subject.code")}
            name="code"
            errorText={t(formik?.errors?.code)}
          />
          <SelectInputApi
            endPoint={endPoints.teachers}
            label={t("navBar.teachers")}
            placeholder={t("navBar.teachers")}
            optionLabel={(e) => `${e.firstName} ${e.lastName}`}
            isArray
            onChange={(e) => selectTeachers(e)}
            value={formik.values.teacherId}
            onIgnore={(e) => ignoreTeacher(e)}
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
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default UpdateCourse;
