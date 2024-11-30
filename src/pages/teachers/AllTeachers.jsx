import { useContext, useEffect, useState } from "react";
import "../../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";
const AllTeachers = () => {
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;
  const id = context && context.userDetails.userDetails._id;
  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [overlay, setOverlay] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState(false);
  const [yearLevel, setYearLevel] = useState(false);
  const [search, setSearch] = useState(false);
  const [form, setForm] = useState("");

  const divsCount = 10;
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

  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/teachers/deactivate/${selectedItems[0]}`,
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

  const getSearchData = async () => {
    let URL = `http://localhost:8000/api/teachers/search/${form}?page=${activePage}&limit=${divsCount}&active=true`;
    if (yearLevel) URL += `&yearLevel=${yearLevel}`;
    if (gender) URL += `&gender=${gender}`;
    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setDataLength(data.data.totalResults);
      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    let URL = `http://localhost:8000/api/teachers?limit=${divsCount}&page=${activePage}&active=true`;
    if (yearLevel) URL += `&yearLevel=${yearLevel}`;
    if (gender) URL += `&gender=${gender}`;

    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setDataLength(data.data.numberOfActiveTeachers);
      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (search) getSearchData();
    else fetchData();
  }, [activePage, yearLevel, gender, search]);

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

  const tableData = searchData?.map((e, i) => {
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
          <Link className="name" to={`/dashboard/teacher_profile/${e._id}`}>
            {`${e.firstName} ${e.lastName}`}{" "}
            {id === e._id && `( ${language.navBar && language.navBar.me} )`}
          </Link>
        </td>
        <td> {e.gender} </td>
        <td>
          {e.classes.map((el) => {
            return `${el.yearLevel}:${el.name},`;
          })}
        </td>
        <td>
          {e.subjects.map((el) => {
            return `${el.name},`;
          })}
        </td>
        <td> {e.phoneNumber} </td>
        <td>
          <i
            onClick={openOptions}
            className="options fa-solid fa-ellipsis"
            data-index={i}
          ></i>
          <div
            className={`options has-visit ${!isAdmin ? "teacher-visit" : ""}`}
          >
            {isAdmin && (
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
                <i className="fa-solid fa-trash"></i>
                {language.teachers && language.teachers.delete}
              </div>
            )}
            {isAdmin && (
              <Link
                to={`/dashboard/update_teacher/${e._id}`}
                className="flex update"
              >
                <i className="fa-regular fa-pen-to-square"></i>
                {language.teachers && language.teachers.update}
              </Link>
            )}
            <Link
              to={`/dashboard/teacher_profile/${e._id}`}
              className={`flex visit`}
            >
              <i className="fa-solid fa-circle-user"></i>
              {language.teachers && language.teachers.visit}
            </Link>
          </div>
        </td>
      </tr>
    );
  });

  const deleteAll = async () => {
    try {
      const data = await axios.patch(
        "http://localhost:8000/api/teachers/deleteTeachers",
        {
          teacherIds: selectedItems,
        },
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
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const selectYears = (e) => {
    setYearLevel(parseInt(e.target.dataset.level));
  };
  const selectGender = (e) => {
    if (e.target.dataset.gender !== "0") setGender(e.target.dataset.gender);
    else setGender(false);
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

  const handelSubmit = (e) => {
    e.preventDefault();
    setSearch(true);
    getSearchData();
  };

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`${language.teachers && language.teachers.confirm_delete}(${
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
                  <h2>{language.teachers && language.teachers.delete}</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    if (selectedItems.length === 1) setSelectedItems([]);
                  }}
                  className="none center"
                >
                  <h2>{language.teachers && language.teachers.cancel_btn}</h2>
                  <i className="fa-solid fa-ban"></i>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="container">
          <h1 className="title">
            {language.teachers && language.teachers.all_teachers}
          </h1>
          <div className="tabel-container">
            <div className="table">
              <form
                onSubmit={handelSubmit}
                className="flex has-search search gap-20"
              >
                <input
                  onInput={(e) => {
                    setForm(e.target.value);
                    if (!e.target.value) setSearch(false);
                  }}
                  value={form}
                  required
                  type="text"
                  placeholder={
                    language.teachers && language.teachers.search_by_name
                  }
                />
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {yearLevel
                        ? "yearl level: " + yearLevel
                        : `${
                            language.teachers && language.teachers.year_level
                          }: ${
                            language.teachers && language.teachers.all_years
                          }`}
                    </div>

                    <article className="grid-3">
                      <h2 data-level={false} onClick={selectYears}>
                        {language.teachers && language.teachers.all_years}
                      </h2>
                      {createYearLeve()}
                    </article>
                  </div>
                </div>
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {gender
                        ? `${language.teachers && language.teachers.gender}: ` +
                          gender
                        : `${language.teachers && language.teachers.gender}: ${
                            language.teachers && language.teachers.both_genders
                          }`}
                    </div>
                    <article>
                      <h2 onClick={selectGender} data-gender={0}>
                        {language.teachers && language.teachers.both_genders}
                      </h2>
                      <h2 onClick={selectGender} data-gender="Male">
                        {language.teachers && language.teachers.male}
                      </h2>
                      <h2 onClick={selectGender} data-gender="Female">
                        {language.teachers && language.teachers.female}
                      </h2>
                    </article>
                  </div>
                </div>

                <button className="btn fa-solid fa-magnifying-glass"></button>
                {isAdmin && (
                  <Link className="btn" to={"/dashboard/add_teacher"}>
                    <i className="fa-regular fa-square-plus"></i>
                    {language.teachers && language.teachers.add_teachers}
                  </Link>
                )}
              </form>

              <table
                className={`${
                  tableData.length === 0 ? "loading" : ""
                } has-search`}
              >
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
                    <th>{language.teachers && language.teachers.name}</th>
                    <th> {language.teachers && language.teachers.gender}</th>
                    <th>{language.teachers && language.teachers.class}</th>
                    <th>{language.teachers && language.teachers.subject}</th>
                    <th>
                      {language.teachers && language.teachers.phone_number}
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody
                  className={`${tableData?.length === 0 ? "relative" : ""}`}
                >
                  {tableData?.length > 0
                    ? tableData
                    : !loading && (
                        <div className="table-loading">
                          {language.teachers && language.teachers.no_data}
                        </div>
                      )}
                  {loading && (
                    <div className="table-loading">
                      {language.teachers && language.teachers.loading}
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
                  {language.teachers && language.teachers.delete_all_btn}(
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

export default AllTeachers;
