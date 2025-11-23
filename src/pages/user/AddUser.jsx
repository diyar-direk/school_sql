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
            errorText={formik.errors?.username}
          />
          <Input
            title={t("users.password")}
            onInput={formik.handleChange}
            value={formik.values.password}
            placeholder={t("users.password_placeholder")}
            name="password"
            errorText={formik.errors?.password}
            type="password"
          />
          <Input
            title={t("users.passwordConf")}
            onInput={formik.handleChange}
            value={formik.values.confirmPassword}
            placeholder={t("users.password_placeholderConf")}
            name="confirmPassword"
            errorText={formik.errors?.confirmPassword}
            type="password"
          />
          <SelectOptionInput
            placeholder={formik.values?.role || "select role"}
            label={t("users.role")}
            options={[
              { text: "admin", value: roles.admin },
              { text: "teacher", value: roles.teacher },
              { text: "student", value: roles.student },
            ]}
            errorText={formik.errors?.role}
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
                : `select ${formik.values.role || "student"} profile`
            }
            onChange={(opt) => formik.setFieldValue("profileId", opt)}
            errorText={formik.errors?.profileId}
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
