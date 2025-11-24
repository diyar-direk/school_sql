import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate } from "react-router-dom";
import { studentSchema } from "./../../schemas/student";
import dateFormatter from "./../../utils/dateFormatter";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.students);

const AddStudent = () => {
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      phone: "",
      email: "",
      gender: "",
      address: "",
      enrollmentDate: dateFormatter(new Date()),
      guardianName: "",
      guardianPhone: "",
      guardianRelationship: "",
    },
    validationSchema: studentSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.students]);
      nav(-1);
    },
  });

  const { t } = useTranslation();

  return (
    <div className="container relative">
      <h1 className="title">{t("students.add_student_btn")}</h1>
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
            errorText={t(formik.errors?.gender)}
          />
          <Input
            title={t("teachers.birth_date")}
            onInput={formik.handleChange}
            value={formik.values.dateOfBirth}
            name="dateOfBirth"
            type="date"
            errorText={t(formik.errors?.dateOfBirth)}
          />

          <Input
            title={t("teachers.phone_number")}
            onInput={formik.handleChange}
            value={formik.values?.phone}
            placeholder={t("teachers.phone_number_placeholder")}
            name="phone"
            errorText={t(formik.errors?.phone)}
          />
          <Input
            title={t("teachers.email")}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={t("teachers.email_placeholder")}
            name="email"
            errorText={t(formik.errors?.email)}
          />
          <Input
            title={t("teachers.address")}
            onInput={formik.handleChange}
            value={formik.values.address}
            placeholder={t("teachers.address_placeholder")}
            name="address"
            errorText={t(formik.errors?.address)}
          />
          <Input
            title={t("teachers.birth_date")}
            onInput={formik.handleChange}
            value={formik.values.enrollmentDate}
            name="enrollmentDate"
            type="date"
            errorText={t(formik.errors?.enrollmentDate)}
          />
          <Input
            title={t("teachers.guardianName")}
            onInput={formik.handleChange}
            value={formik.values.guardianName}
            placeholder={t("teachers.guardianName_placeholder")}
            name="guardianName"
            errorText={t(formik.errors?.guardianName)}
          />
          <Input
            title={t("teachers.guardianPhone")}
            onInput={formik.handleChange}
            value={formik.values.guardianPhone}
            placeholder={t("teachers.guardianPhone_placeholder")}
            name="guardianPhone"
            errorText={t(formik.errors?.guardianPhone)}
          />
          <Input
            title={t("teachers.guardianRelationship")}
            onInput={formik.handleChange}
            value={formik.values.guardianRelationship}
            placeholder={t("teachers.guardianRelationship_placeholder")}
            name="guardianRelationship"
            errorText={t(formik.errors?.guardianRelationship)}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default AddStudent;
