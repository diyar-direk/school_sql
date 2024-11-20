import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import Cookies from "universal-cookie";
const Navbar = () => {
  const nav = useNavigate();
  const context = useContext(Context);
  const language = context && context.selectedLang;
  const isAdmin = context && context.userDetails.isAdmin;
  const isStudent = context && context.userDetails.isStudent;
  const isTeacher = context && context.userDetails.isTeacher;
  const id = context && context.userDetails.userDetails._id;
  const ProfilePath = isAdmin
    ? "/dashboard/admin_profile"
    : isTeacher
    ? `/dashboard/teacher_profile/${id}`
    : `/dashboard/student_profile/${id}`;
  const name =
    context &&
    context.userDetails.userDetails.firstName +
      " " +
      context.userDetails.userDetails.lastName;

  const location = useLocation();
  const isClosed = JSON.parse(localStorage.getItem("isClosed")) || false;
  const [form, setForm] = useState("");
  const cookie = new Cookies();

  const logOut = () => {
    cookie.remove("school-token");
    context.setUserDetails({
      isAdmin: false,
      isTeacher: false,
      isStudent: false,
      token: "",
      userDetails: {},
    });
  };

  window.addEventListener("click", () => {
    const langDiv = document.querySelector(
      "nav .setting .lang + div.languages.active-div"
    );
    langDiv && langDiv.classList.remove("active-div");
    const linksDiv = document.querySelector(
      "aside.closed >div> div > .links.active"
    );
    if (linksDiv) {
      linksDiv.classList.remove("active");
      document.querySelector("main").classList.remove("div-open");
    }
    const inpDiv = document.querySelector(
      "form.dashboard-form .selecte .inp.active"
    );
    inpDiv && inpDiv.classList.remove("active");
  });

  const modeFun = () => {
    document.body.classList.toggle("dark");
    context.setMode(document.body.classList.contains("dark"));
  };

  const openDiv = (ele) => {
    ele.stopPropagation();
    const allDivs = document.querySelectorAll(
      "aside >div> div > .links > .center"
    );
    allDivs.forEach((e) => {
      ele.target !== e && e.parentElement.classList.remove("active");
    });
    ele.target.parentElement.classList.toggle("active");
    if (document.querySelector("aside.closed")) {
      const main = document.querySelector("main");
      main && main.classList.toggle("div-open");
    }
  };

  useEffect(() => {
    const linksDiv = document.querySelectorAll("aside .links");
    const removeClass = document.querySelectorAll(
      "aside >div> div > .links > div.center"
    );
    removeClass && removeClass.forEach((e) => e.classList.remove("active"));
    linksDiv &&
      linksDiv.forEach((e) => {
        e.childNodes[1].childNodes.forEach((a) => {
          if (a.classList.contains("active")) {
            e.childNodes[0].classList.add("active");
          }
        });
      });
    const nav = document.querySelector("nav.closed");
    const container = document.querySelector(".dashboard-container");
    nav && container && container.classList.add("closed");
    const activeArticle = document.querySelector(
      "aside >div> div > .links.active"
    );
    activeArticle && activeArticle.classList.remove("active");
  }, [location.pathname]);

  const closeAside = () => {
    const nav = document.querySelector("nav");
    const aside = document.querySelector("aside");
    const container = document.querySelector(".dashboard-container");
    nav && nav.classList.toggle("closed");
    localStorage.setItem("isClosed", nav.classList.contains("closed"));
    aside && aside.classList.toggle("closed");
    container && container.classList.toggle("closed");
  };

  const selectLang = (e) => {
    context.setLanguage(e.target.dataset.lang);
  };

  let pages = [
    { name: language?.navBar?.exam_schedule, path: "exams_schedule" },
    { name: language?.navBar?.exam_results, path: "exams_result" },
    { name: language?.navBar?.attendance, path: "attendence" },
    { name: language?.navBar?.time_table, path: "time_table" },
    { name: language?.navBar?.subjects, path: "subjects" },
    { name: language?.navBar?.classes, path: "classes" },
    { name: language?.navBar?.my_profile, path: ProfilePath },
    { name: language?.navBar?.all_quiz, path: "all_quizzes" },
  ];
  if (!isStudent) {
    pages.push(
      { name: language?.navBar?.all_students, path: "all_students" },
      { name: language?.navBar?.all_teachers, path: "all_teachers" }
    );
  }
  if (isAdmin) {
    pages.push(
      { name: language?.navBar?.all_admins, path: "all_admins" },
      { name: language?.navBar?.all_users, path: "all_users" },
      { name: language?.navBar?.add_users, path: "add_user" },
      { name: language?.navBar?.add_admins, path: "add_admin" },
      { name: language?.navBar?.add_teacher, path: "add_teacher" },
      { name: language?.navBar?.add_student, path: "add_student" },
      { name: language?.navBar?.add_exam, path: "add_exam" },
      { name: language?.navBar?.add_subjects, path: "subjects" },
      { name: language?.navBar?.add_classes, path: "classes" },
      { name: language?.navBar?.add_exam_results, path: "add_exam_result" },
      { name: language?.navBar?.add_quiz, path: "add_quiz" }
    );
  }

  const search = () => {
    let reasult = [];
    if (form.length > 1) {
      pages.forEach((e, i) => {
        if (
          e.name?.toLowerCase().includes(form.toLowerCase()) ||
          e.path.toLowerCase().includes(form.toLowerCase())
        ) {
          reasult.push(
            <Link key={i} onClick={() => setForm("")} to={e.path}>
              {e.name || "Unnamed"}
            </Link>
          );
        }
      });
    }
    if (reasult.length === 0) {
      reasult.push(<p key={1}>{language?.navBar?.no_results}</p>);
    }
    return reasult;
  };

  const searchClick = () => {
    if (form.length > 1) {
      const matchedPage = pages.find(
        (e) =>
          e.name.includes(form.toLowerCase()) ||
          e.path.includes(form.toLowerCase())
      );

      if (matchedPage) {
        nav(matchedPage.path);
      } else {
        const path = form.replaceAll(" ", "_");
        nav(`/dashboard/${path}`);
      }
      setForm("");
    }
  };
  return (
    <>
      <nav className={`${!isClosed === false ? "closed" : ""} center`}>
        <div className="container between gap-20">
          <form className="search flex-1 center relative">
            <input
              value={form}
              type="text"
              required
              onInput={(e) => setForm(e.target.value)}
              className="flex-1"
              placeholder={language.navBar && language.navBar.search}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                searchClick();
              }}
              className="fa-solid fa-magnifying-glass"
            ></button>
            {form.length > 1 && <div className="results">{search()}</div>}
          </form>
          <div className="setting center">
            <Link to={ProfilePath} className="info gap-10 center">
              <i className="center photo fa-solid fa-user"></i>
              <article>
                <h4>{name}</h4>
                <p> {context.userDetails.role} </p>
              </article>
            </Link>

            <i
              onClick={modeFun}
              className="fa-solid fa-moon fa-regular mode"
            ></i>
            <article className="relative">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  document
                    .querySelector("nav .setting .lang + div.languages")
                    .classList.toggle("active-div");
                }}
                className="lang center"
              >
                <i className="fa-solid fa-earth-americas"></i>
                <span className="lang-span"> {context?.language} </span>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
              <div className="languages">
                <h2
                  className={`${context?.language === "AR" ? "active" : ""}`}
                  onClick={selectLang}
                  data-lang="AR"
                >
                  عربي
                </h2>
                <h2
                  onClick={selectLang}
                  className={`${context?.language === "EN" ? "active" : ""}`}
                  data-lang="EN"
                >
                  english
                </h2>
              </div>
            </article>
            <h4 onClick={logOut} className="c-pointer log-out center">
              <i className="fa-solid fa-right-from-bracket"></i>
            </h4>
          </div>
        </div>
      </nav>

      <aside className={`${!isClosed === false ? "closed" : ""}`}>
        <article className="between">
          <Link className="center">
            <i className="fa-solid fa-graduation-cap"></i>
            <h1>school</h1>
          </Link>
          <i onClick={closeAside} className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex between gap-20">
          <div className="flex-direction flex gap-10">
            <NavLink to={ProfilePath} className="w-100 justify-start center">
              <i className="fa-regular fa-circle-user"></i>
              <h1>{language.navBar && language.navBar.my_profile}</h1>
            </NavLink>

            {isAdmin && (
              <div className="links">
                <div onClick={openDiv} className="center">
                  <i className="fa-solid fa-users"></i>
                  <h1 className="flex-1">
                    {language.navBar && language.navBar.users}
                  </h1>
                  <i className="arrow fa-solid fa-chevron-right"></i>
                </div>
                <article>
                  <NavLink to={"all_users"}>
                    {language.navBar && language.navBar.all_users}
                  </NavLink>
                  <NavLink to={"add_user"}>
                    {language.navBar && language.navBar.add_users}
                  </NavLink>
                </article>
              </div>
            )}

            {isAdmin && (
              <div className="links">
                <div onClick={openDiv} className="center">
                  <i className="fa-solid fa-user-group"></i>
                  <h1 className="flex-1">
                    {language.navBar && language.navBar.admins}
                  </h1>
                  <i className="arrow fa-solid fa-chevron-right"></i>
                </div>
                <article>
                  <NavLink to={"all_admins"}>
                    {language.navBar && language.navBar.all_admins}
                  </NavLink>
                  <NavLink to={"add_admin"}>
                    {language.navBar && language.navBar.add_admins}
                  </NavLink>
                </article>
              </div>
            )}

            {!isStudent && (
              <div className="links">
                <div onClick={openDiv} className="center">
                  <i className="fa-solid fa-people-group"></i>
                  <h1 className="flex-1">
                    {language.navBar && language.navBar.teachers}
                  </h1>
                  <i className="arrow fa-solid fa-chevron-right"></i>
                </div>
                <article>
                  <NavLink to={"all_teachers"}>
                    {language.navBar && language.navBar.all_teachers}
                  </NavLink>
                  {isAdmin && (
                    <NavLink to={"add_teacher"}>
                      {language.navBar && language.navBar.add_teacher}
                    </NavLink>
                  )}
                </article>
              </div>
            )}
            {!isStudent && (
              <div className="links">
                <div onClick={openDiv} className="center">
                  <i className="fa-solid fa-children"></i>
                  <h1 className="flex-1">
                    {language.navBar && language.navBar.students}
                  </h1>
                  <i className="arrow fa-solid fa-chevron-right"></i>
                </div>
                <article>
                  <NavLink to={"all_students"}>
                    {language.navBar && language.navBar.all_students}
                  </NavLink>
                  {isAdmin && (
                    <NavLink to={"add_student"}>
                      {language.navBar && language.navBar.add_student}
                    </NavLink>
                  )}
                </article>
              </div>
            )}

            <div className="links">
              <div onClick={openDiv} className="center">
                <i className="fa-solid fa-list-check"></i>
                <h1 className="flex-1">
                  {language.navBar && language.navBar.exam}
                </h1>
                <i className="arrow fa-solid fa-chevron-right"></i>
              </div>
              <article>
                <NavLink to={"exams_schedule"}>
                  {language.navBar && language.navBar.exam_schedule}
                </NavLink>
                {isAdmin && (
                  <NavLink to={"add_exam"}>
                    {language.navBar && language.navBar.add_exam}
                  </NavLink>
                )}
                <NavLink to={"exams_result"}>
                  {language.navBar && language.navBar.exam_results}
                </NavLink>
                {isAdmin && (
                  <NavLink to={"add_exam_result"}>
                    {language.navBar && language.navBar.add_exam_results}
                  </NavLink>
                )}
              </article>
            </div>

            <div className="links">
              <div onClick={openDiv} className="center">
                <i className="fa-regular fa-calendar-days"></i>
                <h1 className="flex-1">
                  {language.navBar && language.navBar.activities}
                </h1>
                <i className="arrow fa-solid fa-chevron-right"></i>
              </div>
              <article>
                {!isStudent && (
                  <NavLink to={"attendence"}>
                    {language.navBar && language.navBar.attendance}
                  </NavLink>
                )}
                <NavLink to={"time_table"}>
                  {language.navBar && language.navBar.time_table}
                </NavLink>
              </article>
            </div>
            <NavLink to={"subjects"} className="w-100 justify-start center">
              <i className="fa-solid fa-pen-nib"></i>
              <h1> {language.navBar && language.navBar.subjects}</h1>
            </NavLink>
            <NavLink to={"classes"} className="w-100 justify-start center">
              <i className="fa-solid fa-school-flag"></i>
              <h1>{language.navBar && language.navBar.classes}</h1>
            </NavLink>

            <div className="links">
              <div onClick={openDiv} className="center">
                <i className="fa-solid fa-pencil"></i>
                <h1 className="flex-1">
                  {language.navBar && language.navBar.quiz}
                </h1>
                <i className="arrow fa-solid fa-chevron-right"></i>
              </div>
              <article>
                <NavLink to={"all_quizzes"}>
                  {language.navBar && language.navBar.all_quiz}
                </NavLink>
                {isAdmin && (
                  <NavLink to={"add_quiz"}>
                    {language.navBar && language.navBar.add_quiz}
                  </NavLink>
                )}
              </article>
            </div>
          </div>
          <h3 onClick={logOut} className="log-out center c-pointer aside">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>{language.navBar && language.navBar.log_out}</span>
          </h3>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
