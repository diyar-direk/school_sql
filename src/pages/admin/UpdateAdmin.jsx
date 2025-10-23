import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../components/buttons/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
import { useNavigate, useParams } from "react-router-dom";
const apiClient = new APIClient(endPoints.admins);
const AddAdmin = () => {
  const context = useContext(Context);
  const { id } = useParams();
  const nav = useNavigate();
  const { data } = useQuery({
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
      firstName: Yup.string().required("first name is required"),
      lastName: Yup.string().required("first name is required"),
      email: Yup.string()
        .required("first name is required")
        .email("please enter valid email"),
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

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <form onSubmit={formik.handleSubmit} className="relative dashboard-form">
        <h1>{language.exams && language.exams.please_complete_form}</h1>
        <div className="flex wrap ">
          <Input
            title={language?.admins?.first_name}
            onInput={formik.handleChange}
            value={formik.values.firstName}
            placeholder={language?.admins?.first_name_placeholder}
            name="firstName"
            errorText={formik.errors?.firstName}
          />
          <Input
            title={language?.admins?.last_name}
            onInput={formik.handleChange}
            value={formik.values.lastName}
            placeholder={language?.admins?.last_name_placeholder}
            name="lastName"
            errorText={formik.errors?.lastName}
          />
          <Input
            title={language?.admins?.email}
            onInput={formik.handleChange}
            value={formik.values.email}
            placeholder={language?.admins?.email_placeholder}
            name="email"
            errorText={formik.errors?.email}
          />
        </div>
        <Button type="submit" isSending={handleSubmit.isPending}>
          {language?.exams?.save_btn}
        </Button>
      </form>
    </div>
  );
};

export default AddAdmin;
