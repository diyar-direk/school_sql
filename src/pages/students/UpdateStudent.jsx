import { useContext, useEffect, useRef, useState } from "react";
import "../../components/form.css";
import FormLoading from "../../components/FormLoading";
import SendData from "../../components/response/SendData";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import axiosInstance from "../../utils/axios";

const UpdateStudent = () => {
  const { id } = useParams();
  const context = useContext(Context);
  const nav = useNavigate();
  const language = context?.selectedLang;
  const [form, setForm] = useState({
    contactInfo: { email: "", phone: "" },
    address: {
      street: "",
      city: "",
    },
    guardianContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    firstName: "",
    middleName: "",
    lastName: "",
    gender: "",
    yearLevel: "",
    dateOfBirth: "",
    enrollmentDate: "",
    classId: "",
  });

  const [loading, setLoading] = useState(false);
  const [DataError, setDataError] = useState(false);
  const [classes, setClasses] = useState([]);
  const [classesName, setClassesName] = useState(false);
  const oldYear = useRef(null);
  const [overlay, setOverlay] = useState(false);
  const [response, setResponse] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`students/${id}`)
      .then((res) => {
        const data = res.data.data;

        const dateOfBirth = new Date(data.dateOfBirth)
          .toISOString()
          .slice(0, 16);
        const enrollmentDate = new Date(data.enrollmentDate)
          .toISOString()
          .slice(0, 16);

        const updatedForm = {
          ...form,
          contactInfo: {
            email: data.contactInfo.email,
            phone: data.contactInfo.phone,
          },
          address: {
            street: data.address.street,
            city: data.address.city,
          },
          guardianContact: {
            name: data.guardianContact.name,
            phone: data.guardianContact.phone,
            relationship: data.guardianContact.relationship,
          },
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          gender: data.gender,
          yearLevel: data.yearLevel,
          dateOfBirth: dateOfBirth,
          enrollmentDate: enrollmentDate,
        };
        oldYear.current = data.yearLevel;

        if (data.classId) {
          setClassesName(data.classId.name);
          updatedForm.classId = data.classId._id;
        }

        setForm(updatedForm);
      })
      .catch((err) => {
        console.log(err);
        nav("/err-400");
      });
  }, []);

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
    const { id, value } = e.target;

    if (id.includes(".")) {
      const [parentKey, childKey] = id.split(".");
      setForm((prevForm) => ({
        ...prevForm,
        [parentKey]: {
          ...prevForm[parentKey],
          [childKey]: value,
        },
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };

  function selectMale(e) {
    setForm({ ...form, gender: e.target.dataset.gender });
    setDataError(false);
  }

  function selectYears(e) {
    setForm({
      ...form,
      yearLevel: e.target.dataset.level,
    });
    setDataError(false);
  }

  function selectClasses(e, id) {
    setForm({
      ...form,
      classId: id,
    });
    setClassesName(e.target.dataset.classes);
    setDataError(false);
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

  useEffect(() => {
    if (oldYear.current !== form.yearLevel) {
      setClassesName("");
      setForm({ ...form, classId: "" });
    }

    form.yearLevel &&
      axiosInstance
        .get(`classes?yearLevel=${form.yearLevel}&active=true`)
        .then((res) => {
          setClasses(res.data.data);
        });
  }, [form.yearLevel]);

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!form.gender)
      setDataError(`${language.error && language.error.please_choose_gender}`);
    else if (!form.yearLevel)
      setDataError(
        `${language.error && language.error.please_choose_yearLevel}`
      );
    else if (!form.classId)
      setDataError(`${language.error && language.error.please_choose_class}`);
    else {
      try {
        const data = await axiosInstance.patch(`students/${id}`, form);
        setForm({
          contactInfo: { email: "", phone: "" },
          address: {
            street: "",
            city: "",
          },
          guardianContact: {
            name: "",
            phone: "",
            relationship: "",
          },
          firstName: "",
          middleName: "",
          lastName: "",
          gender: "",
          yearLevel: "",
          dateOfBirth: "",
          enrollmentDate: "",
          classId: "",
        });
        if (data.status === 200) {
          responseFun(true);
          nav("/all_students");
        }
      } catch (error) {
        console.log(error);
        if (error.status === 400) responseFun("reapeted data");
        else responseFun(false);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <div
        className={`${context?.isClosed ? "closed" : ""}  dashboard-container`}
      >
        <div className="container relative">
          {overlay && (
            <SendData
              data={`${language.error && language.error.student}`}
              response={response}
            />
          )}
          <h1 className="title">
            {" "}
            {language.students && language.students.update_student}{" "}
          </h1>
          <form onSubmit={handelSubmit} className=" relative dashboard-form">
            {loading && <FormLoading />}
            <h1>
              {language.students && language.students.please_complete_form}{" "}
            </h1>
            <div className="flex wrap ">
              <div className="flex flex-direction">
                <label htmlFor="firstName">
                  {language.students && language.students.first_name}{" "}
                </label>
                <input
                  onInput={handleForm}
                  value={form.firstName}
                  type="text"
                  id="firstName"
                  className="inp"
                  required
                  placeholder={
                    language.students &&
                    language.students.first_name_placeholder
                  }
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="middleName">
                  {language.students && language.students.middle_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.middleName}
                  type="text"
                  id="middleName"
                  className="inp"
                  placeholder={
                    language.students &&
                    language.students.middle_name_placeholder
                  }
                />
              </div>
              <div className="flex flex-direction">
                <label htmlFor="lastName">
                  {language.students && language.students.last_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.lastName}
                  type="text"
                  id="lastName"
                  placeholder={
                    language.students && language.students.last_name_placeholder
                  }
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label>
                  {language.students && language.students.gender_input}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.gender
                      ? form.gender
                      : `${
                          language.students &&
                          language.students.gender_placeholder
                        }`}
                  </div>
                  <article>
                    <h2 onClick={selectMale} data-gender="Male">
                      {language.students && language.students.male}
                    </h2>
                    <h2 onClick={selectMale} data-gender="Female">
                      {language.students && language.students.female}
                    </h2>
                  </article>
                </div>
              </div>

              <div className="flex flex-direction">
                <label htmlFor="contactInfo.email">
                  {language.students && language.students.email}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.contactInfo.email}
                  type="email"
                  id="contactInfo.email"
                  placeholder={
                    language.students && language.students.email_placeholder
                  }
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="contactInfo.phone">
                  {language.students && language.students.phone_number_input}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.contactInfo.phone}
                  type="text"
                  id="contactInfo.phone"
                  className="inp"
                  placeholder={
                    language.students &&
                    language.students.phone_number_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="dateOfBirth">
                  {language.students && language.students.date_of_birth}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.dateOfBirth.slice(0, 10)}
                  type="date"
                  id="dateOfBirth"
                  className="inp"
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="address.city">
                  {language.students && language.students.city}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.address.city}
                  type="text"
                  id="address.city"
                  className="inp"
                  placeholder={
                    language.students && language.students.city_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="address.street">
                  {language.students && language.students.street}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.address.street}
                  type="text"
                  id="address.street"
                  className="inp"
                  placeholder={
                    language.students && language.students.street_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.name">
                  {language.students && language.students.guardian_name}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.name}
                  type="text"
                  id="guardianContact.name"
                  className="inp"
                  placeholder={
                    language.students &&
                    language.students.guardian_name_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.relationship">
                  {language.students && language.students.relationship}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.relationship}
                  type="text"
                  id="guardianContact.relationship"
                  className="inp"
                  placeholder={
                    language.students &&
                    language.students.relationship_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label htmlFor="guardianContact.phone">
                  {language.students && language.students.guardian_phone_input}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.guardianContact.phone}
                  type="text"
                  id="guardianContact.phone"
                  className="inp"
                  placeholder={
                    language.students &&
                    language.students.guardian_phone_placeholder
                  }
                />
              </div>

              <div className="flex flex-direction">
                <label>
                  {language.students && language.students.year_level}
                </label>
                <div className="selecte">
                  <div onClick={handleClick} className="inp">
                    {form.yearLevel
                      ? form.yearLevel
                      : `${
                          language.students &&
                          language.students.year_level_placeholder
                        }`}
                  </div>
                  <article className="grid-3">{createYearLeve()}</article>
                </div>
              </div>
              {form.yearLevel && (
                <>
                  <div className="flex flex-direction">
                    <label>
                      {language.students && language.students.classes}
                    </label>
                    <div className="selecte">
                      <div onClick={handleClick} className="inp">
                        {classesName
                          ? classesName
                          : `${
                              language.students &&
                              language.students.classes_placeholder
                            }`}
                      </div>
                      <article>
                        {classes.map((e, i) => {
                          return (
                            <h2
                              onClick={(event) => selectClasses(event, e._id)}
                              data-classes={`${e.yearLevel} : ${e.name}`}
                              key={i}
                            >
                              {`${e.yearLevel} : ${e.name}`}
                            </h2>
                          );
                        })}
                      </article>
                    </div>
                  </div>
                </>
              )}
              <div className="flex flex-direction">
                <label htmlFor="enrollmentDate">
                  {language.students && language.students.enrollment_date}
                </label>
                <input
                  required
                  onInput={handleForm}
                  value={form.enrollmentDate.slice(0, 10)}
                  type="date"
                  id="enrollmentDate"
                  className="inp"
                />
              </div>
            </div>
            {DataError && <p className="error">{DataError}</p>}
            <button className="btn">
              {language.students && language.students.save_btn}{" "}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default UpdateStudent;
