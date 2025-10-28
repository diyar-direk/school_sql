import { lazy } from "react";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
import { pagesRoute } from "../../constants/pagesRoute";
const Attendance = lazy(() => import("./Attendence"));
const TimeTable = lazy(() => import("./TimeTable"));

export const activitiesRouter = [
  {
    path: pagesRoute.activities.attendance,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <Attendance />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.activities.timeTable,
    element: <TimeTable />,
  },
];
