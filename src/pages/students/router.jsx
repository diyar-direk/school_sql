import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllStudents = lazy(() => import("./AllStudents"));
const AddStudent = lazy(() => import("./AddStudent"));
const UpdateStudent = lazy(() => import("./UpdateStudent"));
const StudentProfile = lazy(() => import("../Profile"));
export const studentRouter = [
  {
    path: pagesRoute.student.page,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
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
    path: pagesRoute.student.update,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateStudent />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.student.profile,
    element: <StudentProfile />,
  },
];
