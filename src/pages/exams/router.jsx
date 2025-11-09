import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";

const Exams = lazy(() => import("./ExamsSchedule"));
const AddExam = lazy(() => import("./AddExam"));
const UpdateExamSchedule = lazy(() => import("./UpdateExamSchedule"));
const ExamResult = lazy(() => import("./ExamResult"));
const AddExamResult = lazy(() => import("./AddExamResult"));
const UpdateExamResult = lazy(() => import("./UpdateExamResult"));
export const examRouter = [
  {
    path: pagesRoute.exam.page,
    element: <Exams />,
  },
  {
    path: pagesRoute.exam.add,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <AddExam />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.exam.update(),
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <UpdateExamSchedule />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.examResult.page,
    element: <ExamResult />,
  },
  {
    path: pagesRoute.examResult.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddExamResult />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.examResult.update(),
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <UpdateExamResult />
      </AllowedTo>
    ),
  },
];
