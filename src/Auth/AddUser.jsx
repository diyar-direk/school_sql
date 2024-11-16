import React, { useContext, useEffect, useState } from "react";
import "../components/form.css";
import "../components/table.css";
import axios from "axios";
import { Context } from "../context/Context";
import SendData from "../components/response/SendData";
import FormLoading from "../components/FormLoading";

const AddUser = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "",
    profileId: "",
  });
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const language = context && context.selectedLang;
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [searchData, setSearchData] = useState([]);
  const [gender, setGender] = useState(false);
  const [yearLevel, setYearLevel] = useState(false);
  const divsCount = 10;
  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

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

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (form.username.includes(" ")) setDataError("username cant have spaces");
    else if (passwordConfirmation !== form.password)
      setDataError("the password most be same");
    else if (!form.role) setDataError("please choose a role");
    else if (!form.profileId) setDataError("please choose a user");
    else {
      try {
        setFormLoading(true);

        const data = await axios.post("http://localhost:8000/api/users", form, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (data.status === 201) {
          responseFun(true);
          setForm({
            username: "",
            password: "",
            role: "",
            profileId: "",
          });
          setPasswordConfirmation("");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setFormLoading(false);
      }
    }
  };

  function updateData(e) {
    if (activePage !== +e.target.dataset.page) {
      setSearchData([]);
      setLoading(true);
      const pages = document.querySelectorAll("div.table .pagination h3");
      pages.forEach((e) => e.classList.remove("active"));
      e.target.classList.add("active");
      setActivePage(+e.target.dataset.page);
    }
  }

  const fetchData = async () => {
    setSearchData([]);
    setForm({ ...form, profileId: "" });
    setLoading(true);
    const role = form.role.toLowerCase() + "s";
    try {
      let url = `http://localhost:8000/api/${role}?limit=${divsCount}&page=${activePage}&active=true`;
      if (form.role !== "Admin" && gender) url += `&gender=${gender}`;
      if (form.role !== "Admin" && yearLevel) url += `&yearLevel=${yearLevel}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (form.role === "Admin") setDataLength(res.data.numberOfAdmins);
      else if (form.role === "Teacher")
        setDataLength(res.data.numberOfActiveTeachers);
      else setDataLength(res.data.numberOfActiveStudents);

      setSearchData(res.data.data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    form.role && fetchData();
  }, [form.role, activePage, gender, yearLevel]);

  const selectUser = (e, id) => {
    const allTr = document.querySelectorAll("tr.select-user.active");
    allTr.forEach((ele) => ele.classList.remove("active"));
    e.target.parentNode.classList.add("active");
    setForm({ ...form, profileId: id });
    setDataError(false);
  };

  const tableData = searchData?.map((e) => {
    return (
      <tr
        onClick={(target) => selectUser(target, e._id)}
        className="select-user"
        key={e._id}
      >
        <td>
          <div className="radio active"></div>
        </td>
        <td>
          {e.firstName} {e.middleName && e.middleName} {e.lastName}
        </td>
        {form.role !== "Admin" && <td> {e.gender} </td>}
        {form.role === "Student" && <td> {e.yearLevel} </td>}
        {form.role === "Teacher" && (
          <td>
            {Array.isArray(e.yearLevel) ? e.yearLevel.join(" , ") : e.yearLevel}
          </td>
        )}

        <td> {form.role === "Student" ? e.contactInfo?.email : e.email} </td>
        <td> {form.role} </td>
      </tr>
    );
  });

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

  return (
    <main>
      <div className="dashboard-container">
        <div className="container relative">
          {overlay && <SendData data="user" response={response} />}
          <h1 className="title">add user</h1>

          <form
            onSubmit={handelSubmit}
            className="relative user dashboard-form"
          >
            {formLoading && <FormLoading />}
            <h1>{language.exams && language.exams.please_complete_form}</h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="username">user name</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.username}
                  type="text"
                  id="username"
                  className="inp"
                  placeholder="please enter user name"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="password">password</label>
                <input
                  required
                  onInput={handleForm}
                  value={form.password}
                  type="password"
                  id="password"
                  className="inp"
                  placeholder="please enter password"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="confPassword">conf password</label>
                <input
                  required
                  onInput={(e) => setPasswordConfirmation(e.target.value)}
                  type="password"
                  value={passwordConfirmation}
                  id="confPassword"
                  className="inp"
                  placeholder="conf your pass"
                />
              </div>

              <div className="flex flex-direction">
                <label>role</label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.role ? form.role : `chose a role`}
                  </div>
                  <article>
                    <h2
                      data-role="Admin"
                      onClick={(e) => {
                        setDataError(false);
                        setForm({ ...form, role: e.target.dataset.role });
                      }}
                    >
                      Admin
                    </h2>
                    <h2
                      data-role="Teacher"
                      onClick={(e) => {
                        setDataError(false);
                        setForm({ ...form, role: e.target.dataset.role });
                      }}
                    >
                      teacher
                    </h2>
                    <h2
                      data-role="Student"
                      onClick={(e) => {
                        setDataError(false);
                        setForm({ ...form, role: e.target.dataset.role });
                      }}
                    >
                      student
                    </h2>
                  </article>
                </div>
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">create</button>
          </form>

          {form.role && (
            <div className="tabel-container">
              <div className="table">
                <h2>please select a user to creat</h2>
                {form.role !== "Admin" && (
                  <form className="flex search gap-20">
                    <div className="flex flex-direction">
                      <div className="selecte">
                        <div onClick={handleClick} className="inp">
                          {yearLevel
                            ? "yearl level: " + yearLevel
                            : `${
                                language.teachers &&
                                language.teachers.year_level
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
                            ? `${
                                language.teachers && language.teachers.gender
                              }: ` + gender
                            : `${
                                language.teachers && language.teachers.gender
                              }: ${
                                language.teachers &&
                                language.teachers.both_genders
                              }`}
                        </div>
                        <article>
                          <h2 onClick={selectGender} data-gender={0}>
                            {language.teachers &&
                              language.teachers.both_genders}
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
                  </form>
                )}

                <table
                  className={`${tableData?.length === 0 ? "loading" : ""}`}
                >
                  <thead>
                    <tr>
                      <td></td>
                      <th>{language.teachers && language.teachers.name}</th>
                      {form.role !== "Admin" && (
                        <th>{language.teachers && language.teachers.gender}</th>
                      )}
                      {form.role !== "Admin" && <th>year level</th>}
                      <th>email</th>
                      <th>role</th>
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
                <div className="pagination flex">
                  {createPags(divsCount, dataLength)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddUser;
