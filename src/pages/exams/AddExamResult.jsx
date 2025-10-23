import { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { Context } from "../../context/Context";
import axiosInstance from "../../utils/axios";

const AddExamResult = () => {
  const context = useContext(Context);
  const [form, setForm] = useState({
    yearLevel: "",
    classId: "",
    exam: "",
    student: "",
    score: "",
    type: "Exam",
  });
  const language = context?.selectedLang;
  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);
  const [maxScore, setMaxScore] = useState(100);

  const [dataNames, setDataNames] = useState({
    classesName: "",
    examsName: "",
    studentName: "",
  });

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
    setDataNames({ ...dataNames, classesName: e.target.dataset.classes });
    setDataError(false);
  }

  function selectExam(e, id, totalMarks) {
    setForm({
      ...form,
      exam: id,
    });
    setDataNames({ ...dataNames, examsName: e.target.dataset.exam });
    setMaxScore(totalMarks);
    setDataError(false);
  }
  function selectStudent(e, id) {
    setForm({
      ...form,
      student: id,
    });
    setDataNames({ ...dataNames, studentName: e.target.dataset.student });
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
    setForm({ ...form, classId: "" });
    setDataNames({ ...dataNames, classesName: "" });
    if (form.yearLevel) {
      axiosInstance
        .get(`classes?yearLevel=${form.yearLevel}&active=true`)
        .then((res) => {
          setClasses(res.data.data);
        });
    }
  }, [form.yearLevel]);

  useEffect(() => {
    setForm({ ...form, exam: "" });
    setDataNames({ ...dataNames, examsName: "" });
    if (form.classId) {
      axiosInstance
        .get(`exams?classId=${form.classId}&active=true`)
        .then((res) => {
          setExams(res.data.data);
        });
      axiosInstance
        .get(`students?classId=${form.classId}&active=true`)
        .then((res) => {
          setStudents(res.data.data);
        });
    }
  }, [form.classId]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel)
      setDataError(
        `${language.error && language.error.please_choose_yearLevel}`
      );
    else if (!form.classId)
      setDataError(`${language.error && language.error.please_choose_class}`);
    else if (!form.exam)
      setDataError(`${language.error && language.error.please_choose_exam}`);
    else if (!form.student)
      setDataError(`${language.error && language.error.please_choose_student}`);
    else {
      try {
        const data = await axiosInstance.post("exam-results", form);

        if (data.status === 201) {
          responseFun(true);
          setForm({
            yearLevel: "",
            classId: "",
            exam: "",
            student: "",
            score: "",
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
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container relative">
          {overlay && (
            <SendData
              data={`${language.error && language.error.Result}`}
              response={response}
            />
          )}
          <h1 className="title">
            {language.examResult && language.examResult.add_exam_result}{" "}
          </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>
              {language.examResult && language.examResult.please_complete_form}{" "}
            </h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label>
                  {language.examResult && language.examResult.year_level}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.examResult &&
                          language.examResult.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
              </div>

              {form.yearLevel && (
                <>
                  <div className="flex flex-direction">
                    <label>
                      {language.examResult && language.examResult.class}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {dataNames.classesName
                          ? dataNames.classesName
                          : `${
                              language.examResult &&
                              language.examResult.class_placeholder
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
                </>
              )}

              {form.classId && (
                <>
                  <div className="flex flex-direction">
                    <label>
                      {language.examResult && language.examResult.exam}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {dataNames.examsName
                          ? dataNames.examsName
                          : `${
                              language.examResult &&
                              language.examResult.exam_placeholder
                            }`}
                      </div>
                      <article>
                        {exams.map((e, i) => {
                          if (e.subjectId)
                            return (
                              <h2
                                onClick={(event) =>
                                  selectExam(event, e._id, e.totalMarks)
                                }
                                data-exam={e.subjectId.name}
                                key={i}
                              >
                                {e.subjectId.name}
                              </h2>
                            );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}

              {form.exam && (
                <>
                  <div className="flex flex-direction">
                    <label>
                      {language.examResult && language.examResult.student}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {dataNames.studentName
                          ? dataNames.studentName
                          : `${
                              language.examResult &&
                              language.examResult.student_Placeholder
                            }`}
                      </div>
                      <article>
                        {students.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectStudent(event, e._id)}
                              data-student={`${e.firstName} ${e.middleName} ${e.lastName}`}
                              key={i}
                            >
                              {`${e.firstName} ${e.middleName} ${e.lastName}`}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}

              <div className="flex flex-direction">
                <label htmlFor="totalMarks">
                  {language.examResult && language.examResult.score}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.score}
                  type="number"
                  id="score"
                  className="inp"
                  max={maxScore}
                  min={0}
                  placeholder={
                    language.examResult && language.examResult.score_placeholder
                  }
                />
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">
              {language.examResult && language.examResult.save_btn}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AddExamResult;
