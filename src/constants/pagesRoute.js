export const pagesRoute = {
  class: {
    page: "/classes",
  },
  exam: {
    page: "/exam/all",
    add: "/exam/add",
    update: (id = ":id") => `/exam/update/${id}`,
  },
  examResult: {
    page: "/exams_result/all",
    add: "/exams_result/add",
    update: (id = ":id") => `/exams_result/update/${id}`,
  },
  student: {
    page: "/students/all",
    add: "/students/add",
    update: (id = ":id") => `/students/update/${id}`,
    view: (id = ":id") => `/students/view/${id}`,
  },
  courses: {
    page: "/courses/all",
    add: "/courses/add",
    update: (id = ":id") => `/courses/update/${id}`,
  },
  teacher: {
    page: "/teacher/all",
    add: "/teacher/add",
    update: (id = ":id") => `/teacher/update/${id}`,
    view: (id = ":id") => `/teacher/view/${id}`,
  },
  admin: {
    page: "/admin/all",
    add: "/admin/add",
    update: (id = ":id") => `/admin/update/${id}`,
    view: (id = ":id") => `/admin/view/${id}`,
  },
  user: {
    page: "/all_users",
    add: "/add_user",
  },
  attendance: {
    page: "attendance",
  },
  timeTable: {
    page: "time_table",
  },
  quize: {
    page: "/quize/all",
    add: "/quize/add",
  },
  login: "/login",
};
