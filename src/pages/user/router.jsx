import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllUsers = lazy(() => import("./AllUsers"));
const AddUser = lazy(() => import("./AddUser"));

export const usersRouter = [
  {
    path: pagesRoute.user.page,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AllUsers />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.user.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddUser />
      </AllowedTo>
    ),
  },
];
