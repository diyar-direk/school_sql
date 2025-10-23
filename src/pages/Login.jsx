import { useContext, useState } from "react";
import "../components/form.css";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import FormLoading from "./../components/FormLoading";
import axiosInstance from "../utils/axios";
import Cookies from "js-cookie";
import { useAuth } from "../context/AuthContext";

export const showPassword = (e) => {
  e.target.classList.toggle("fa-eye");
  const passInp = document.querySelector("form input.password");
  passInp.type === "password"
    ? (passInp.type = "text")
    : (passInp.type = "password");
};

const Login = () => {
  const context = useContext(Context);
  const { setUserDetails } = useAuth();
  const language = context && context.selectedLang;
  const [error, setError] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(false);
  };
  const nav = useNavigate();
  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);

      const getToken = await axiosInstance.post("users/login", form);
      const token = getToken.data.token;
      Cookies.set("school-token", token);

      const profile = await axiosInstance.get(`users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = profile.data.user;
      const isAdmin = data.role.includes("Admin");
      const isTeacher = data.role.includes("Teacher");
      const isStudent = data.role.includes("Student");
      setUserDetails({
        isAdmin: isAdmin,
        isTeacher: isTeacher,
        isStudent: isStudent,
        token: token,
        ...data,
      });

      isTeacher && nav(`/teacher_profile/${data.profileId._id}`);
      isStudent && nav(`/student_profile/${data.profileId._id}`);
      isAdmin && nav(`/admin_profile`);
    } catch (error) {
      console.log(error);
      if (error.status === 401)
        setError(`${language.error && language.error.worng_user_password}`);
      else setError(`${language.error && language.error.network_error}`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="center section-color">
      <form onSubmit={handelSubmit} className="login relative">
        {formLoading && <FormLoading />}
        <div className="flex wrap">
          <div className="forms flex flex-direction">
            <h1>{language.login && language.login.login}</h1>
            <label htmlFor="username">
              {language.login && language.login.user_name}
            </label>
            <div className="center inp">
              <i className="fa-solid fa-user"></i>
              <input
                onInput={handleForm}
                value={form.username}
                className="flex-1"
                type="text"
                placeholder={
                  language.login && language.login.user_name_placeholder
                }
                required
                id="username"
              />
            </div>
            <label htmlFor="password">
              {language.login && language.login.password}
            </label>
            <div className="center inp">
              <i className="fa-solid fa-key"></i>
              <input
                value={form.password}
                onInput={handleForm}
                className="password flex-1"
                type="password"
                placeholder={
                  language.login && language.login.password_placeholder
                }
                required
                id="password"
              />
              <i
                onClick={showPassword}
                className="password fa-solid fa-eye-slash"
              ></i>
            </div>
            {error && <p className="error"> {error} </p>}
            <button className="btn">
              {language.login && language.login.submit_btn}
            </button>
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
