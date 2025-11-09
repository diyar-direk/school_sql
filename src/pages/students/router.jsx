import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllStudents = lazy(() => import("./AllStudents"));
const AddStudent = lazy(() => import("./AddStudent"));
const UpdateStudent = lazy(() => import("./UpdateStudent"));
const StudentProfile = lazy(() => import("./StudentProfile"));
export const studentRouter = [
  {
    path: pagesRoute.student.page,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AllStudents />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.student.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddStudent />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.student.update(),
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateStudent />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.student.view(),
    element: <StudentProfile />,
  },
];
