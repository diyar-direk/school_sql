import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllTeachers = lazy(() => import("./AllTeachers"));
const AddTeacher = lazy(() => import("./AddTeacher"));
const UpdateTeacher = lazy(() => import("./UpdateTeacher"));
const Profile = lazy(() => import("../Profile"));

export const teacherRouter = [
  {
    path: pagesRoute.teacher.page,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <AllTeachers />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.teacher.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddTeacher />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.teacher.update,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateTeacher />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.teacher.profile,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <Profile />
      </AllowedTo>
    ),
  },
];
