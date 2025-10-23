export const pagesRoute = {
  class: {
    page: "/classes",
  },
  exam: {
    page: "/exams_schedule",
    add: "/add_exam",
    update: "/update_exam/:id",
  },
  examResult: {
    page: "/exams_result",
    add: "/add_exam_result",
  },
  student: {
    page: "/all_students",
    add: "/add_student",
    update: "/update_student/:id",
    profile: "/profile/:id",
  },
  subject: {
    page: "/subjects",
  },
  teacher: {
    page: "/all_teachers",
    add: "/add_teacher",
    update: "/update_teacher/:id",
    profile: "/profile/:id",
  },
  admin: {
    page: "/all_admins",
    add: "/add_admin",
    update: "/update_admin/:id",
    profile: "/profile/:id",
  },
  user: {
    page: "/all_users",
    add: "/add_user",
  },
};
