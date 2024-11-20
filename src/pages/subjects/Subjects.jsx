import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import "./subjects.css";
import { Link } from "react-router-dom";
import axios from "axios";
import SendData from "../../components/response/SendData";
import FormLoading from "../../components/FormLoading";
import { Context } from "../../context/Context";
const Subjects = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedId, setSelectedId] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [overlay, setOverlay] = useState(false);
  const [yearLevel, setYearLevel] = useState(false);
  const [loading, setLoading] = useState(true);
  const divsCount = 10;
  const language = context && context.selectedLang;

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
  });

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
  const [form, setForm] = useState({
    name: "",
    code: "",
    yearLevel: "",
  });

  useEffect(() => {
    if (selectedId) {
      axios
        .get(`http://localhost:8000/api/subjects/${selectedId}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setForm({
            name: data.name,
            code: data.code,
            yearLevel: data.yearLevel,
          });
        });
    }
  }, [selectedId]);

  useEffect(() => {
    fetchData();
  }, [activePage, yearLevel]);

  const fetchData = async () => {
    try {
      let url = `http://localhost:8000/api/subjects?limit=${divsCount}&page=${activePage}&active=true`;

      if (yearLevel) {
        url += `&yearLevel=${yearLevel}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setDataLength(res.data.numberOfActiveSubjects);

      const fltr = res.data.data.filter((e) => e.active);
      setSearchData(fltr);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

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

    const selectDiv = document.querySelector(".selecte .inp.active");
    selectDiv && selectDiv.classList.remove("active");
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

          <td>{e.code}</td>
          <td> {e.name} </td>
          <td> {e.yearLevel} </td>
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
                  {language.subject && language.subject.delete}
                </div>
                <Link
                  onClick={() => {
                    setSelectedId(e._id);
                  }}
                  className="flex update"
                >
                  <i className="fa-regular fa-pen-to-square"></i>
                  {language.subject && language.subject.update}
                </Link>
              </div>
            </td>
          )}
        </tr>
      );
    });

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  const [DataError, setDataError] = useState(false);

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: e.target.dataset.level,
    });
    setDataError(false);
  }
  function selectFilterYears(e) {
    setYearLevel(parseInt(e.target.dataset.level));
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
  function createYearLeveFltr() {
    let h2 = [];
    for (let index = 1; index < 13; index++) {
      h2.push(
        <h2 key={index} onClick={selectFilterYears} data-level={index}>
          {index}
        </h2>
      );
    }
    return h2;
  }

  const [formLoading, setFormLoading] = useState(false);
  const [dataOverlay, setDataOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  const responseFun = (complete = false) => {
    setDataOverlay(true);

    complete === true
      ? setResponse(true)
      : complete === "reapeted data"
      ? setResponse(400)
      : setResponse(false);
    window.onclick = () => {
      setDataOverlay(false);
    };
    setTimeout(() => {
      setDataOverlay(false);
    }, 3000);
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.yearLevel)
      setDataError(
        `${language.error && language.error.please_choose_yearLevel}`
      );
    else {
      try {
        if (!selectedId) {
          const data = await axios.post(
            "http://localhost:8000/api/subjects",
            form,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );

          if (data.status === 201) {
            responseFun(true);
          }
        } else {
          await axios.patch(
            `http://localhost:8000/api/subjects/${selectedId}`,
            form,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
        }
        setForm({
          name: "",
          yearLevel: "",
          code: "",
        });
        setSelectedId(false);
        fetchData();
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setFormLoading(false);
      }
    }
  };

  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/subjects/deactivate/${selectedItems[0]}`,
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
        "http://localhost:8000/api/subjects/deactivateMany",
        {
          Ids: selectedItems,
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

  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          {dataOverlay && (
            <SendData
              data={`${language.error && language.error.Subject}`}
              response={response}
            />
          )}
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>{`${
                  language.subject && language.subject.confirm_delete
                } : (${selectedItems.length})`}</h1>
                <div className="flex gap-20">
                  <div
                    onClick={() => {
                      if (selectedItems.length === 1) deleteOne();
                      else deleteAll();
                    }}
                    className="false center"
                  >
                    <h2>{language.subject && language.subject.delete}</h2>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <div
                    onClick={() => {
                      setOverlay(false);
                      if (selectedItems.length === 1) setSelectedItems([]);
                    }}
                    className="none center"
                  >
                    <h2>{language.subject && language.subject.cancel_btn}</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h1 className="title">
            {language.subject && language.subject.all_subjects}
          </h1>
          <div className="flex align-start wrap subjects">
            {isAdmin && (
              <form onSubmit={handelSubmit} className="dashboard-form">
                {formLoading && <FormLoading />}
                <h1> {language.subject && language.subject.add_new_subject}</h1>
                <label htmlFor="name">
                  {" "}
                  {language.subject && language.subject.name}{" "}
                </label>
                <input
                  value={form.name}
                  onInput={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  type="text"
                  id="name"
                  className="inp"
                  placeholder={
                    language.subject && language.subject.name_placeholder
                  }
                />
                <label htmlFor="code">
                  {language.subject && language.subject.code}
                </label>
                <input
                  value={form.code}
                  onInput={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  type="text"
                  id="code"
                  className="inp"
                  placeholder={
                    language.subject && language.subject.code_placeholder
                  }
                />
                <label>
                  {" "}
                  {language.subject && language.subject.year_level}{" "}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.subject &&
                          language.subject.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
                {DataError && <p className="error">{DataError}</p>}
                <button className="btn">
                  {selectedId
                    ? `${language.subject && language.subject.update}`
                    : `${language.subject && language.subject.create_btn}`}
                </button>
              </form>
            )}
            <div className="tabel-container">
              <div className="table">
                <h2> {language.subject && language.subject.all_subjects} </h2>
                <div className="flex search gap-20">
                  <div className="flex flex-direction">
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {yearLevel
                          ? `${
                              language.subject && language.subject.year_level
                            } : ` + yearLevel
                          : `${
                              language.subject && language.subject.year_level
                            }: ${
                              language.subject && language.subject.all_years
                            }`}
                      </div>
                      <article className="grid-3">
                        <h2 data-level={false} onClick={selectFilterYears}>
                          {language.subject && language.subject.all_years}
                        </h2>
                        {createYearLeveFltr()}
                      </article>
                    </div>
                  </div>
                </div>
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
                      <th>{language.subject && language.subject.code}</th>
                      <th>{language.subject && language.subject.name}</th>
                      <th>{language.subject && language.subject.year_level}</th>
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
                            {language.subject && language.subject.no_data}
                          </div>
                        )}
                    {loading && (
                      <div className="table-loading">
                        {language.subject && language.subject.loading}
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
                    {language.subject && language.subject.delete_all_btn} (
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
      </div>
    </main>
  );
};

export default Subjects;
