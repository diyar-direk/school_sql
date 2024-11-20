import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
const ExamSchedule = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;

  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [yearLevel, setYearLevel] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const divsCount = 10;
  const language = context && context.selectedLang;
  const createPags = (dataCount, dataLength) => {
    const pages = Math.ceil(dataLength / dataCount);
    let h3Pages = [];

    for (let i = 0; i < pages; i++) {
      h3Pages.push(
        <h3
          onClick={updateData}
          data-page={i + 1}
          key={i}
          className={`${i === 0 ? "active" : ""}`}
        >
          {i + 1}
        </h3>
      );
    }

    return h3Pages;
  };

  function updateData(e) {
    if (activePage !== +e.target.dataset.page) {
      setSearchData([]);
      setSelectedItems([]);
      setLoading(true);
      const check = document.querySelector("th .checkbox.active");
      check && check.classList.remove("active");
      const pages = document.querySelectorAll("div.table .pagination h3");
      pages.forEach((e) => e.classList.remove("active"));
      e.target.classList.add("active");
      setActivePage(+e.target.dataset.page);
    }
  }

  window.addEventListener("click", () => {
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      if (selectedItems.length <= 1) {
        setSelectedItems([]);
      }
      const allSelectors = document.querySelectorAll("td .checkbox");
      allSelectors.forEach((e) => e.classList.remove("active"));
    }
    const selectDiv = document.querySelector(".selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  const fetchData = async () => {
    let URL = `http://localhost:8000/api/exams?limit=${divsCount}&page=${activePage}&sort=-date&active=true`;
    if (yearLevel) URL += `&yearLevel=${yearLevel}`;
    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setDataLength(data.data.numberOfActiveExams);
      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activePage, yearLevel]);

  const openOptions = (e) => {
    e.stopPropagation();
    const div = document.querySelectorAll("div.table tbody td div.options");
    div.forEach((ele, i) => {
      if (+e.target.dataset.index !== i) {
        ele.classList.remove("active-div");
      }
    });
    div[e.target.dataset.index].classList.toggle("active-div");
  };
  const checkOne = (e, element) => {
    e.target.classList.toggle("active");
    if (e.target.classList.contains("active")) {
      setSelectedItems((prevSelected) => [...prevSelected, element]);
      const allActiveSelectors = document.querySelectorAll(
        "td .checkbox.active"
      );
      const allSelectors = document.querySelectorAll("td .checkbox");
      if (allSelectors.length === allActiveSelectors.length)
        document.querySelector("th .checkbox").classList.add("active");
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((item) => item !== element)
      );
      document.querySelector("th .checkbox").classList.remove("active");
    }
  };

  const checkAll = (e) => {
    const allActiveSelectors = document.querySelectorAll("td .checkbox.active");
    const allSelectors = document.querySelectorAll("td .checkbox");
    setSelectedItems([]);

    if (
      allActiveSelectors.length >= 0 &&
      allActiveSelectors.length !== allSelectors.length
    ) {
      allSelectors.forEach((e) => e.classList.add("active"));
      e.target.classList.add("active");
      searchData.forEach((e) => {
        setSelectedItems((prev) => [...prev, e._id]);
      });
    } else {
      allSelectors.forEach((e) => e.classList.remove("active"));
      e.target.classList.remove("active");
      setSelectedItems([]);
    }
  };
  window.onclick = () => {
    const activeDiv = document.querySelector(
      "div.table tbody td div.options.active-div"
    );

    activeDiv && activeDiv.classList.remove("active-div");
  };

  const tableData =
    searchData &&
    searchData.map((e, i) => {
      return (
        <tr key={e._id}>
          {isAdmin && (
            <td>
              <div
                onClick={(target) => checkOne(target, e._id)}
                className="checkbox"
              ></div>
            </td>
          )}

          <td>
            {e.subjectId && e.subjectId.active ? e.subjectId.name : "deleted"}
          </td>
          <td> {e.yearLevel} </td>
          <td dangerouslySetInnerHTML={date(e.date)} />

          <td> {e.classId.name} </td>
          <td>{e.duration}</td>
          <td>{e.totalMarks}</td>
          {isAdmin && (
            <td>
              <i
                onClick={openOptions}
                className="options fa-solid fa-ellipsis"
                data-index={i}
              ></i>
              <div className="options">
                <div
                  onClick={(event) => {
                    event.stopPropagation();
                    setOverlay(true);
                    const allSelectors =
                      document.querySelectorAll("td .checkbox");
                    allSelectors.forEach((e) => e.classList.remove("active"));
                    setSelectedItems([e._id]);
                  }}
                  className="flex delete"
                >
                  <i className="fa-solid fa-trash"></i>{" "}
                  {language.exams && language.exams.delete}
                </div>
                <Link
                  to={`/dashboard/update_exam/${e._id}`}
                  className="flex update"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                  {language.exams && language.exams.update}
                </Link>
              </div>
            </td>
          )}
        </tr>
      );
    });

  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/exams/deactivate/${selectedItems[0]}`,
        [],
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      data && fetchData();

      setSelectedItems([]);
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };
  const deleteAll = async () => {
    try {
      const data = await axios.patch(
        "http://localhost:8000/api/exams/deactivate-many",
        {
          ids: selectedItems,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      data && fetchData();

      selectedItems.length = 0;
    } catch (error) {
      console.log(error);
    } finally {
      setOverlay(false);
    }
  };
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const selectYears = (e) => {
    setYearLevel(parseInt(e.target.dataset.level));
  };
  function createYearLeve() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 onClick={selectYears} key={index} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`${language.exams && language.exams.confirm_delete}(${
                selectedItems.length
              })`}</h1>
              <div className="flex gap-20">
                <div
                  onClick={() => {
                    if (selectedItems.length === 1) deleteOne();
                    else deleteAll();
                  }}
                  className="false center"
                >
                  <h2>{language.exams && language.exams.delete}</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    if (selectedItems.length === 1) setSelectedItems([]);
                  }}
                  className="none center"
                >
                  <h2>{language.exams && language.exams.cancel_btn}</h2>
                  <i className="fa-solid fa-ban"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="container">
          <h1 className="title">
            {language.exams && language.exams.exam_schedule}
          </h1>
          <div className="tabel-container">
            <div className="table">
              <form className="flex search gap-20">
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {yearLevel
                        ? `${language.exams && language.exams.year_level} : ` +
                          yearLevel
                        : `${language.exams && language.exams.year_level}: ${
                            language.exams && language.exams.all_years
                          }`}
                    </div>
                    <article className="grid-3">
                      <h2 data-level={false} onClick={selectYears}>
                        {language.exams && language.exams.all_years}
                      </h2>
                      {createYearLeve()}
                    </article>
                  </div>
                </div>

                {isAdmin && (
                  <Link className="btn" to={"/dashboard/add_exam"}>
                    <i className="fa-regular fa-square-plus"></i>{" "}
                    {language.exams && language.exams.add_exam}
                  </Link>
                )}
              </form>
              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    {isAdmin && (
                      <th>
                        <div
                          onClick={checkAll}
                          className="checkbox select-all"
                        ></div>
                      </th>
                    )}
                    <th>{language.exams && language.exams.subject}</th>
                    <th>{language.exams && language.exams.year_level}</th>
                    <th>{language.exams && language.exams.date}</th>
                    <th>{language.exams && language.exams.room}</th>
                    <th>{language.exams && language.exams.duration}</th>
                    <th>{language.exams && language.exams.mark}</th>
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
                          {language.exams && language.exams.no_data}
                        </div>
                      )}
                  {loading && (
                    <div className="table-loading">
                      {language.exams && language.exams.loading}
                    </div>
                  )}
                </tbody>
              </table>
              {isAdmin && selectedItems.length > 1 && (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setOverlay(true);
                  }}
                  className="delete-all"
                >
                  <i className="fa-solid fa-trash"></i>
                  {language.exams && language.exams.delete_all_btn} (
                  {selectedItems.length})
                </div>
              )}
              <div className="pagination flex">
                {createPags(divsCount, dataLength)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ExamSchedule;

export const date = (time) => {
  const fullTime = new Date(time);
  const month = fullTime.getMonth() + 1;
  const day = fullTime.getDate();
  const hours = String(fullTime.getHours()).padStart(2, "0");
  const minutes = String(fullTime.getMinutes()).padStart(2, "0");
  const style = `${month} / ${day}<br>${hours}:${minutes}`;
  return { __html: style }; // العودة بـ HTML
};
