import { roles } from "../../constants/enums";
import { pagesRoute } from "../../constants/pagesRoute";

const navbarLinks = [
  {
    title: (lang) => lang?.my_profile,
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-regular fa-circle-user" />,
    to: (me) => me,
  },
  {
    title: (lang) => lang.users,
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-users" />,
    children: [
      {
        title: (lang) => lang.all_users,
        showIf: [roles.admin],
        to: pagesRoute.user.page,
      },
      {
        title: (lang) => lang.add_users,
        showIf: [roles.admin],
        to: pagesRoute.user.add,
      },
    ],
  },
  {
    title: (lang) => lang.admins,
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-user-group" />,
    children: [
      {
        title: (lang) => lang.all_admins,
        showIf: [roles.admin],
        to: pagesRoute.admin.page,
      },
      {
        title: (lang) => lang.add_admins,
        showIf: [roles.admin],
        to: pagesRoute.admin.add,
      },
    ],
  },
  {
    title: (lang) => lang.teachers,
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-people-group" />,
    children: [
      {
        title: (lang) => lang.all_teachers,
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.teacher.page,
      },
      {
        title: (lang) => lang.add_teacher,
        showIf: [roles.admin],
        to: pagesRoute.teacher.add,
      },
    ],
  },
  {
    title: (lang) => lang.students,
    type: "multi",
    showIf: [roles.admin],
    icon: <i className="fa-solid fa-children" />,
    children: [
      {
        title: (lang) => lang.all_students,
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.student.page,
      },
      {
        title: (lang) => lang.add_student,
        showIf: [roles.admin],
        to: pagesRoute.student.add,
      },
    ],
  },
  {
    title: (lang) => "lang.timeTable",
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-table-list" />,
    to: pagesRoute.timeTable.page,
  },
  {
    title: (lang) => lang.exam,
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-list-check" />,
    children: [
      {
        title: (lang) => lang.exam_schedule,
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.exam.page,
      },
      {
        title: (lang) => lang.add_exam,
        showIf: [roles.admin],
        to: pagesRoute.exam.add,
      },
      {
        title: (lang) => lang.exam_results,
        showIf: [roles.admin, roles.student],
        to: pagesRoute.examResult.page,
      },
      {
        title: (lang) => lang.add_exam_results,
        showIf: [roles.admin],
        to: pagesRoute.examResult.add,
      },
    ],
  },
  {
    title: (lang) => lang.subjects,
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-pen-nib" />,
    children: [
      {
        title: (lang) => "lang.courses",
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.courses.page,
      },
      {
        title: (lang) => "lang.add_course",
        showIf: [roles.admin],
        to: pagesRoute.courses.add,
      },
    ],
  },
  {
    title: (lang) => lang.classes,
    type: "single",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-school-flag" />,
    to: pagesRoute.class.page,
  },
  {
    title: (lang) => lang.quiz,
    type: "multi",
    showIf: [roles.admin, roles.teacher, roles.student],
    icon: <i className="fa-solid fa-pencil" />,
    children: [
      {
        title: (lang) => lang.all_quiz,
        showIf: [roles.admin, roles.teacher, roles.student],
        to: pagesRoute.quize.page,
      },
      {
        title: (lang) => lang.add_quiz,
        showIf: [roles.admin, roles.teacher],
        to: pagesRoute.quize.add,
      },
    ],
  },
];

export default navbarLinks;
