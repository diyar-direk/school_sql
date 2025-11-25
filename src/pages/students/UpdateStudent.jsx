import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { genders } from "../../constants/enums";
import { useNavigate, useParams } from "react-router-dom";
import { studentSchema } from "./../../schemas/student";
import dateFormatter from "./../../utils/dateFormatter";
import Skeleton from "./../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
import { gendersStyle } from "../../utils/enumsElements";
const apiClient = new APIClient(endPoints.students);

const UpdateStudent = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.students, id],
    queryFn: () => apiClient.getOne(id),
  });
  const formik = useFormik({
    initialValues: {
      firstName: data?.firstName || "",
      middleName: data?.middleName || "",
      lastName: data?.lastName || "",
      dateOfBirth: data?.dateOfBirth || "",
      phone: data?.phone || "",
      email: data?.email || "",
      gender: data?.gender || "",
      address: data?.address || "",
      enrollmentDate: dateFormatter(data?.enrollmentDate || new Date()),
      guardianName: data?.guardianName || "",
      guardianPhone: data?.guardianPhone || "",
      guardianRelationship: data?.guardianRelationship || "",
    },
    validationSchema: studentSchema,
    onSubmit: (values) => handleSubmit.mutate(values),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.students]);
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
            placeholder={t(
              formik.values?.gender
                ? `enums.${formik.values?.gender}`
                : "teachers.gender_placeholder"
            )}
            label={t("teachers.gender")}
            options={[
              {
                text: (
                  <span
                    className="flex align-center gap-10"
                    style={{ color: gendersStyle[genders.female]?.color }}
                  >
                    {gendersStyle[genders.female]?.icon}
                    {t(`enums.${genders.female}`)}
                  </span>
                ),
                value: genders.female,
              },
              {
                text: (
                  <span
                    className="flex align-center gap-10"
                    style={{ color: gendersStyle[genders.male]?.color }}
                  >
                    {gendersStyle[genders.male]?.icon}
                    {t(`enums.${genders.male}`)}
                  </span>
                ),
                value: genders.male,
              },
            ]}
            onSelectOption={(opt) => formik.setFieldValue("gender", opt.value)}
            errorText={formik?.errors?.gender}
          />
          <Input
            title={t("students.date_of_birth")}
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
            title={t("students.address")}
            onInput={formik.handleChange}
            value={formik.values.address}
            placeholder={t("students.address")}
            name="address"
            errorText={t(formik.errors?.address)}
          />
          <Input
            title={t("students.enrollment_date")}
            onInput={formik.handleChange}
            value={formik.values.enrollmentDate}
            name="enrollmentDate"
            type="date"
            errorText={t(formik.errors?.enrollmentDate)}
          />
          <Input
            title={t("students.guardian_name")}
            onInput={formik.handleChange}
            value={formik.values.guardianName}
            placeholder={t("students.guardian_name_placeholder")}
            name="guardianName"
            errorText={t(formik.errors?.guardianName)}
          />
          <Input
            title={t("students.guardian_phone")}
            onInput={formik.handleChange}
            value={formik.values.guardianPhone}
            placeholder={t("students.guardian_phone_placeholder")}
            name="guardianPhone"
            errorText={t(formik.errors?.guardianPhone)}
          />
          <Input
            title={t("students.relationship")}
            onInput={formik.handleChange}
            value={formik.values.guardianRelationship}
            placeholder={t("students.relationship_placeholder")}
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

export default UpdateStudent;
