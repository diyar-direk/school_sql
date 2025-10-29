import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
const TimeTable = lazy(() => import("./TimeTable"));

export const timeTableRouter = [
  {
    path: pagesRoute.timeTable.page,
    element: <TimeTable />,
  },
];
