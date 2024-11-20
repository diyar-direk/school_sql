import React, { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";

const UpdateTeacher = () => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [subject, setSubject] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [classes, setClasses] = useState([]);
  const nav = useNavigate();
  const [classesName, setClassesName] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: "",
    yearLevel: "",
    subjects: "",
    classes: "",
  });
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const token = context && context.userDetails.token;
  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/teachers/${params.id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const data = res.data.teacher;
        const subjects = data.subjects.map((e) => {
          setSubjectName((prev) => [...new Set([...prev, e.name])]);
          return e._id;
        });
        const classes = data.classes.map((e) => {
          setClassesName((prev) => [...new Set([...prev, e.name])]);
          return e._id;
        });

        setForm({
          subjects: subjects,
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          yearLevel: data.yearLevel,
          classes: classes,
        });
      });
  }, []);

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
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  function selectMale(e) {
    setForm({ ...form, gender: e.target.dataset.gender });
    setDataError(false);
  }

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: [...new Set([...form.yearLevel, +e.target.dataset.level])],
    });
    setDataError(false);
  }
  function selectSubjects(e, id) {
    setForm({
      ...form,
      subjects: [...new Set([...form.subjects, id])],
    });
    setSubjectName((prev) => [...new Set([...prev, e.target.dataset.subject])]);
    setDataError(false);
  }
  function selectClasses(e, id) {
    setForm({
      ...form,
      classes: [...new Set([...form.classes, id])],
    });
    setClassesName((prev) => [...new Set([...prev, e.target.dataset.classes])]);
    setDataError(false);
  }

  function createYearLeve() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 key={index} onClick={selectYears} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const allSubjects = await Promise.all(
          form.yearLevel &&
            form.yearLevel.map(async (yearLevel) => {
              const response = await fetch(
                `http://localhost:8000/api/subjects?yearLevel=${yearLevel}&active=true`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              if (!response.ok) {
                throw new Error(
                  `Error fetching data for year level ${yearLevel}`
                );
              }
              const data = await response.json();
              return data.data;
            })
        );
        setSubject(allSubjects.flat()); // Flatten the array if needed
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchSubjects();
  }, [form.yearLevel]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const allSubjects = await Promise.all(
          form.yearLevel &&
            form.yearLevel.map(async (yearLevel) => {
              const response = await fetch(
                `http://localhost:8000/api/classes?yearLevel=${yearLevel}&active=true`,
                {
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                }
              );
              if (!response.ok) {
                throw new Error(
                  `Error fetching data for year level ${yearLevel}`
                );
              }
              const data = await response.json();
              return data.data;
            })
        );
        setClasses(allSubjects.flat()); // Flatten the array if needed
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };

    fetchClasses();
  }, [form.yearLevel]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender) setDataError("please choose a gender");
    else if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classes) setDataError("please choose a classes");
    else if (!form.subjects) setDataError("please choose a subject");
    else {
      try {
        const data = await axios.patch(
          `http://localhost:8000/api/teachers/${params.id}`,
          form,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setForm({
          firstName: "",
          middleName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          gender: "",
          yearLevel: "",
          subjects: "",
          classes: "",
        });

        if (data.status === 200) {
          responseFun(true);
          nav("/dashboard/all_teachers");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <main>
      <div className="dashboard-container">
        <div className="container relative">
          {overlay && <SendData data="teacher" response={response} />}
          <h1 className="title">
            {" "}
            {language.teachers && language.teachers.update_Teacher}
          </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>{language.teachers && language.teachers.please_update_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="firstName">
                  {language.teachers && language.teachers.first_name}
                </label>
                <input
                  onInput={handleForm}
                  value={form.firstName}
                  type="text"
                  id="firstName"
                  className="inp"
                  required
                  placeholder={
                    language.teachers &&
                    language.teachers.first_name_placeholder
                  }
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="middleName">
                  {language.teachers && language.teachers.middle_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.middleName}
                  type="text"
                  id="middleName"
                  className="inp"
                  placeholder={
                    language.teachers &&
                    language.teachers.middle_name_placeholder
                  }
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="lastName">
                  {language.teachers && language.teachers.last_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.lastName}
                  type="text"
                  id="lastName"
                  placeholder={
                    language.teachers && language.teachers.last_name_placeholder
                  }
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label>
                  {language.teachers && language.teachers.gender_input}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.gender
                      ? form.gender
                      : `${
                          language.teachers &&
                          language.teachers.gender_placeholder
                        }`}
                  </div>
                  <article>
                    <h2 onClick={selectMale} data-gender="Male">
                      {language.teachers && language.teachers.male}
                    </h2>
                    <h2 onClick={selectMale} data-gender="Female">
                      {language.teachers && language.teachers.female}
                    </h2>
                  </article>
                </div>
              </div>

              <div className="flex flex-direction">
                <label htmlFor="email">
                  {" "}
                  {language.teachers && language.teachers.email}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.email}
                  type="email"
                  id="email"
                  placeholder={
                    language.teachers && language.teachers.email_placeholder
                  }
                  className="inp"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="phoneNumber">
                  {language.teachers && language.teachers.phone_number_input}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.phoneNumber}
                  type="text"
                  id="phoneNumber"
                  className="inp"
                  placeholder={
                    language.teachers &&
                    language.teachers.phone_number_placeholder
                  }
                />
              </div>
              <div className="flex flex-direction">
                <label>
                  {language.teachers && language.teachers.year_level}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel.length > 0
                      ? form.yearLevel.join(" , ")
                      : `${
                          language.teachers &&
                          language.teachers.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                  <div className="selected-value flex">
                    {form.yearLevel &&
                      form.yearLevel.map((e) => (
                        <span
                          onClick={() => {
                            const fltr = form.yearLevel.filter(
                              (ele) => ele !== e
                            );
                            setClassesName([]);
                            setSubjectName([]);
                            setForm({
                              ...form,
                              yearLevel: fltr,
                              classes: "",
                              subjects: "",
                            });
                          }}
                          key={e}
                        >
                          {e}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
              {form.yearLevel && (
                <>
                  <div className="flex flex-direction">
                    <label>
                      {language.teachers && language.teachers.classes}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {classesName.length > 0
                          ? classesName.join(" , ")
                          : `${
                              language.teachers &&
                              language.teachers.classes_placeholder
                            }`}
                      </div>
                      <article>
                        {classes.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectClasses(event, e._id)}
                              data-classes={`${e.yearLevel} : ${e.name}`}
                              key={i}
                            >
                              {`${e.yearLevel} : ${e.name}`}
                            </h2>
                          );
                        })}
                      </article>
                      <div className="selected-value flex">
                        {classesName.map((e, i) => {
                          return (
                            <span
                              onClick={() => {
                                const nameFltr = classesName.filter(
                                  (name) => name !== e
                                );
                                setClassesName(nameFltr);
                                const idFltr = form.classes.filter(
                                  (_, index) => index !== i
                                );
                                setForm({ ...form, classes: idFltr });
                              }}
                              key={i}
                            >
                              {e}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-direction">
                    <label>
                      {language.teachers && language.teachers.subjects}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {subjectName.length > 0
                          ? subjectName.join(" , ")
                          : `${
                              language.teachers &&
                              language.teachers.subjects_placeholder
                            }`}
                      </div>
                      <article>
                        {subject.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectSubjects(event, e._id)}
                              data-subject={e.name}
                              key={i}
                            >
                              {e.name}
                            </h2>
                          );
                        })}
                      </article>
                      <div className="selected-value flex">
                        {subjectName.map((e, i) => {
                          return (
                            <span
                              onClick={() => {
                                const nameFltr = subjectName.filter(
                                  (name) => name !== e
                                );
                                setSubjectName(nameFltr);
                                const idFltr = form.subjects.filter(
                                  (e, index) => index !== i
                                );
                                setForm({ ...form, subjects: idFltr });
                              }}
                              key={i}
                            >
                              {e}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">
              {language.teachers && language.teachers.save_btn}{" "}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateTeacher;
