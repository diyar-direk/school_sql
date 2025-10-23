import { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { Context } from "../../context/Context";
import { useNavigate, useParams } from "react-router-dom";
import { nextJoin } from "./AddQuiz";
import axiosInstance from "../../utils/axios";

const UpdateQuiz = () => {
  const context = useContext(Context);
  const { id } = useParams();

  const [multiQuestionsCount, setMultiQuestionsCount] = useState(1);
  const [multiQuestions, setMultiQuestions] = useState({
    choices: [{ text: "", isCorrect: false }],
    text: "",
    type: "multiple-choice",
  });

  const [arrayOfMultiQuestions, setArrayOfMultiQuestions] = useState([]);
  const [arrayOfT_RQuestions, setArrayOfT_RQuestions] = useState([]);

  const [multiSelect, setMultiSelect] = useState(false);
  const [T_RSelect, setT_RSelect] = useState(false);
  const [T_RQuestions, setT_RQuestions] = useState({
    text: "",
    correctAnswer: false,
    choices: [],
    type: "true-false",
  });
  const nav = useNavigate();

  const [form, setForm] = useState({
    classId: "",
    subjectId: "",
    yearLevel: "",
    date: "",
    duration: "",
    type: "Quize",
    title: "",
    description: "",
    questions: [],
  });

  useEffect(() => {
    axiosInstance
      .get(`quizzes/${id}`)
      .then((res) => {
        const data = res.data.data;
        const dateObject = new Date(data.date);

        const formattedDateTime = dateObject.toISOString().slice(0, 16);
        setForm({
          classId: data.classId._id,
          subjectId: data.subjectId._id,
          yearLevel: data.yearLevel,
          date: formattedDateTime,
          duration: data.duration,
          type: "Quize",
          title: data.title,
          description: data.description,
        });

        setClassesName(data.classId.name);
        setSubjectsName(data.subjectId.name);
        const multi = data.questions.filter(
          (e) => e.type === "multiple-choice"
        );
        const t_r = data.questions.filter((e) => e.type === "true-false");
        setArrayOfMultiQuestions(multi);
        setArrayOfT_RQuestions(t_r);
      })
      .catch((err) => {
        console.log(err);
        nav("/err-400");
      });
  }, []);

  const language = context && context.selectedLang;
  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [topFormError, setTopFormError] = useState(false);
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
    setTopFormError(false);
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
    setTopFormError(false);
  }

  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
    setTopFormError(false);
  }

  function selectSubjects(e, id) {
    setForm({
      ...form,
      subjectId: id,
    });
    setSubjectsName(e.target.dataset.subject);
    setTopFormError(false);
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
      axiosInstance
        .get(`classes?yearLevel=${form.yearLevel}&active=true`)
        .then((res) => {
          setClasses(res.data.data);
        });

      axiosInstance
        .get(`subjects?yearLevel=${form.yearLevel}&active=true`)
        .then((res) => {
          setSubjects(res.data.data);
        });
    }
  }, [form.yearLevel]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel)
      setTopFormError(
        `${language.error && language.error.please_choose_yearLevel}`
      );
    else if (!form.classId)
      setTopFormError(
        `${language.error && language.error.please_choose_class}`
      );
    else if (!form.subjectId)
      setTopFormError(
        `${language.error && language.error.please_choose_subject}`
      );
  };

  const handleInputChange = (e, index) => {
    const updatedQuestions = [...multiQuestions.choices];
    updatedQuestions[index].text = e.target.value;

    setMultiQuestions({ ...multiQuestions, choices: updatedQuestions });
    setDataError(false);
  };

  const createInp = (length) => {
    let inp = [];

    for (let i = 0; i < length; i++) {
      inp.push(
        <div key={i} className="flex relative flex-direction">
          <label htmlFor={`answor-${i + 1}`}>answor {i + 1}</label>
          <div className="center gap-10 justify-start">
            <textarea
              rows={3}
              required
              onInput={(e) => handleInputChange(e, i)}
              autoFocus={i > 0}
              value={multiQuestions.choices[i].text}
              type="text"
              id={`answor-${i + 1}`}
              className="inp"
              placeholder="write exam ansowr"
            />
            <i
              onClick={(e) => {
                const allTrues = document.querySelectorAll("form .true");
                allTrues.forEach((ele, i) => {
                  if (ele !== e.target) {
                    ele.classList.remove("active");
                    ele.nextElementSibling.classList.add("active");
                    const updatedQuestions = [...multiQuestions.choices];
                    updatedQuestions[i].isCorrect = false;

                    setMultiQuestions({
                      ...multiQuestions,
                      choices: updatedQuestions,
                    });
                  }
                  setDataError(false);
                });
                e.target.classList.add("active");
                e.target.nextSibling.classList.remove("active");
                const updatedQuestions = [...multiQuestions.choices];
                updatedQuestions[i].isCorrect = true;

                setMultiQuestions({
                  ...multiQuestions,
                  choices: updatedQuestions,
                });
              }}
              className={`${
                multiQuestions.choices[i].isCorrect ? "active" : ""
              } fa-solid fa-check true`}
            ></i>
            <i
              onClick={(e) => {
                e.target.classList.add("active");
                e.target.previousElementSibling.classList.remove("active");
                const updatedQuestions = [...multiQuestions.choices];
                updatedQuestions[i].isCorrect = false;

                setMultiQuestions({
                  ...multiQuestions,
                  choices: updatedQuestions,
                });
              }}
              className={`${
                !multiQuestions.choices[i].isCorrect ? "active" : ""
              } false fa-solid fa-xmark`}
            ></i>
          </div>
          <i
            onClick={() => {
              const fltr = multiQuestions.choices.filter(
                (e) => e !== multiQuestions.choices[i]
              );
              setMultiQuestions({
                ...multiQuestions,
                choices: fltr,
              });
              setMultiQuestionsCount(fltr.length);
            }}
            className="fa-solid fa-trash-can delete"
          ></i>
        </div>
      );
    }

    return inp;
  };

  const handleQuizForm = async (e) => {
    e.preventDefault();
    if (multiSelect) {
      const fltr = multiQuestions.choices.filter((e) => e.isCorrect);
      if (fltr.length === 0)
        setDataError(
          `${language.error && language.error.must_select_right_answer}`
        );
      else if (
        multiQuestions.choices.length <= 1 ||
        multiQuestions.choices.length > 4
      )
        setDataError(
          `${language.error && language.error.choices_must_between_2_4}`
        );
      else {
        setMultiSelect(false);
        setT_RSelect(false);
        setMultiQuestionsCount(1);
        setMultiQuestions({
          text: "",
          choices: [{ text: "", isCorrect: false }],
          type: "multiple-choice",
        });
        setArrayOfMultiQuestions((prev) => [...prev, multiQuestions]);
        setDataError(false);
      }
    } else if (T_RSelect) {
      setArrayOfT_RQuestions([...arrayOfT_RQuestions, T_RQuestions]);
      setT_RQuestions({
        text: "",
        correctAnswer: false,
        type: "true-false",
        choices: [],
      });
      setMultiSelect(false);
      setT_RSelect(false);
      setDataError(false);
    }
  };

  const submitData = async () => {
    if (
      !form.classId ||
      !form.date ||
      !form.description ||
      !form.duration ||
      !form.subjectId ||
      !form.title ||
      !form.yearLevel
    ) {
      const inp = document.querySelector("form.dashboard-form");
      window.scrollTo({
        top: inp.offsetTop - 20,
        behavior: "smooth",
        left: 0,
      });
      setTopFormError("please compleat the form");
      return;
    } else if (T_RSelect || multiSelect) {
      setDataError(`${language.error && language.error.please_save_first}`);
      const inp = document.querySelector("form.quize");
      window.scrollTo({
        top: inp.offsetTop - 50,
        behavior: "smooth",
        left: 0,
      });
      return;
    }
    const allQuestions = [...arrayOfMultiQuestions, ...arrayOfT_RQuestions];
    const startDate = new Date(form.date);
    const endDate = new Date(startDate.getTime() + form.duration * 60 * 1000);
    const payload = {
      ...form,
      questions: allQuestions,
      endDate: endDate.toISOString(),
    };
    try {
      const data = await axiosInstance.patch(`quizzes/${id}`, payload);

      if (data.status === 200) {
        nav("/all_quizzes");
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
        className={`${
          context?.isClosed ? "closed" : ""
        } relative dashboard-container`}
      >
        {loading && <FormLoading />}
        <div className="container relative">
          {overlay && (
            <SendData
              data={`${language.error && language.error.quiz}`}
              response={response}
            />
          )}
          <h1 className="title">{language?.quizzes.update_quiz}</h1>
          <form onSubmit={handelSubmit} className="relative dashboard-form">
            <h1>{language.exams && language.exams.please_complete_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="title">
                  {language.quizzes && language.quizzes.exam_title}
                </label>
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
                <label htmlFor="description">
                  {language.quizzes && language.quizzes.exam_discreption}
                </label>
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
                <label htmlFor="date">
                  {language.quizzes && language.quizzes.quiz_date}
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
                  min={0}
                  className="inp"
                  placeholder={
                    language.exams && language.exams.duration_palceholder
                  }
                />
              </div>
            </div>
            {topFormError && <p className="error">{topFormError}</p>}
          </form>

          <form
            onSubmit={handleQuizForm}
            className="relative quize dashboard-form"
          >
            {multiSelect && (
              <div className="flex wrap">
                <div className="flex flex-direction">
                  <label htmlFor="question">
                    {language.quizzes && language.quizzes.question_title}
                  </label>
                  <textarea
                    rows={3}
                    autoFocus
                    required
                    onInput={(e) =>
                      setMultiQuestions({
                        ...multiQuestions,
                        text: e.target.value,
                      })
                    }
                    value={multiQuestions.text}
                    type="text"
                    id="question"
                    className="inp"
                    placeholder="write question title"
                  />
                </div>
                {createInp(multiQuestionsCount)}
              </div>
            )}

            {multiSelect && (
              <span
                onClick={() => {
                  if (multiQuestionsCount > 3)
                    setDataError(
                      `${language.error && language.error.cant_add_more_then_4}`
                    );
                  else {
                    setMultiQuestions({
                      ...multiQuestions,
                      choices: [
                        ...multiQuestions.choices,
                        { text: "", isCorrect: false },
                      ],
                    });
                    setMultiQuestionsCount((e) => e + 1);
                  }
                }}
                className="add-question multi-add"
              >
                + {language.quizzes && language.quizzes.add_answer}
              </span>
            )}

            {T_RSelect && (
              <div className="flex wrap">
                <div className="flex flex-direction">
                  <label htmlFor={`answor-${1}`}>
                    {language.quizzes && language.quizzes.question_title}{" "}
                  </label>
                  <div className="center gap-10 justify-start">
                    <textarea
                      rows={3}
                      autoFocus
                      required
                      value={T_RQuestions.text}
                      onInput={(e) =>
                        setT_RQuestions({
                          ...T_RQuestions,
                          text: e.target.value,
                        })
                      }
                      type="text"
                      id={`answor-${1}`}
                      className="inp"
                      placeholder="write exam ansowr"
                    />
                    <i
                      onClick={(e) => {
                        e.target.classList.add("active");
                        e.target.nextSibling.classList.remove("active");
                        setT_RQuestions({
                          ...T_RQuestions,
                          correctAnswer: true,
                        });
                      }}
                      className={`${
                        T_RQuestions.correctAnswer ? "active" : ""
                      } fa-solid fa-check true`}
                    ></i>
                    <i
                      onClick={(e) => {
                        e.target.classList.add("active");
                        e.target.previousElementSibling.classList.remove(
                          "active"
                        );
                        setT_RQuestions({
                          ...T_RQuestions,
                          correctAnswer: false,
                        });
                      }}
                      className={`false ${
                        !T_RQuestions.correctAnswer ? "active" : ""
                      } fa-solid fa-xmark`}
                    ></i>
                  </div>
                </div>
              </div>
            )}

            {!multiSelect && !T_RSelect && (
              <div className="flex gap-20">
                <span
                  className="add-question"
                  onClick={() => {
                    setT_RSelect(false);
                    setMultiSelect(true);
                  }}
                >
                  +{" "}
                  {language.quizzes &&
                    language.quizzes.add_multichoice_question}
                </span>
                <span
                  onClick={() => {
                    setT_RSelect(true);
                    setMultiSelect(false);
                  }}
                  className="add-question"
                >
                  +{" "}
                  {language.quizzes && language.quizzes.add_trueflase_question}
                </span>
              </div>
            )}
            {DataError && <p className="error"> {DataError} </p>}
            {(multiSelect || T_RSelect) && (
              <button className="btn">
                {language.quizzes && language.quizzes.save}
              </button>
            )}
          </form>

          {(arrayOfMultiQuestions.length > 0 ||
            arrayOfT_RQuestions.length > 0) && (
            <div className="tabel-container">
              <div className="table">
                {arrayOfMultiQuestions.length > 0 && (
                  <>
                    <h2>{language.quizzes && language.quizzes.multiple}</h2>
                    <table className="mb-40 quiz-table">
                      <thead>
                        <tr>
                          <th>
                            {language.quizzes && language.quizzes.question}
                          </th>
                          <th>
                            {language.quizzes && language.quizzes.wrong_ans}
                          </th>
                          <th>
                            {language.quizzes && language.quizzes.correct_ans}
                          </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {arrayOfMultiQuestions.map((e, i) => {
                          const correctAnswer = e.choices.filter(
                            (ele) => ele.isCorrect
                          );
                          const wrongAnswer = e.choices.filter(
                            (ele) => !ele.isCorrect
                          );

                          return (
                            <tr key={i}>
                              <td> {e.text} </td>
                              <td>{nextJoin(wrongAnswer, "text")}</td>
                              <td> {correctAnswer[0].text} </td>
                              <td>
                                <div className="admin gap-10 center">
                                  <i
                                    onClick={() => {
                                      const fltr = arrayOfMultiQuestions.filter(
                                        (item) => item !== e
                                      );
                                      setArrayOfMultiQuestions(fltr);
                                    }}
                                    className="fa-solid fa-trash delete"
                                  ></i>
                                  <i
                                    onClick={() => {
                                      if (T_RSelect || multiSelect) {
                                        setDataError(
                                          `${
                                            language.error &&
                                            language.error.please_save_first
                                          }`
                                        );
                                      } else {
                                        setMultiQuestions(e);
                                        const fltr =
                                          arrayOfMultiQuestions.filter(
                                            (item) => item !== e
                                          );
                                        setArrayOfMultiQuestions(fltr);
                                        setMultiQuestionsCount(
                                          e.choices.length
                                        );
                                        setT_RSelect(false);
                                        setMultiSelect(true);
                                        const inp =
                                          document.querySelector("form.quize");
                                        window.scrollTo({
                                          top: inp.offsetTop - 50,
                                          behavior: "smooth",
                                          left: 0,
                                        });
                                      }
                                    }}
                                    className="fa-regular fa-pen-to-square update c-pointer"
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}

                {arrayOfT_RQuestions.length > 0 && (
                  <>
                    <h2>{language.quizzes && language.quizzes.t_f}</h2>
                    <table className="quiz-table">
                      <thead>
                        <tr>
                          <th>
                            {language.quizzes && language.quizzes.question}
                          </th>
                          <th>{language.quizzes && language.quizzes.answer}</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {arrayOfT_RQuestions.map((e, i) => {
                          return (
                            <tr key={i}>
                              <td> {e.text} </td>
                              <td>{e.correctAnswer ? "true" : "false"}</td>
                              <td>
                                <div className="admin gap-10 center">
                                  <i
                                    onClick={() => {
                                      const fltr = arrayOfT_RQuestions.filter(
                                        (item) => item !== e
                                      );
                                      setArrayOfT_RQuestions(fltr);
                                    }}
                                    className="fa-solid fa-trash delete"
                                  ></i>
                                  <i
                                    onClick={() => {
                                      if (T_RSelect || multiSelect) {
                                        setDataError(
                                          `${
                                            language.error &&
                                            language.error.please_save_first
                                          }`
                                        );
                                      } else {
                                        setT_RQuestions(e);
                                        const fltr = arrayOfT_RQuestions.filter(
                                          (item) => item !== e
                                        );
                                        setArrayOfT_RQuestions(fltr);
                                        setT_RSelect(true);
                                        setMultiSelect(false);
                                        const inp =
                                          document.querySelector("form.quize");
                                        window.scrollTo({
                                          top: inp.offsetTop - 50,
                                          behavior: "smooth",
                                          left: 0,
                                        });
                                      }
                                    }}
                                    className="fa-regular fa-pen-to-square update c-pointer"
                                  ></i>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <div onClick={() => submitData()} className="btn send-quiz">
                {language.quizzes && language.quizzes.send_quiz}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default UpdateQuiz;
