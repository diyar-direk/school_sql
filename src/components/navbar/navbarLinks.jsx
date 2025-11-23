import { roles } from "../../constants/enums";
import { pagesRoute } from "../../constants/pagesRoute";

const navbarLinks = [
  {
    title: "navBar.my_profile",
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-regular fa-circle-user" />,
    to: (me) => me,
  },

  {
    title: "navBar.users",
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-users" />,
    children: [
      {
        title: "navBar.all_users",
        showIf: [roles.admin],
        to: pagesRoute.user.page,
      },
      {
        title: "navBar.add_users",
        showIf: [roles.admin],
        to: pagesRoute.user.add,
      },
    ],
  },

  {
    title: "navBar.admins",
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-user-group" />,
    children: [
      {
        title: "navBar.all_admins",
        showIf: [roles.admin],
        to: pagesRoute.admin.page,
      },
      {
        title: "navBar.add_admins",
        showIf: [roles.admin],
        to: pagesRoute.admin.add,
      },
    ],
  },

  {
    title: "navBar.teachers",
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-people-group" />,
    children: [
      {
        title: "navBar.all_teachers",
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.teacher.page,
      },
      {
        title: "navBar.add_teacher",
        showIf: [roles.admin],
        to: pagesRoute.teacher.add,
      },
    ],
  },

  {
    title: "navBar.students",
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-children" />,
    children: [
      {
        title: "navBar.all_students",
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.student.page,
      },
      {
        title: "navBar.add_student",
        showIf: [roles.admin],
        to: pagesRoute.student.add,
      },
    ],
  },

  {
    title: "navBar.time_table",
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-table-list" />,
    to: pagesRoute.timeTable.page,
  },

  {
    title: "navBar.exam",
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-list-check" />,
    children: [
      {
        title: "navBar.exam_schedule",
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.exam.page,
      },
      {
        title: "navBar.add_exam",
        showIf: [roles.admin],
        to: pagesRoute.exam.add,
      },
      {
        title: "navBar.exam_results",
        showIf: [roles.admin, roles.student],
        to: pagesRoute.examResult.page,
      },
      {
        title: "navBar.add_exam_results",
        showIf: [roles.admin],
        to: pagesRoute.examResult.add,
      },
    ],
  },

  {
    title: "navBar.subjects",
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-pen-nib" />,
    children: [
      {
        title: "navBar.subjects",
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.courses.page,
      },
      {
        title: "navBar.add_subjects",
        showIf: [roles.admin],
        to: pagesRoute.courses.add,
      },
    ],
  },

  {
    title: "navBar.classes",
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-school-flag" />,
    to: pagesRoute.class.page,
  },

  {
    title: "navBar.quiz",
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-pencil" />,
    children: [
      {
        title: "navBar.all_quiz",
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.quize.page,
      },
      {
        title: "navBar.add_quiz",
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.quize.add,
      },
    ],
  },
];

export default navbarLinks;
