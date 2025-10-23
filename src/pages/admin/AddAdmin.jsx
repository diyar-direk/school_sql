import { useContext, useState } from "react";
import { Context } from "../../context/Context";
import axiosInstance from "../../utils/axios";

const AddAdmin = () => {
  const context = useContext(Context);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const language = context?.selectedLang;

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axiosInstance.post("admins", form);
      if (data.status === 201) {
        setForm({
          firstName: "",
          lastName: "",
          email: "",
        });
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
            {language.admins && language.admins.add_admins}
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

export default AddAdmin;
