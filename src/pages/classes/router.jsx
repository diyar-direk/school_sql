import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
const Classes = lazy(() => import("./Classes"));
export const classesRouter = [
  { path: pagesRoute.class.page, element: <Classes /> },
];
