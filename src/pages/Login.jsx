import { useContext } from "react";
import "../components/form.css";
import { Context } from "../context/Context";
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

const Login = () => {
  const nav = useNavigate();
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const { setUserDetails } = useAuth();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup.string().required("username is required"),
      password: yup.string().required("password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const getToken = await axiosInstance.post(endPoints.login, values, {
          withCredentials: true, // 👈 necessary
        });

        const accessToken = getToken.data.accessToken;
        Cookies.set("accessToken", accessToken);

        const profile = await axiosInstance.get(endPoints.profile, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const data = profile.data.user;
        // const refreshToken = data.refreshToken;
        // Cookies.set("refreshToken", refreshToken);
        const isAdmin = data.role === roles.admin;
        const isTeacher = data.role === roles.teacher;
        const isStudent = data.role === roles.student;

        const myProfilePath = isAdmin
          ? pagesRoute.admin.view(data?._id)
          : isTeacher
          ? pagesRoute.teacher.view(data?.profileId?._id)
          : pagesRoute.student.view(data?.profileId?._id);

        setUserDetails({
          isAdmin: isAdmin,
          isTeacher: isTeacher,
          isStudent: isStudent,
          myProfilePath,
          ...data,
        });

        nav(myProfilePath);
      } catch (error) {}
    },
  });

  return (
    <main className="center section-color">
      <form onSubmit={formik.handleSubmit} className="login relative">
        <div className="flex wrap">
          <div className="forms flex flex-direction">
            <h1>{language.login && language.login.login}</h1>

            <Input
              placeholder={language?.login?.user_name_placeholder}
              title={language?.login?.user_name}
              name="username"
              icon={<i className="fa-solid fa-user" />}
              onChange={formik.handleChange}
              errorText={formik.errors?.username}
            />
            <Input
              placeholder={language?.login?.password_placeholder}
              type="password"
              title={language?.login?.password}
              name="password"
              icon={<i className="fa-solid fa-key" />}
              onChange={formik.handleChange}
              errorText={formik.errors?.password}
            />
            <Button> {language?.login?.submit_btn} </Button>
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
