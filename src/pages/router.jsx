import { adminRouter } from "./admin/router";
import { classesRouter } from "./classes/router";
import { coursesRouter } from "./courses/router";
import { examRouter } from "./exams/router";
import { studentRouter } from "./students/router";
import { teacherRouter } from "./teachers/router";
import { usersRouter } from "./user/router";
import { timeTableRouter } from "./time_table/router";

export const dashboardRouter = [
  ...classesRouter,
  ...examRouter,
  ...studentRouter,
  ...coursesRouter,
  ...teacherRouter,
  ...adminRouter,
  ...usersRouter,
  ...timeTableRouter,
];
