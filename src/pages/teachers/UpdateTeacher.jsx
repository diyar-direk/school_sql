import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { teacherSchema } from "./../../schemas/teacher";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.teachers);
const UpdateTeacher = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.teachers, id],
    queryFn: () => apiClient.getOne(id),
  });
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      middleName: data?.middleName || "",
      email: data?.email || "",
      gender: data?.gender || "",
      phoneNumber: data?.phoneNumber || "",
    },
    validationSchema: teacherSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.teachers]);
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
          <Input
            title={t("teachers.first_name")}
            onInput={formik.handleChange}
            value={formik.values.firstName}
            placeholder={t("teachers.first_name_placeholder")}
            name="firstName"
            errorText={t(formik.errors?.firstName)}
          />
          <Input
            title={t("teachers.middle_name")}
            onInput={formik.handleChange}
            value={formik.values.middleName}
            placeholder={t("teachers.middle_name_placeholder")}
            name="middleName"
            errorText={t(formik.errors?.middleName)}
          />
          <Input
            title={t("teachers.last_name")}
            onInput={formik.handleChange}
            value={formik.values.lastName}
            placeholder={t("teachers.last_name_placeholder")}
            name="lastName"
            errorText={t(formik.errors?.lastName)}
          />

          <SelectOptionInput
            placeholder={
              formik.values?.gender || t("teachers.gender_placeholder")
            }
            label="gender"
            options={[
              { text: "male", value: genders.male },
              { text: "female", value: genders.female },
            ]}
            onSelectOption={(opt) => formik.setFieldValue("gender", opt.value)}
            errorText={formik?.errors?.gender}
          />
          <Input
            title={t("teachers.phone_number")}
            onInput={formik.handleChange}
            value={formik.values.phoneNumber}
            placeholder={t("teachers.phone_number_placeholder")}
            name="phoneNumber"
            errorText={t(formik.errors?.phoneNumber)}
          />
          <Input
            title={t("teachers.email")}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={t("teachers.email_placeholder")}
            name="email"
            errorText={t(formik.errors?.email)}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default UpdateTeacher;
