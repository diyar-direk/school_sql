import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import Button from "../../components/buttons/Button";
import { useMutation } from "@tanstack/react-query";
import { formatInputsData } from "../../utils/formatInputsData";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { endPoints } from "../../constants/endPoints";
import { useTranslation } from "react-i18next";
const UpdatePassword = () => {
  const { userId } = useParams();

  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
      userId,
    },
    validationSchema: yup.object({
      newPassword: yup
        .string()
        .required("error.passwords_must_match")
        .min(6, "error.minimum_6_characters"),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref("newPassword"), null], "error.passwords_must_match")
        .required("error.passwords_must_match"),
    }),
    onSubmit: (values) => handleSubmit.mutate(formatInputsData(values)),
  });
  const handleSubmit = useMutation({
    mutationFn: async (data) =>
      await axiosInstance.post(endPoints.updatePassword, data),
    onSuccess: () => nav(-1),
  });

  const { t } = useTranslation();

  return (
    <div className="container relative">
      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <div className="flex wrap ">
          <Input
            title={t("users.password")}
            onInput={formik.handleChange}
            value={formik.values.newPassword}
            placeholder={t("users.password_placeholder")}
            name="newPassword"
            errorText={t(formik.errors?.newPassword)}
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
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {t("exams.save_btn")}
        </Button>
      </form>
    </div>
  );
};

export default UpdatePassword;
