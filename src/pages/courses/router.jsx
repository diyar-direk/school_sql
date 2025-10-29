import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const Courses = lazy(() => import("./Courses"));
const AddCourse = lazy(() => import("./AddCourse"));
const UpdateCourse = lazy(() => import("./UpdateCourse"));
const CourseView = lazy(() => import("./CourseView"));
const CourseTimeTable = lazy(() => import("./components/CourseTimeTable"));
const CourseExams = lazy(() => import("./components/CourseExams"));
const CourseStudents = lazy(() => import("./components/CourseStudents"));

export const coursesRouter = [
  {
    path: pagesRoute.courses.page,
    element: <Courses />,
  },
  {
    path: pagesRoute.courses.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddCourse />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.courses.update(),
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateCourse />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.courses.view(),
    element: <CourseView />,
    children: [
      {
        path: pagesRoute.courses.timeTable(),
        element: <CourseTimeTable />,
      },
      {
        path: pagesRoute.courses.exams(),
        element: <CourseExams />,
      },
      {
        path: pagesRoute.courses.students(),
        element: <CourseStudents />,
      },
    ],
  },
];
