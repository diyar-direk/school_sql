import React, { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import axios from "axios";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { Context } from "../../context/Context";

const AddQuiz = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const [multiQuestionsCount, setMultiQuestionsCount] = useState(0);
  const [multiQuestions, setMultiQuestions] = useState([]);
  const [T_RQuestions, setT_RQuestions] = useState([]);
  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    yearLevel: "",
    date: "",
    duration: "",
    type: "Quize",
    title: "",
    description: "",
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

    setForm((prevForm) => ({
      ...prevForm,
      [id]: value,
    }));
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

  const handleInputChange = (e, index) => {
    const updatedQuestions = [...multiQuestions];
    updatedQuestions[index].name = e.target.value;
    setMultiQuestions(updatedQuestions);
  };

  const createInp = (length) => {
    let inp = [];

    for (let i = 0; i < length; i++) {
      inp.push(
        <div className="flex flex-direction">
          <label htmlFor={`answor-${i + 1}`}>answor {i + 1}</label>
          <div className="center gap-10 justify-start">
            <input
              required
              onInput={(e) => handleInputChange(e, i)}
              value={multiQuestions[i].name}
              type="text"
              id={`answor-${i + 1}`}
              className="inp"
              placeholder="write exam ansowr"
            />
            <i
              data-icon={`answor-${i + 1}`}
              className="fa-solid fa-check true"
            ></i>
            <i
              data-icon={`answor-${i + 1}`}
              className="false fa-solid fa-xmark"
            ></i>
          </div>
        </div>
      );
    }

    return inp;
  };

  return (
    <main>
      <div className="dashboard-container">
        <div className="container relative">
          {overlay && <SendData data="exam" response={response} />}
          <h1 className="title">add quiz</h1>
          <form onSubmit={handelSubmit} className="relative dashboard-form">
            {loading && <FormLoading />}
            <h1>{language.exams && language.exams.please_complete_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="title">exam title</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.title}
                  type="text"
                  id="title"
                  className="inp"
                  placeholder="write exam title"
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="description">exam description</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.description}
                  type="text"
                  id="description"
                  className="inp"
                  placeholder="write exam description"
                />
              </div>
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
                <label htmlFor="date">quize date</label>
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
                  min={0}
                  className="inp"
                  placeholder={
                    language.exams && language.exams.duration_palceholder
                  }
                />
              </div>
            </div>
          </form>
          <form className="relative quize dashboard-form">
            <div className="flex wrap">
              <div className="flex flex-direction">
                <label htmlFor="title">exam title</label>
                <input
                  required
                  type="text"
                  id="title"
                  className="inp"
                  placeholder="write exam title"
                />
              </div>
              {createInp(multiQuestionsCount)}
            </div>
            <span
              onClick={() => {
                setMultiQuestions((prev) => [
                  ...prev,
                  { name: "diyar", is: "" },
                ]);
                setMultiQuestionsCount((e) => e + 1);
              }}
              className="add-question"
            >
              + add answor
            </span>

            <div className="flex gap-20">
              <span className="add-question">
                + add multiple choice question
              </span>
              <span className="add-question">+ add true false question</span>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddQuiz;
