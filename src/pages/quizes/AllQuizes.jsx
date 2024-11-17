import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
import { date } from "../exams/ExamsSchedule";
const AllQuizes = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [dataLength, setDataLength] = useState(0);
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
    }
    const selectDiv = document.querySelector(".selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
  });

  const fetchData = async () => {
    let URL = `http://localhost:8000/api/quizzes?limit=${divsCount}&page=${activePage}&sort=-date&active=true`;
    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setDataLength(data.data.numberOfQuizzes);
      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activePage]);

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
          <td>{e.title}</td>
          <td> {e.description} </td>
          <td> {e.subjectId.name} </td>
          <td>
            {e.yearLevel} : {e.classId.name}
          </td>

          <td dangerouslySetInnerHTML={date(e.date)} />
          <td> {e.duration} </td>
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
                    setSelectedItems([e._id]);
                  }}
                  className="flex delete"
                >
                  <i className="fa-solid fa-trash"></i>
                  {language.exams && language.exams.delete}
                </div>
                <Link
                  to={`/dashboard/update_quiz/${e._id}`}
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
        `http://localhost:8000/api/quizzes/deactivate/${selectedItems[0]}`,
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
          <h1 className="title">{language.quizzes && language.quizzes.all_quizzes}</h1>
          <div className="tabel-container">
            <div className="table">
              <form className="flex search gap-20">
                {isAdmin && (
                  <Link className="btn" to={"/dashboard/add_quiz"}>
                    <i className="fa-regular fa-square-plus"></i> {language.quizzes && language.quizzes.add_quizzes}
                  </Link>
                )}
              </form>
              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    <th>{language.quizzes && language.quizzes.title}</th>
                    <th>{language.quizzes && language.quizzes.discreption}</th>
                    <th>{language.quizzes && language.quizzes.subject}</th>
                    <th>{language.quizzes && language.quizzes.class}</th>
                    <th>{language.quizzes && language.quizzes.date}</th>
                    <th>{language.quizzes && language.quizzes.duration}</th>
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

export default AllQuizes;
