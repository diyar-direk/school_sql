import { lazy } from "react";
import { pagesRoute } from "./../../constants/pagesRoute";
const Subjects = lazy(() => import("./Subjects"));
export const subjectRouter = [
  {
    path: pagesRoute.subject.page,
    element: <Subjects />,
  },
];
