import { Link, useParams } from "react-router-dom";
import AllowedTo from "../../../components/AllowedTo";
import Table from "../../../components/table/Table";
import Add from "../../../components/table_toolbar/Add";
import Delete from "../../../components/table_toolbar/Delete";
import Search from "../../../components/table_toolbar/Search";
import TableToolBar from "../../../components/table_toolbar/TableToolBar";
import { endPoints } from "../../../constants/endPoints";
import { limit, roles } from "../../../constants/enums";
import { pagesRoute } from "../../../constants/pagesRoute";
import Button from "../../../components/buttons/Button";
import dateFormatter from "../../../utils/dateFormatter";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import APIClient from "../../../utils/ApiClient";
import "../../quizes/quiz.css";
const apiClient = new APIClient(endPoints.quizzes);

const CourseQuiz = () => {
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const { userDetails } = useAuth();
  const { role, profileId } = userDetails || {};
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.quizzes, page, search, sort, id],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        courseId: id,
      }),
  });

  const column = useMemo(
    () => [
      {
        name: "title",
        headerName: "quizzes.title",
      },
      {
        name: "description",
        headerName: "quizzes.discreption",
        hidden: true,
      },
      {
        name: "date",
        headerName: "date",
        sort: true,
        getCell: ({ row }) => dateFormatter(row.date, "fullDate"),
      },
      {
        name: "duration",
        headerName: "quizzes.duration",
        sort: true,
      },
      {
        name: "totalMarks",
        headerName: "exams.total_marks",
        sort: true,
      },
      {
        name: "createdAt",
        headerName: "createdAt",
        sort: true,
        getCell: ({ row }) => dateFormatter(row.createdAt, "fullDate"),
        allowedTo: [roles.admin],
      },
      {
        name: "updatedAt",
        headerName: "updatedAt",
        sort: true,
        hidden: true,
        getCell: ({ row }) => dateFormatter(row.updatedAt, "fullDate"),
        allowedTo: [roles.admin],
      },
      {
        name: "status",
        headerName: "exams.status",
        getCell: ({ row, t }) => {
          const now = new Date();
          const start = new Date(row.date);
          const end = new Date(start.getTime() + row.duration * 60000);
          if (now < start) {
            return (
              <div className="quize-status passed">
                <i
                  className="fa-solid fa-hourglass"
                  style={{ fontSize: "80%" }}
                />
                {t("filters.not_started")}
              </div>
            );
          } else if (now > end) {
            return (
              <div className="quize-status done">
                <i
                  className="fa-solid fa-hourglass-end"
                  style={{ fontSize: "80%" }}
                />
                {t("filters.finished")}
              </div>
            );
          } else {
            return (
              <Link
                className="quize-status started"
                to={
                  role === roles.student ? pagesRoute.quize.take(row?.id) : ""
                }
              >
                <i
                  className="fa-solid fa-hourglass-start"
                  style={{ fontSize: "80%" }}
                />
                {t("filters.running")}
              </Link>
            );
          }
        },
      },
      {
        name: "actions",
        headerName: "actions",
        allowedTo: [roles.admin, roles.teacher],
        getCell: ({ row, t }) => {
          const now = new Date();
          const start = new Date(row.date);
          return (
            <div className="flex gap-10 align-center">
              {(role === roles.admin ||
                (role === roles.teacher &&
                  row.Course?.teacherId?.some(
                    (id) => id.id === profileId?.id
                  ))) && (
                <Link to={pagesRoute.quize.update(row?.id)}>
                  <Button btnStyleType="outlined">
                    <i className="fa-regular fa-pen-to-square" /> {t("update")}
                  </Button>
                </Link>
              )}
              {now > start && (
                <Link
                  to={pagesRoute.examResult.page}
                  state={{ courseId: row.courseId, quizId: row?.id }}
                >
                  <Button btnStyleType="outlined" btnType="save">
                    <i className="fa-solid fa-clipboard-list" /> {t("results")}
                  </Button>
                </Link>
              )}
            </div>
          );
        },
      },
    ],
    [role, profileId]
  );

  const [selectedItems, setSelectedItems] = useState(new Set());

  return (
    <div className="table-container flex-1">
      <TableToolBar>
        <Search setSearch={setSearch} />
        <AllowedTo roles={[roles.admin]}>
          <Delete
            queryKey={endPoints.quizzes}
            data={data}
            selectedItems={selectedItems}
            setPage={setPage}
            setSelectedItems={setSelectedItems}
            endPoint={endPoints.quizzes}
          />
        </AllowedTo>
        <AllowedTo roles={[roles.admin, roles.teacher]}>
          <Add path={pagesRoute.quize.add} state={{ courseId: id }} />
        </AllowedTo>
      </TableToolBar>
      <Table
        colmuns={column}
        currentPage={page}
        data={data?.data}
        dataLength={data?.totalCount}
        loading={isFetching}
        selectable={role === roles.admin}
        setPage={setPage}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSort={setSort}
      />
    </div>
  );
};

export default CourseQuiz;
