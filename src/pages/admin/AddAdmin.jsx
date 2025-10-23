import { useContext } from "react";
import { Context } from "../../context/Context";
import Input from "../../components/inputs/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../components/buttons/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "../../constants/endPoints";
const apiClient = new APIClient(endPoints.admins);
const AddAdmin = () => {
  const context = useContext(Context);
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("first name is required"),
      lastName: Yup.string().required("first name is required"),
      email: Yup.string()
        .required("first name is required")
        .email("please enter valid email"),
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

  const language = context?.selectedLang;

  return (
    <div className="container relative">
      <h1 className="title">{language.admins && language.admins.add_admins}</h1>

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
