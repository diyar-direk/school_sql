import { useContext, useEffect, useState } from "react";
import "../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
const AllUsers = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;

  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [dataLength, setDataLength] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const divsCount = 10;
  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);
  const [role, setRole] = useState("");
  const language = context && context.selectedLang;

  window.addEventListener("click", () => {
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      setSelectedItems({});
    }
    const div = document.querySelector(".selecte .inp.active");
    div && div.classList.remove("active");
  });

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
    let URL = `http://localhost:8000/api/users?page=${activePage}&limit=${divsCount}`;
    if (role) URL += `&role=${role}`;
    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setSearchData(data.data.data);
      setDataLength(data.data.numverOfAcriveUsers);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role]);

  const tableData =
    searchData &&
    searchData.map((e) => {
      const date = new Date(e.createdAt);
      return (
        <tr key={e._id}>
          <td>{e.username}</td>

          <td> {e.role} </td>
          <td>
            {`${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`}
          </td>

          <td>
            <div className="flex gap-10 admin">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setOverlay(true);
                  setSelectedItems(e);
                }}
                className="flex delete"
              >
                <i className="fa-solid fa-trash"></i>
              </div>
            </div>
          </td>
        </tr>
      );
    });

  const deleteOne = async () => {
    try {
      const data = await axios.delete(
        `http://localhost:8000/api/users/${selectedItems._id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      data && fetchData();

      setSelectedItems({});
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

  const selcetRoles = (e) => {
    if (role !== e.target.dataset.role) {
      e.target.dataset.role !== "false" && setRole(e.target.dataset.role);
      e.target.dataset.role === "false" && setRole(false);
      setSearchData([]);
      setLoading(true);
    }
  };

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`${language.exams && language.exams.confirm_delete}(${
                selectedItems.username
              })`}</h1>
              <div className="flex gap-20">
                <div onClick={deleteOne} className="false center">
                  <h2>{language.exams && language.exams.delete}</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    setSelectedItems([]);
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
            {language.users && language.users.all_users}
          </h1>
          <div className="tabel-container">
            <div className="table">
              <form className="flex search gap-20">
                <div className="flex flex-direction">
                  <div className="selecte">
                    <div onClick={handleClick} className="inp">
                      {role ? role : "all roles"}
                    </div>
                    <article>
                      <h2 onClick={selcetRoles} data-role={false}>
                        all roles
                      </h2>
                      <h2 onClick={selcetRoles} data-role={"Admin"}>
                        Admin
                      </h2>
                      <h2 onClick={selcetRoles} data-role={"Teacher"}>
                        Teacher
                      </h2>
                      <h2 onClick={selcetRoles} data-role={"Student"}>
                        Student
                      </h2>
                    </article>
                  </div>
                </div>
                <Link className="btn" to={"/dashboard/add_user"}>
                  <i className="fa-regular fa-square-plus"></i>{" "}
                  {language.users && language.users.add_users}
                </Link>
              </form>

              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    <th>{language.users && language.users.name}</th>
                    <th>{language.users && language.users.role}</th>
                    <th>{language.users && language.users.created_at}</th>
                    <th></th>
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

export default AllUsers;
