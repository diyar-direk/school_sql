import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllQuizes = lazy(() => import("./AllQuizes"));
const AddQuiz = lazy(() => import("./AddQuiz"));
export const quizeRouter = [
  {
    path: pagesRoute.quize.page,
    element: <AllQuizes />,
  },
  {
    path: pagesRoute.quize.add,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <AddQuiz />
      </AllowedTo>
    ),
  },
];
