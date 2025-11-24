import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.admins);
const AddAdmin = () => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("error.first_name_required"),
      lastName: Yup.string().required("error.last_name_required"),
      email: Yup.string()
        .required("error.email_required")
        .email("error.email_invalid"),
    }),
    onSubmit: (values) => handleSubmit.mutate(values),
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.admins]);
      formik.resetForm();
    },
  });

  return (
    <div className="container relative">
      <h1 className="title">{t("admins.add_admins")}</h1>

      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{t("exams.please_complete_form")}</h1>
        <div className="flex wrap ">
          <Input
            title={t("admins.first_name")}
            onInput={formik.handleChange}
            value={formik.values.firstName}
            placeholder={t("admins.first_name_placeholder")}
            name="firstName"
            errorText={t(formik.errors?.firstName)}
          />
          <Input
            title={t("admins.last_name")}
            onInput={formik.handleChange}
            value={formik.values.lastName}
            placeholder={t("admins.last_name_placeholder")}
            name="lastName"
            errorText={t(formik.errors?.lastName)}
          />
          <Input
            title={t("admins.email")}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={t("admins.email_placeholder")}
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

export default AddAdmin;
