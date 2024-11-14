import React, { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { Context } from "../../context/Context";

const AddExam = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    yearLevel: "",
    date: "",
    duration: "",
    totalMarks: "",
  });
  const language = context && context.selectedLang;
  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classesName, setClassesName] = useState(false);
  const [subjectsName, setSubjectsName] = useState(false);
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
    const { id, value } = e.target;

    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setForm((prevForm) => ({
        ...prevForm,
        [parentKey]: {
          ...prevForm[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: e.target.dataset.level,
    });
    setDataError(false);
  }

  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
    setDataError(false);
  }

  function selectSubjects(e, id) {
    setForm({
      ...form,
      subjectId: id,
    });
    setSubjectsName(e.target.dataset.subject);
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
    setForm({ ...form, classId: "", subjectId: "" });
    setClassesName("");
    setSubjectsName("");
    if (form.yearLevel) {
      axios
        .get(
          `http://localhost:8000/api/classes?yearLevel=${form.yearLevel}&active=true`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setClasses(res.data.data);
        });

      axios
        .get(
          `http://localhost:8000/api/subjects?yearLevel=${form.yearLevel}&active=true`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          setSubjects(res.data.data);
        });
    }
  }, [form.yearLevel]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel) setDataError("please choose a year level");
    else if (!form.classId) setDataError("please choose a class");
    else if (!form.subjectId) setDataError("please choose a subject");
    else {
      try {
        const data = await axios.post("http://localhost:8000/api/exams", form, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (data.status === 201) {
          responseFun(true);
          setForm({
            classId: "",
            subjectId: "",
            yearLevel: "",
            date: "",
            duration: "",
            totalMarks: "",
          });
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
          {overlay && <SendData data="exam" response={response} />}
          <h1 className="title">
            {" "}
            {language.exams && language.exams.add_exam}
          </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>{language.exams && language.exams.please_complete_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label>{language.exams && language.exams.year_level}</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.exams &&
                          language.exams.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
              </div>

              {form.yearLevel && (
                <>
                  <div className="flex flex-direction">
                    <label>{language.exams && language.exams.class}</label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {classesName
                          ? classesName
                          : `${
                              language.exams && language.exams.class_placeholder
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
                    </div>
                  </div>

                  <div className="flex flex-direction">
                    <label>
                      {language.exams && language.exams.subject_input}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {subjectsName
                          ? subjectsName
                          : `${
                              language.exams &&
                              language.exams.subject_placeholder
                            }`}
                      </div>
                      <article>
                        {subjects.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectSubjects(event, e._id)}
                              data-subject={`${e.name}`}
                              key={i}
                            >
                              {`${e.name}`}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-direction">
                <label htmlFor="date">
                  {language.exams && language.exams.exam_date}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.date}
                  type="datetime-local"
                  id="date"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="duration">
                  {language.exams && language.exams.duration_input}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.duration}
                  type="number"
                  id="duration"
                  className="inp"
                  placeholder={
                    language.exams && language.exams.duration_palceholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="totalMarks">
                  {language.exams && language.exams.total_marks}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.totalMarks}
                  type="number"
                  id="totalMarks"
                  className="inp"
                  placeholder={
                    language.exams && language.exams.total_marks_placeholder
                  }
                />
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">
              {language.exams && language.exams.save_btn}{" "}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddExam;
