import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import axiosInstance from "../../utils/axios";
import { pagesRoute } from "../../constants/pagesRoute";

const UpdateAdmin = () => {
  const context = useContext(Context);
  const nav = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    axiosInstance
      .get(`admins/${id}`)
      .then((res) => {
        setForm({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          email: res.data.data.email,
        });
      })
      .catch((err) => {
        console.log(err);
        nav("/err-400");
      });
  }, []);

  const language = context?.selectedLang;

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axiosInstance.patch(`admins/${id}`, form);

      if (data.status === 200) {
        nav(pagesRoute.admin.page);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container relative">
          <h1 className="title">
            {language.admins && language.admins.update_admins}
          </h1>

          <form onSubmit={handelSubmit} className="relative dashboard-form">
            <h1>{language.exams && language.exams.please_complete_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="firstName">
                  {language.admins && language.admins.first_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.firstName}
                  type="text"
                  id="firstName"
                  className="inp"
                  placeholder={
                    language.admins && language.admins.first_name_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="lastName">
                  {language.admins && language.admins.last_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.lastName}
                  type="text"
                  id="lastName"
                  className="inp"
                  placeholder={
                    language.admins && language.admins.last_name_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="email">
                  {language.admins && language.admins.email}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.email}
                  type="email"
                  id="email"
                  className="inp"
                  placeholder={
                    language.admins && language.admins.email_placeholder
                  }
                />
              </div>
            </div>
            <button className="btn">
              {language.exams && language.exams.save_btn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateAdmin;
