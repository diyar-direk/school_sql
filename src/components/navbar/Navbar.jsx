import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "./navbar.css";
import { useContext, useEffect, useState } from "react";
import { Context } from "../../context/Context";
import { useAuth } from "../../context/AuthContext";
import useDarkMode from "../../hooks/useDarkMode";
import navbarLinks from "./navbarLinks";
import { pagesRoute } from "../../constants/pagesRoute";

const Navbar = () => {
  const nav = useNavigate();
  const context = useContext(Context);
  const language = context?.selectedLang;
  const { userDetails, logout } = useAuth();
  const name =
    userDetails?.profileId?.firstName + " " + userDetails?.profileId?.lastName;
  const { isAdmin, isTeacher } = userDetails || {};

  const myProfilePath = isAdmin
    ? pagesRoute.admin.view(userDetails?.profileId?._id)
    : isTeacher
    ? pagesRoute.teacher.view(userDetails?.profileId?._id)
    : pagesRoute.student.view(userDetails?.profileId?._id);

  const location = useLocation();

  const [form, setForm] = useState("");

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

  const { changeMode } = useDarkMode();

  useEffect(() => {
    if (window.innerWidth <= 600) {
      localStorage.setItem("isClosed", true);
      context?.setIsClosed(true);
    }
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
    nav && nav.classList.toggle("closed");
    localStorage.setItem("isClosed", nav.classList.contains("closed"));
    context?.setIsClosed(nav.classList.contains("closed"));
  };

  const selectLang = (e) => {
    context.setLanguage(e.target.dataset.lang);
  };

  const flattenNavbarLinks = (links, role, language) => {
    const result = [];

    const walk = (items) => {
      items.forEach((item) => {
        const canShow = item.showIf.includes(role);
        if (!canShow) return;

        if (item.type === "multi" && item.children) {
          walk(item.children);
        } else {
          result.push({
            name: item.title(language.navBar),
            path:
              typeof item.to === "function" ? item.to(myProfilePath) : item.to,
          });
        }
      });
    };

    walk(links);
    return result;
  };

  const pages = flattenNavbarLinks(navbarLinks, userDetails?.role, language);

  const search = () => {
    let result = [];
    if (form.length > 1) {
      pages.forEach((e, i) => {
        if (
          e.name?.toLowerCase().includes(form.toLowerCase()) ||
          e.path?.toLowerCase().includes(form.toLowerCase())
        ) {
          result.push(
            <Link key={i} onClick={() => setForm("")} to={e.path}>
              {e.name || "Unnamed"}
            </Link>
          );
        }
      });
    }

    if (result.length === 0) {
      result.push(<p key={1}>{language?.navBar?.no_results}</p>);
    }

    return result;
  };

  const searchClick = () => {
    if (form.length > 1) {
      const matchedPage = pages.find(
        (e) =>
          e.name?.toLowerCase().includes(form.toLowerCase()) ||
          e.path?.toLowerCase().includes(form.toLowerCase())
      );

      if (matchedPage) {
        nav(matchedPage.path);
      } else {
        const path = form.replaceAll(" ", "_");
        nav(`/${path}`);
      }
      setForm("");
    }
  };

  return (
    <>
      <nav className={`${context?.isClosed ? "closed" : ""} center`}>
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
            <Link to={myProfilePath} className="info gap-10 center">
              <i className="center photo fa-solid fa-user"></i>
              <article>
                <h4>{name}</h4>
                <p> {userDetails?.role} </p>
              </article>
            </Link>

            <i
              onClick={changeMode}
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
                <h2
                  onClick={selectLang}
                  className={`${context?.language === "KU" ? "active" : ""}`}
                  data-lang="KU"
                >
                  kurdish
                </h2>
              </div>
            </article>
            <h4 onClick={logout} className="c-pointer log-out center">
              <i className="fa-solid fa-right-from-bracket"></i>
            </h4>
          </div>
        </div>
      </nav>

      <aside className={`${context?.isClosed ? "closed" : ""}`}>
        <article className="between">
          <div className="logo">
            <i className="fa-solid fa-graduation-cap" />
            <div>
              <h1>ideaacadmey</h1>
              <p>for computer science</p>
            </div>
          </div>
          <i onClick={closeAside} className="fa-solid fa-bars-staggered"></i>
        </article>

        <div className="flex-direction flex between gap-20">
          <div className="flex-direction flex gap-10">
            {navbarLinks?.map((link) => {
              if (link.showIf.includes(userDetails?.role)) {
                if (link.type === "single")
                  return (
                    <NavLink
                      key={link.to}
                      to={
                        typeof link.to === "function"
                          ? link.to(myProfilePath)
                          : link.to
                      }
                      className="w-100 justify-start center"
                    >
                      {link.icon}
                      <h1>{link.title(language?.navBar)}</h1>
                    </NavLink>
                  );
                else
                  return (
                    <div className="links" key={link.title}>
                      <div onClick={openDiv} className="center">
                        {link.icon}
                        <h1 className="flex-1">
                          {link.title(language?.navBar)}
                        </h1>
                        <i className="arrow fa-solid fa-chevron-right" />
                      </div>
                      <article>
                        {link.children.map(
                          (child) =>
                            child.showIf.includes(userDetails?.role) && (
                              <NavLink to={child.to} key={child.to}>
                                {child.title(language?.navBar)}
                              </NavLink>
                            )
                        )}
                      </article>
                    </div>
                  );
              }
            })}
          </div>
          <h3 onClick={logout} className="log-out center c-pointer aside">
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>{language.navBar && language.navBar.log_out}</span>
          </h3>
        </div>
      </aside>
    </>
  );
};

export default Navbar;
