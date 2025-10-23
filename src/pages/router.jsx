import { adminRouter } from "./admin/router";
import { classesRouter } from "./classes/router";
import { examRouter } from "./exams/router";
import { studentRouter } from "./students/router";
import { subjectRouter } from "./subjects/router";
import { teacherRouter } from "./teachers/router";
import { usersRouter } from "./user/router";

export const dashboardRouter = [
  ...classesRouter,
  ...examRouter,
  ...studentRouter,
  ...subjectRouter,
  ...teacherRouter,
  ...adminRouter,
  ...usersRouter,
];
