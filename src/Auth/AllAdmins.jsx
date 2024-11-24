import { useContext, useEffect, useState } from "react";
import "../components/table.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Context } from "../context/Context";
const AllAdmins = () => {
  const context = useContext(Context);
  const token = context && context.userDetails.token;
  const id = context && context.userDetails.userDetails._id;

  const [searchData, setSearchData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  const [loading, setLoading] = useState(true);
  const [overlay, setOverlay] = useState(false);

  const language = context && context.selectedLang;

  window.addEventListener("click", () => {
    const overlayDiv = document.querySelector(".overlay");
    if (overlayDiv) {
      setOverlay(false);
      setSelectedItems({});
    }
  });

  const fetchData = async () => {
    let URL = `http://localhost:8000/api/admins?active=true`;

    try {
      const data = await axios.get(URL, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      setSearchData(data.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableData =
    searchData &&
    searchData.map((e, i) => {
      return (
        <tr key={e._id}>
          <td>
            {e.firstName} {e.lastName} {e._id === id && `(${language.navBar && language.navBar.me} )`}
          </td>

          <td> admin </td>
          <td> {e.email} </td>

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
              <Link
                to={`/dashboard/update_admin/${e._id}`}
                className="flex update"
              >
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>
            </div>
          </td>
        </tr>
      );
    });

  const deleteOne = async () => {
    try {
      const data = await axios.patch(
        `http://localhost:8000/api/admins/deactivate/${selectedItems._id}`,
        [],
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

  return (
    <main>
      <div className="dashboard-container">
        {overlay && (
          <div className="overlay">
            <div className="change-status">
              <h1>{`${language.exams && language.exams.confirm_delete}(${
                selectedItems.firstName + " " + selectedItems.lastName
              })`}</h1>
              <div className="flex gap-20">
                <div onClick={deleteOne} className="false center">
                  <h2>{language.exams && language.exams.delete}</h2>
                  <i className="fa-solid fa-trash"></i>
                </div>
                <div
                  onClick={() => {
                    setOverlay(false);
                    setSelectedItems({});
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
          <h1 className="title">{language.admins && language.admins.all_admins}</h1>
          <div className="tabel-container">
            <div className="table">
              <form className="flex search gap-20">
                <Link className="btn" to={"/dashboard/add_admin"}>
                  <i className="fa-regular fa-square-plus"></i> {language.admins && language.admins.add_admins}
                </Link>
              </form>
              <table className={`${tableData.length === 0 ? "loading" : ""}`}>
                <thead>
                  <tr>
                    <th>{language.admins && language.admins.name}</th>
                    <th>{language.admins && language.admins.role}</th>
                    <th>{language.admins && language.admins.email}</th>
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
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllAdmins;
