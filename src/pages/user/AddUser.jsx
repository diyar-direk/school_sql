import { useCallback } from "react";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { usersSchema } from "../../schemas/user";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { roles } from "../../constants/enums";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "../../utils/formatInputsData";
import { useTranslation } from "react-i18next";
import { rolesStyle } from "../../utils/enumsElements";
const apiClient = new APIClient(endPoints.users);
const AddUser = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
      profileId: "",
    },
    validationSchema: usersSchema,
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.users]);
      formik.resetForm();
    },
  });

  const { t } = useTranslation();

  const selectRole = useCallback(
    (newRole) => {
      if (newRole !== formik?.values?.role) {
        formik.setValues({ ...formik.values, role: newRole, profileId: null });
      }
    },
    [formik]
  );

  return (
    <div className="container relative">
      <h1 className="title">{t("users.add_users")}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap ">
          <Input
            title={t("users.user_name")}
            onInput={formik.handleChange}
            value={formik.values.username}
            placeholder={t("users.user_name_placeholder")}
            name="username"
            errorText={t(formik.errors?.username)}
          />
          <Input
            title={t("users.password")}
            onInput={formik.handleChange}
            value={formik.values.password}
            placeholder={t("users.password_placeholder")}
            name="password"
            errorText={t(formik.errors?.password)}
            type="password"
          />
          <Input
            title={t("users.passwordConf")}
            onInput={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder={t("users.password_placeholderConf")}
            name="confirmPassword"
            errorText={t(formik.errors?.confirmPassword)}
            type="password"
          />
          <SelectOptionInput
            placeholder={t(
              formik.values?.role
                ? `enums.${formik.values?.role}`
                : "users.role_placeholder"
            )}
            label={t("users.role")}
            options={[
              {
                text: (
                  <span
                    className="flex align-center gap-10"
                    style={{ color: rolesStyle[roles.admin]?.color }}
                  >
                    {rolesStyle[roles.admin]?.icon}
                    {t(`enums.${roles.admin}`)}
                  </span>
                ),
                value: roles.admin,
              },
              {
                text: (
                  <span
                    className="flex align-center gap-10"
                    style={{ color: rolesStyle[roles.teacher]?.color }}
                  >
                    {rolesStyle[roles.teacher]?.icon}
                    {t(`enums.${roles.teacher}`)}
                  </span>
                ),
                value: roles.teacher,
              },
              {
                text: (
                  <span
                    className="flex align-center gap-10"
                    style={{ color: rolesStyle[roles.student]?.color }}
                  >
                    {rolesStyle[roles.student]?.icon}
                    {t(`enums.${roles.student}`)}
                  </span>
                ),
                value: roles.student,
              },
            ]}
            errorText={t(formik.errors?.role)}
            onSelectOption={(opt) => selectRole(opt.value)}
          />
          <SelectInputApi
            endPoint={
              endPoints[
                formik.values.role === roles.admin
                  ? "admins"
                  : formik.values.role === roles.teacher
                  ? "teachers"
                  : "students"
              ]
            }
            label="profile"
            optionLabel={(opt) => `${opt.firstName} ${opt.lastName}`}
            placeholder={
              formik.values?.profileId
                ? `${formik.values?.profileId?.firstName} ${formik.values?.profileId?.lastName}`
                : t(`users.please_select`)
            }
            onChange={(opt) => formik.setFieldValue("profileId", opt)}
            errorText={t(formik.errors?.profileId)}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default AddUser;
