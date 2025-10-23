import React, { useContext, useEffect, useState } from "react";
import "../components/form.css";
import axios from "axios";
import { Context } from "../context/Context";
import SendData from "../components/response/SendData";
import FormLoading from "../components/FormLoading";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAdmin = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const nav = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admins/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setForm({
          firstName: res.data.data.firstName,
          lastName: res.data.data.lastName,
          email: res.data.data.email,
        });
      })
      .catch((err) => {
        console.log(err);
        nav("/dashboard/err-400");
      });
  }, []);

  const language = context && context.selectedLang;
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  const responseFun = (complete = false) => {
    setOverlay(true);

    complete === true
      ? setResponse(true)
      : complete === "reapeted data"
      ? setResponse(400)
      : setResponse(false);
    window.onclick = () => {
      setOverlay(false);
    };
    setTimeout(() => {
      setOverlay(false);
    }, 3000);
  };

  const handleForm = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await axios.patch(
        `http://localhost:8000/api/admins/${id}`,
        form,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (data.status === 200) {
        responseFun(true);
        nav("/dashboard/all_admins");
      }
    } catch (error) {
      console.log(error);
      if (error.status === 400) responseFun("reapeted data");
      else responseFun(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container relative">
          {overlay && (
            <SendData
              data={`${language.error && language.error.admin}`}
              response={response}
            />
          )}
          <h1 className="title">
            {language.admins && language.admins.update_admins}
          </h1>

          <form onSubmit={handelSubmit} className="relative dashboard-form">
            {loading && <FormLoading />}
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
