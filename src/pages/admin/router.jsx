import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";

const AllAdmins = lazy(() => import("./AllAdmins"));
const AddAdmin = lazy(() => import("./AddAdmin"));
const UpdateAdmin = lazy(() => import("./UpdateAdmin"));
const Profile = lazy(() => import("../Profile"));
export const adminRouter = [
  {
    path: pagesRoute.admin.page,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AllAdmins />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.admin.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddAdmin />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.admin.update(),
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateAdmin />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.admin.profile,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <Profile />
      </AllowedTo>
    ),
  },
];
