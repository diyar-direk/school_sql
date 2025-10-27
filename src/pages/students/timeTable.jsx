import { useContext, useEffect, useState } from "react";

import "../../components/form.css";
import FormLoading from "./../../components/FormLoading";
import { Context } from "../../context/Context";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
const TimeTable = () => {
  const context = useContext(Context);
  const { userDetails: user } = useAuth();
  const isAdmin = user?.userDetails?.isAdmin;
  const isStudent = user?.userDetails?.isStudent;
  const userDetails = user?.userDetails?.userDetails;
  const date = new Date();
  const [data, setData] = useState([]);
  const [dayNumber, setDayNumber] = useState(date.getUTCDay() || 0);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const language = context?.selectedLang;

  const daysOfWeek = [
    { name: language?.days?.sunday, day: "Sunday" },
    { name: language?.days?.monday, day: "Monday" },
    { name: language?.days?.tuesday, day: "Tuesday" },
    { name: language?.days?.wednesday, day: "Wednesday" },
    { name: language?.days?.thursday, day: "Thursday" },
    { name: language?.days?.friday, day: "Friday" },
    { name: language?.days?.saturday, day: "Saturday" },
  ];

  const [form, setForm] = useState({
    startTime: "",
    endTime: "",
    classId: "",
    subjectId: "",
    dayOfWeek: daysOfWeek[dayNumber].day,
    yearLevel: "",
  });

  async function getData() {
    if (form.classId) {
      try {
        const res = await axiosInstance.get(
          `time-table?active=true&classId=${form.classId}&dayOfWeek=${daysOfWeek[dayNumber].day}&sort=startTime`
        );
        setData(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getData();

    setForm({ ...form, dayOfWeek: daysOfWeek[dayNumber].day });
  }, [dayNumber, form]);

  useEffect(() => {
    if (selectedId) {
      setSubjectName(selectedId.subjectId.name);
      setForm({
        ...form,
        startTime: selectedId.startTime,
        endTime: selectedId.endTime,
        subjectId: selectedId.subjectId._id,
      });
    }
  }, [selectedId]);

  const deleteData = async (id) => {
    try {
      await axiosInstance.patch(`time-table/deactivate/${id}`, []);
      getData();
    } catch (error) {
      console.log(error);
    }
  };

  const tableData =
    data &&
    data.map((e, i) => {
      return (
        <tr key={i}>
          <td> {e.classId.yearLevel + " : " + e.classId.name} </td>
          <td>{e.startTime}</td>
          <td> {e.endTime} </td>
          <td> {e.subjectId.name} </td>
          {isAdmin && (
            <td>
              <div className="flex gap-10">
                <i
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsUpdate(true);
                    setSelectedId(e);
                    setOverlay(true);
                  }}
                  className="update fa-regular fa-pen-to-square"
                ></i>
                <i
                  onClick={() => deleteData(e._id)}
                  className="delete fa-regular fa-trash-can"
                ></i>
              </div>
            </td>
          )}
        </tr>
      );
    });

  const increment = () => {
    setDayNumber((prev) => (prev + 1) % 7);
    setData([]);
    setLoading(true);
  };
  const decrement = () => {
    setDayNumber((prev) => (prev - 1 + 7) % 7);
    setData([]);
    setLoading(true);
  };
  window.onclick = () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
      setOverlay(false);
      setIsUpdate(false);
      setSelectedId("");
      setSubjectName("");
      setForm({
        ...form,
        startTime: "",
        endTime: "",
        subjectId: "",
      });
      setDataError(false);
    }
  };
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  const selecteSubject = (e) => {
    setForm({ ...form, subjectId: e._id });
    const activeDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    activeDiv && activeDiv.classList.remove("active");
    setSubjectName(e.name);
    setDataError(false);
  };
  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.subjectId)
      setDataError(`${language.error && language.error.please_choose_subject}`);
    else {
      setFormLoading(true);
      try {
        if (!isUpdate) {
          await axiosInstance.post(`time-table`, form);
          getData();
        } else {
          await axiosInstance.patch(`time-table/${selectedId._id}`, form);
          getData();
        }

        setOverlay(false);
        setIsUpdate(false);
        setSelectedId("");
        setForm({ ...form, startTime: "", endTime: "", subjectId: "" });
        setSubjectName("");
      } catch (error) {
        console.log(error);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState("");
  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
  }

  useEffect(() => {
    if (!isStudent) {
      setForm({ ...form, classId: "" });
      setClassesName("");
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
    if (isStudent) {
      setForm({
        ...form,
        yearLevel: userDetails.yearLevel,
        classId: userDetails.classId,
      });
    }
  }, [isStudent]);

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        {overlay && (
          <div className="overlay">
            <form
              onSubmit={(e) => handelSubmit(e)}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-form relative"
            >
              {formLoading && <FormLoading />}
              <div className="flex flex-direction">
                <label htmlFor="subject">
                  {language.timeTable && language.timeTable.subject}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {subjectName
                      ? subjectName
                      : `${
                          language.timeTable &&
                          language.timeTable.subject_placeholder
                        }`}
                  </div>
                  <article>
                    {subjects.map((e) => {
                      return (
                        <h2 onClick={() => selecteSubject(e)} key={e._id}>
                          {e.name}
                        </h2>
                      );
                    })}
                  </article>
                </div>
                <label htmlFor="startTime">
                  {language.timeTable && language.timeTable.start_time}
                </label>
                <input
                  value={form.startTime}
                  onInput={(e) =>
                    setForm({ ...form, startTime: e.target.value })
                  }
                  required
                  type="time"
                  className="inp"
                  id="startTime"
                />
                <label htmlFor="endTime">
                  {language.timeTable && language.timeTable.end_time}
                </label>
                <input
                  value={form.endTime}
                  onInput={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                  type="time"
                  className="inp"
                  id="endTime"
                />
                {DataError && <p className="error">{DataError}</p>}
                <button className="btn">
                  {language.timeTable && language.timeTable.save_btn}
                </button>
              </div>
            </form>
          </div>
        )}
        <div className="container">
          {!isStudent && (
            <form className="exam-result dashboard-form">
              <div className="flex wrap ">
                <div className="flex flex-direction">
                  <label>
                    {language.timeTable && language.timeTable.year_level}
                  </label>
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {form.yearLevel
                        ? form.yearLevel
                        : `${
                            language.timeTable &&
                            language.timeTable.year_level_placeholder
                          }`}
                    </div>
                   
                  </div>
                </div>

                {form.yearLevel && (
                  <>
                    <div className="flex flex-direction">
                      <label>{language?.attendance.class}</label>
                      <div className="selecte">
                        <div onClick={handleClick} className="inp">
                          {classesName
                            ? classesName
                            : language?.attendance.class_placeholder}
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
              </div>
            </form>
          )}

          {form.classId && (
            <div className="tabel-container">
              <div className="day flex">
                <div onClick={decrement} className="flex-1">
                  {language.timeTable && language.timeTable.prev_day}
                </div>
                <div className="flex-1"> {daysOfWeek[dayNumber].name} </div>
                <div onClick={increment} className="flex-1">
                  {language.timeTable && language.timeTable.next_day}
                </div>
              </div>
              <div className="table">
                <table
                  className={`${
                    tableData.length === 0 ? "loading" : ""
                  } time-table`}
                >
                  <thead>
                    <tr>
                      <th>{language.timeTable && language.timeTable.room}</th>
                      <th>
                        {language.timeTable && language.timeTable.period_start}
                      </th>
                      <th>
                        {language.timeTable && language.timeTable.period_end}
                      </th>
                      <th>
                        {language.timeTable && language.timeTable.subject}
                      </th>
                      {isAdmin && <th></th>}
                    </tr>
                  </thead>
                  <tbody
                    className={`${tableData.length === 0 ? "relative" : ""}`}
                  >
                    {tableData.length > 0
                      ? tableData
                      : !loading && (
                          <div className="table-loading">
                            {language.timeTable && language.timeTable.no_data}
                          </div>
                        )}
                    {loading && (
                      <div className="table-loading">
                        {language.timeTable && language.timeTable.loading}
                      </div>
                    )}
                  </tbody>
                </table>
                {isAdmin && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOverlay(true);
                    }}
                    className="btn green-btn"
                  >
                    {language.timeTable && language.timeTable.add_btn}{" "}
                    <i className="fa-solid fa-plus"></i>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default TimeTable;
