import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import SendData from "../../components/response/SendData";
import FormLoading from "../../components/FormLoading";
import { Context } from "../../context/Context";
const Classes = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [classesCount, setClassesCount] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [yearLevel, setYearLevel] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const divsCount = 10;
  const [overlay, setOverlay] = useState(false);
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

  const fetchData = async () => {
    try {
      let url = `http://localhost:8000/api/classes?limit=${divsCount}&page=${activePage}&active=true`;

      if (yearLevel) {
        url += `&yearLevel=${yearLevel}`;
      }

      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setDataLength(res.data.numberOfActiveClasses);

      const fltr = res.data.data.filter((e) => e.active);
      setSearchData(fltr);
    } catch (error) {
      console.error("Error fetching data", error);
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
    const selecteDiv = document.querySelector(".selecte .inp.active");
    selecteDiv && selecteDiv.classList.remove("active");
  };
  useEffect(() => {
    // Fetch student count for each class
    const fetchClassesCount = async () => {
      const counts = {};
      for (let e of searchData) {
        try {
          const res = await axios.get(
            `http://localhost:8000/api/students/count-students?classId=${e._id}`,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          counts[e._id] = res.data.numberOfDocuments;
        } catch (error) {
          console.error(`Error fetching data for class ${e._id}`, error);
          counts[e._id] = 0; // Default to 0 on error
        }
      }
      setClassesCount(counts);
    };

    fetchClassesCount();
  }, [searchData]);

  const tableData = searchData.map((e, i) => {
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
        <td>{e.yearLevel}</td>
        <td> {e.name} </td>

        <td> {classesCount[e._id] >= 0 ? classesCount[e._id] : "..."} </td>
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
                {language.class && language.class.delete}
              </div>
              <Link
                onClick={() => setSelectedId(e._id)}
                className="flex update"
              >
                <i className="fa-regular fa-pen-to-square"></i>
                {language.class && language.class.update}
              </Link>
            </div>
          </td>
        )}
      </tr>
    );
  });

  const [form, setForm] = useState({
    name: "",
    yearLevel: "",
  });

  useEffect(() => {
    if (selectedId) {
      axios
        .get(`http://localhost:8000/api/classes/${selectedId}`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          const data = res.data.data;
          setForm({
            name: data.name,
            yearLevel: data.yearLevel,
          });
        });
    }
  }, [selectedId]);

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
    if (!form.yearLevel) setDataError("please select a year");
    else {
      try {
        if (!selectedId) {
          const data = await axios.post(
            "http://localhost:8000/api/classes",
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
            `http://localhost:8000/api/classes/${selectedId}`,
            form,
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
        }
        fetchData();
        setForm({
          name: "",
          yearLevel: "",
        });
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
        `http://localhost:8000/api/classes/deactivate/${selectedItems[0]}`,
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
        "http://localhost:8000/api/classes/deactivateMany",
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
        <div className="container ">
          {dataOverlay && <SendData response={response} data="class" />}
          {overlay && (
            <div className="overlay">
              <div className="change-status">
                <h1>{`${language.class && language.class.confirm_delete} : (${
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
                    <h2>{language.class && language.class.delete}</h2>
                    <i className="fa-solid fa-trash"></i>
                  </div>
                  <div
                    onClick={() => {
                      setOverlay(false);
                      if (selectedItems.length === 1) setSelectedItems([]);
                    }}
                    className="none center"
                  >
                    <h2>{language.class && language.class.cancel_btn}</h2>
                    <i className="fa-solid fa-ban"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
          <h1 className="title">
            {language.class && language.class.all_classes}
          </h1>
          <div className="flex align-start wrap subjects">
            {isAdmin && (
              <form onSubmit={handelSubmit} className="dashboard-form ">
                {formLoading && <FormLoading />}
                <h1> {language.class && language.class.add_new_class}</h1>
                <label htmlFor="name">
                  {" "}
                  {language.class && language.class.name}{" "}
                </label>
                <input
                  value={form.name}
                  onInput={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  type="text"
                  id="name"
                  className="inp"
                  placeholder={
                    language.class && language.class.name_placeholder
                  }
                />

                <label> {language.class && language.class.year_level} </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.class &&
                          language.class.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
                {DataError && <p className="error">{DataError}</p>}
                <button className="btn">
                  {selectedId
                    ? `${language.class && language.class.update}`
                    : `${language.class && language.class.create_btn}`}
                </button>
              </form>
            )}
            <div className="tabel-container">
              <div className="table">
                <h2>{language.class && language.class.all_classes}</h2>
                <div className="flex search gap-20">
                  <div className="flex flex-direction">
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {yearLevel
                          ? `${language.class && language.class.year_level}: ` +
                            yearLevel
                          : `${
                              language.class && language.class.year_level
                            } : ${language.class && language.class.all_years}`}
                      </div>
                      <article className="grid-3">
                        <h2 data-level={false} onClick={selectFilterYears}>
                          {language.class && language.class.all_years}
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
                      <th>{language.class && language.class.year_level}</th>
                      <th>{language.class && language.class.name}</th>
                      <th>{language.class && language.class.student_count}</th>
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
                            {language.class && language.class.no_data}
                          </div>
                        )}
                    {loading && (
                      <div className="table-loading">
                        {language.class && language.class.loading}
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
                    {language.class && language.class.delete_all_btn} (
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

export default Classes;
