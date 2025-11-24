import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { teacherSchema } from "./../../schemas/teacher";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.teachers);
const AddTeacher = () => {
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      gender: "",
      phoneNumber: "",
    },
    validationSchema: teacherSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.teachers]);
      nav(-1);
    },
  });

  const { t } = useTranslation();

  return (
    <div className="container relative">
      <h1 className="title">{t("teachers.add_teachers")}</h1>

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

export default AddTeacher;
