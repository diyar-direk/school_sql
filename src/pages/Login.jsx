import "../components/form.css";
import { useNavigate } from "react-router-dom";
import Input from "../components/inputs/Input";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "../components/buttons/Button";
import axiosInstance from "../utils/axios";
import { endPoints } from "./../constants/endPoints";
import { useAuth } from "../context/AuthContext";
import { pagesRoute } from "./../constants/pagesRoute";
import { roles } from "../constants/enums";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Login = () => {
  const nav = useNavigate();
  const { setUserDetails } = useAuth();

  const token = Cookies.get("accessToken");

  useEffect(() => {
    if (token) nav("/");
  }, [token, nav]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("error.username_required"),
      password: yup.string().required("error.password_required"),
    }),
    onSubmit: async (values) => {
      try {
        const getToken = await axiosInstance.post(endPoints.login, values, {
          withCredentials: true,
        });

        const accessToken = getToken.data.accessToken;
        Cookies.set("accessToken", accessToken);

        const profile = await axiosInstance.get(endPoints.profile, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = profile.data.user;
        const isAdmin = data.role === roles.admin;
        const isTeacher = data.role === roles.teacher;
        const isStudent = data.role === roles.student;

        const myProfilePath = isAdmin
          ? pagesRoute.admin.view(data?.id)
          : isTeacher
          ? pagesRoute.teacher.view(data?.profileId?.id)
          : pagesRoute.student.view(data?.profileId?.id);

        setUserDetails({
          isAdmin: isAdmin,
          isTeacher: isTeacher,
          isStudent: isStudent,
          ...data,
        });

        nav(myProfilePath);
      } catch (error) {
        console.log(error);
      }
    },
  });

  const { t } = useTranslation();

  return (
    <main className="center section-color">
      <form onSubmit={formik.handleSubmit} className="login relative">
        <div className="flex wrap">
          <div className="forms flex flex-direction">
            <h1>{t("login.login")}</h1>

            <Input
              placeholder={t("login.user_name_placeholder")}
              title={t("login.user_name")}
              name="username"
              icon={<i className="fa-solid fa-user" />}
              onChange={formik.handleChange}
              errorText={t(formik.errors?.username)}
            />
            <Input
              placeholder={t("login.password_placeholder")}
              type="password"
              title={t("login.password")}
              name="password"
              icon={<i className="fa-solid fa-key" />}
              onChange={formik.handleChange}
              errorText={t(formik.errors?.password)}
            />
            <Button type="submit"> {t("login.submit_btn")} </Button>
          </div>
          <div className="image">
            <img src={require("./loginimage.jpg")} alt="" />
          </div>
        </div>
      </form>
    </main>
  );
};

export default Login;
