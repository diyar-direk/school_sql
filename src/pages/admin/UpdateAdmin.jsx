import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "./../../components/skeleton/Skeleton";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.admins);
const AddAdmin = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: [endPoints.admins, id],
    queryFn: () => apiClient.getOne(id),
  });

  const formik = useFormik({
    initialValues: {
      firstName: data?.firstName || "",
      lastName: data?.lastName || "",
      email: data?.email || "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("error.first_name_required"),
      lastName: Yup.string().required("error.last_name_required"),
      email: Yup.string()
        .required("error.email_required")
        .email("error.email_invalid"),
    }),
    onSubmit: (values) => handleSubmit.mutate(values),
    enableReinitialize: true,
  });
  const queryClient = useQueryClient();
  const handleSubmit = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id }),
    onSuccess: () => {
      queryClient.invalidateQueries([endPoints.admins]);
      nav(-1);
    },
  });
  const { t } = useTranslation();

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="100px" />
      </div>
    );

  return (
    <div className="container relative">
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
