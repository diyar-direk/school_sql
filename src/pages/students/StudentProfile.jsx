import React, { useContext, useEffect, useState } from "react";
import "../../components/profile.css";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Context } from "../../context/Context";

const StudentProfile = () => {
  const [data, setData] = useState({
    classId: "",
    email: "",
    firstName: "",
    gender: "",
    lastName: "",
    middleName: "",
    phoneNumber: "",
    street: "",
    city: "",
    yearLevel: "",
    dateOfBirth: "",
    yearRepeated: [],
    enrollmentDate: "",
    guardianContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const token = context && context.userDetails.token;
  const isAdmin = context && context.userDetails.isAdmin;
  const [yearRepeated, setYearRepeated] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/students/${id}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        const data = res.data.data;
        const birthDateCount = new Date(data.dateOfBirth);
        const dateOfBirth = `${birthDateCount.getFullYear()}/${birthDateCount.getMonth()}/${birthDateCount.getDay()}`;
        const enrollmentDateCount = new Date(data.enrollmentDate);
        const enrollmentDate = `${enrollmentDateCount.getFullYear()}/${enrollmentDateCount.getMonth()}/${enrollmentDateCount.getDay()}`;

        const updateForm = {
          ...data,
          email: data.contactInfo.email,
          firstName: data.firstName,
          gender: data.gender,
          lastName: data.lastName,
          middleName: data.middleName,
          phoneNumber: data.contactInfo.phone,
          yearLevel: data.yearLevel,
          street: data.address.street,
          city: data.address.city,
          dateOfBirth: dateOfBirth,
          enrollmentDate: enrollmentDate,
          guardianContact: {
            name: data.guardianContact.name,
            phone: data.guardianContact.phone,
            relationship: data.guardianContact.relationship,
          },
          yearRepeated: data.yearRepeated,
        };
        if (data.classId) {
          updateForm.classId = data.classId.name;
        }
        setData(updateForm);
        setYearRepeated(data.yearRepeated);
      });
  }, []);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(
    language.students && language.students.years_repeated
  );
  const handleSave = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/students/increment-year/${id}`,
        { yearRepeated },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      const updatedYearRepeated = response.data.data.yearRepeated;
      setYearRepeated(updatedYearRepeated);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update yearRepeated:", err);
    }
  };

  const handleCancel = () => {
    setYearRepeated(data.yearRepeated);
    setIsEditing(false);
  };

  const handleInputChange = (index, field, value) => {
    setYearRepeated((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, [field]: value } : item
      )
    );
  };
  return (
    <main>
      <div className="dashboard-container">
        <div className="container">
          <h1 className="title"> {data.firstName + " " + data.lastName} </h1>
          <div className="profile">
            <div className="image">
              <i className="photo fa-solid fa-user"></i>
              {isAdmin && (
                <Link
                  to={`/dashboard/update_student/${id}`}
                  className="center gap-10"
                >
                  {language.students && language.students.edit_btn}
                  <i className="fa-regular fa-pen-to-square"></i>
                </Link>
              )}
            </div>
            <div className="info">
              {isAdmin && (
                <h2 className="name">
                  <Link to={`/dashboard/update_student/${id}`}>
                    <i className="fa-regular fa-pen-to-square"></i>
                  </Link>
                </h2>
              )}

              <div className="flex">
                <h2>{language.students && language.students.first_name} :</h2>
                <p> {data.firstName} </p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.middle_name} :</h2>
                <p> {data.middleName} </p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.last_name} :</h2>
                <p> {data.lastName} </p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.email} :</h2>
                <p className="email">{data.email}</p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.phone} :</h2>
                <p>{data.phoneNumber}</p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.gender} :</h2>
                <p> {data.gender} </p>
              </div>

              <div className="flex">
                <h2>
                  {language.students && language.students.date_of_birth} :
                </h2>
                <p> {data.dateOfBirth} </p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.year_level} :</h2>
                <p>{data.yearLevel}</p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.classes} :</h2>
                <p>{data.classId}</p>
              </div>
              <div className="flex">
                <h2>
                  {language.students && language.students.enrollment_date} :
                </h2>
                <p>{data.enrollmentDate}</p>
              </div>

              <div className="flex">
                <h2>{language.students && language.students.city} :</h2>
                <p>{data.city}</p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.street} :</h2>
                <p>{data.street}</p>
              </div>
              <div className="flex">
                <h2>{language.students && language.students.guardian} :</h2>
                <p>
                  {data.guardianContact.relationship} :
                  {data.guardianContact.name} <br />
                  {data.guardianContact.phone}
                </p>
              </div>
              <div className="flex student-reapet">
                {isEditing ? (
                  <>
                    {/* Editable Title */}
                    <h2>{title}:</h2>
                    <div>
                      {/* Editable Year Data */}
                      {yearRepeated?.map((e, index) => (
                        <div className=" collumn" key={index}>
                          <label className="font-color">
                            {language.students?.year || "Year"}:{" "}
                            <span>{e.yearLevel} </span>
                          </label>
                          <label className="font-color">
                            {language.students?.repeated_count ||
                              "Repeated Count"}
                            :{" "}
                            <input
                              type="number"
                              className="student-inp"
                              value={e.yearCount}
                              onChange={(event) =>
                                handleInputChange(
                                  index,
                                  "yearCount",
                                  event.target.value
                                )
                              }
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                    <div className="flex wrap gap-10">
                      {/* Buttons to Save or Cancel */}
                      <button
                        className="student-save stu-btn"
                        onClick={handleSave}
                      >
                        Save
                      </button>
                      <button
                        className="student-cancel stu-btn"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Read Mode */}
                    <h2>{title} :</h2>
                    <p>
                      {yearRepeated?.map((e, index) => (
                        <React.Fragment key={index}>
                          {`${language.students?.year || "Year"} : ${
                            e.yearLevel
                          }; ${
                            language.students?.repeated_count ||
                            "Repeated Count"
                          }: ${e.yearCount}`}
                          <br />
                        </React.Fragment>
                      ))}
                    </p>
                    {isAdmin && (
                      <i
                        className="fa-regular fa-pen-to-square font-color c-pointer"
                        onClick={() => setIsEditing(true)}
                      ></i>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StudentProfile;
