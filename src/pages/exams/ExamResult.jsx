import { useContext, useEffect, useState } from "react";
import "../../components/form.css";
import { Context } from "../../context/Context";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
const ExamResult = () => {
  const context = useContext(Context);
  const { userDetails: user } = useAuth();
  const isAdmin = user?.isAdmin;
  const isStudent = user?.isStudent;
  const userDetails = user?.userDetails;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const [form, setForm] = useState({
    yearLevel: "",
    classId: "",
    student: "",
  });
  const language = context?.selectedLang;
  async function fetchData() {
    setData([]);
    setLoading(true);
    try {
      if (form.student)
        await axiosInstance
          .get(`exam-results/details/${form.student}`)
          .then((res) => {
            setData(res.data.data);
          });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchData();
  }, [form.student]);

  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      setSelectedItems([]);
    }
    const td = document.querySelector("td.input");
    td && td.classList.remove("input");
  };

  const maxResultsLength = Math.max(...data.map((e) => e.results.length));

  const deleteExam = async () => {
    try {
      const data = await axiosInstance.patch(
        `exam-results/deactivate/${selectedItems}`,
        []
      );
      data && fetchData();

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      const inpValue = parseFloat(
        document.querySelector("td.input input").value
      );

      const res = await axiosInstance.patch(
        `exam-results/${selectedItems.examResultId}`,
        { score: inpValue, type: selectedItems.type }
      );

      if (res.status === 200) {
        setSelectedItems([]);
        const td = document.querySelector("td.input");
        td && td.classList.remove("input");
        fetchData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const tableData =
    data &&
    data.map((e, i) => {
      const totalScore = e.results.reduce((acc, score) => acc + score.score, 0);
      const totalMark = e.results.reduce(
        (acc, score) => acc + score.totalMarks,
        0
      );

      return (
        <tr key={i}>
          <td>{e._id}</td>
          {e.results.map((score, i) => (
            <td key={i}>
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (e.target.nextSibling)
                    e.target.nextSibling.nextSibling.nextSibling.click();
                }}
              >
                {`${score.type}: `} {score.score + "/" + score.totalMarks}
              </span>
              {isAdmin && (
                <form
                  onSubmit={handelSubmit}
                  onClick={(e) => e.stopPropagation()}
                  className="div-input"
                >
                  <input
                    className="update-input"
                    type="number"
                    min={0}
                    max={score.totalMarks}
                    required
                  />
                  <button className="fa-solid fa-arrow-right"></button>
                </form>
              )}
              {isAdmin && (
                <i
                  onClick={(event) => {
                    event.stopPropagation();
                    setOverlay(true);
                    setSelectedItems(score.examResultId);
                  }}
                  className="delete icon fa-regular fa-trash-can"
                ></i>
              )}
              {isAdmin && (
                <i
                  onClick={(event) => {
                    event.stopPropagation();
                    const td = document.querySelectorAll("td.input");
                    td.forEach((e) => {
                      e !== event.target.parentNode &&
                        e.classList.remove("input");
                    });
                    event.target.parentNode.classList.toggle("input");
                    const inp = document.querySelector("td.input input");
                    inp && (inp.value = score.score);
                    inp && inp.focus();
                    setSelectedItems(score);
                  }}
                  className="update icon fa-regular fa-pen-to-square"
                ></i>
              )}
            </td>
          ))}

          {/* Add empty cells if there are fewer than 3 results */}
          {Array.from({ length: maxResultsLength - e.results.length }).map(
            (_, idx) => (
              <td key={`empty-${idx}`}></td>
            )
          )}

          {/* Total score and marks */}
          <td>{`${totalScore}/${totalMark}`}</td>
        </tr>
      );
    });

  const createThExams = (length) => {
    const th = [];
    for (let index = 0; index < length; index++) {
      th.push(<th key={index}> exam {index + 1} </th>);
    }
    return th;
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
  const [dataNames, setDataNames] = useState({
    classesName: "",
    studentName: "",
  });
  const [classes, setClasses] = useState([]);
  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setDataNames({ ...dataNames, classesName: e.target.dataset.classes });
  }
  const [students, setStudents] = useState([]);
  function selectStudent(e, id) {
    setForm({
      ...form,
      student: id,
    });
    setDataNames({ ...dataNames, studentName: e.target.dataset.student });
  }
  useEffect(() => {
    if (!isStudent) {
      setForm({ ...form, classId: "" });
      setDataNames({ ...dataNames, classesName: "" });
      if (form.yearLevel) {
        axiosInstance
          .get(`classes?yearLevel=${form.yearLevel}&active=true`)
          .then((res) => {
            setClasses(res.data.data);
          });
      }
    }
  }, [form.yearLevel]);

  useEffect(() => {
    if (form.classId && !isStudent) {
      axiosInstance
        .get(`tudents?classId=${form.classId}&active=true`)
        .then((res) => {
          setStudents(res.data.data);
        });
    }
  }, [form.classId]);

  useEffect(() => {
    if (isStudent) {
      setForm({
        yearLevel: userDetails.yearLevel,
        classId: userDetails.classId,
        student: userDetails._id,
      });
    }
  }, []);

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container">
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>{`confirm delete exam`}</h1>
                <div className="flex gap-20">
                  <div
                    onClick={() => {
                      deleteExam();
                    }}
                    className="false center"
                  >
                    <h2>
                      {" "}
                      {language.examResult && language.examResult.delete}
                    </h2>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <div
                    onClick={() => {
                      setOverlay(false);
                      setSelectedItems([]);
                    }}
                    className="none center"
                  >
                    <h2>{language.examResult && language.examResult.cancel}</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          {!isStudent && (
            <form className="exam-result dashboard-form">
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
                          {classes.length > 0 ? (
                            classes.map((e, i) => {
                              return (
                                <h2
                                  onClick={(event) =>
                                    selectClasses(event, e._id)
                                  }
                                  data-classes={`${e.yearLevel} : ${e.name}`}
                                  key={i}
                                >
                                  {`${e.yearLevel} : ${e.name}`}
                                </h2>
                              );
                            })
                          ) : (
                            <h2>loading</h2>
                          )}
                        </article>
                      </div>
                    </div>
                  </>
                )}

                {form.classId && (
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
                          {students.length > 0 ? (
                            students.map((e, i) => {
                              return (
                                <h2
                                  onClick={(event) =>
                                    selectStudent(event, e._id)
                                  }
                                  data-student={`${e.firstName} ${e.middleName} ${e.lastName}`}
                                  key={i}
                                >
                                  {`${e.firstName} ${e.middleName} ${e.lastName}`}
                                </h2>
                              );
                            })
                          ) : (
                            <h2>loading</h2>
                          )}
                        </article>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </form>
          )}

          {form.student && (
            <div className="tabel-container">
              <div className="table">
                <table
                  className={`${tableData.length === 0 ? "loading" : ""} exam`}
                >
                  <thead>
                    <tr>
                      {tableData.length > 0 && (
                        <>
                          <th>
                            {language.examResult &&
                              language.examResult.subject_name}
                          </th>
                          {createThExams(maxResultsLength)}
                          <th>
                            {language.examResult && language.examResult.score}
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody
                    className={`${tableData.length === 0 ? "relative" : ""}`}
                  >
                    {tableData.length > 0
                      ? tableData
                      : !loading && (
                          <div className="table-loading">
                            {language.examResult && language.examResult.no_data}
                          </div>
                        )}
                    {loading && (
                      <div className="table-loading">
                        {language.examResult && language.examResult.loading}
                      </div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ExamResult;
