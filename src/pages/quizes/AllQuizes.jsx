import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import { limit, roles } from "../../constants/enums";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Search from "../../components/table_toolbar/Search";
import Delete from "../../components/table_toolbar/Delete";
import Add from "../../components/table_toolbar/Add";
import { pagesRoute } from "../../constants/pagesRoute";
import Table from "../../components/table/Table";
import dateFormatter from "../../utils/dateFormatter";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import APIClient from "../../utils/ApiClient";
import Filters from "../../components/table_toolbar/Filters";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { formatInputsData } from "../../utils/formatInputsData";
import AllowedTo from "../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";
import "./quiz.css";
import { getMyExamsApi } from "../exams/api";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.quizzes);
const AllQuizes = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const { userDetails } = useAuth();
  const { role, profileId, isTeacher } = userDetails || {};
  const [filters, setFilters] = useState({
    courseId: null,
    courseId_multi: [],
  });
  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints.quizzes,
      page,
      search,
      sort,
      formatInputsData(filters),
    ],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        ...formatInputsData(filters),
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
        name: "Course",
        headerName: "quizzes.subject",
        getCell: ({ row }) => (
          <Link
            className="visit-text"
            to={pagesRoute.courses.view(row?.Course?.id)}
          >
            {row?.Course?.name}
          </Link>
        ),
      },
      {
        name: "date",
        headerName: "quizzes.date",
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
        headerName: "status",
        getCell: ({ row, t }) => {
          const now = new Date();
          const start = new Date(row.date);
          const end = new Date(start.getTime() + row.duration * 60000);
          if (now < start) {
            return (
              <div className="quize-status passed"> exam not started yet </div>
            );
          } else if (now > end) {
            return (
              <div className="quize-status done"> {t("filters.finished")} </div>
            );
          } else {
            return (
              <Link
                className="quize-status started"
                to={
                  role === roles.student ? pagesRoute.quize.take(row?.id) : ""
                }
              >
                exam is running now
              </Link>
            );
          }
        },
      },
      {
        name: "actions",
        headerName: "actions",
        getCell: ({ row }) => {
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
                  <Button> update</Button>
                </Link>
              )}
              {now > start && (
                <Link
                  to={pagesRoute.examResult.page}
                  state={{ courseId: row.courseId, quizId: row?.id }}
                >
                  <Button btnStyleType="outlined" btnType="save">
                    results
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

  const [getMyExams, setGetMyExams] = useState(false);

  const { data: coursesId } = useQuery({
    queryKey: [
      profileId?.id,
      role === roles.teacher ? endPoints.courses : endPoints["student-courses"],
    ],
    queryFn: async () => {
      const data = await getMyExamsApi(role, profileId?.id);
      return data || null;
    },
    enabled: getMyExams,
  });

  useEffect(() => {
    if (!getMyExams)
      return setFilters((prev) => ({
        ...prev,
        courseId_multi: [],
      }));

    if (!coursesId) return;

    setFilters((prev) => ({
      ...prev,
      courseId_multi: coursesId.map((e) =>
        role === roles.student ? e?.courseId : e?.id
      ),
    }));
  }, [coursesId, role, profileId, getMyExams]);

  const [selectedItems, setSelectedItems] = useState(new Set());
  const { t } = useTranslation();
  return (
    <div className="container">
      <h1 className="title">{t("quizzes.all_quizzes")}</h1>
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
            <Add path={pagesRoute.quize.add} />
          </AllowedTo>
          <Filters>
            <SelectInputApi
              endPoint={endPoints.courses}
              label={t("quizzes.subject")}
              placeholder={filters?.courseId?.name || t("filters.all")}
              optionLabel={(opt) => opt?.name}
              onChange={(opt) => setFilters({ ...filters, courseId: opt })}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, courseId: null })}>
                  {t("filters.all")}
                </h3>
              }
              params={{ teacherId: isTeacher ? profileId?.id : null }}
            />

            <AllowedTo roles={[roles.teacher, roles.student]}>
              <SelectOptionInput
                label={t("navBar.quiz")}
                placeholder={
                  getMyExams ? t("filters.my_quizzes") : t("filters.all")
                }
                onSelectOption={() => setGetMyExams(true)}
                options={[{ text: "my exams" }]}
                addOption={<h3 onClick={() => setGetMyExams(false)}>all</h3>}
              />
            </AllowedTo>
          </Filters>
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
    </div>
  );
};

export default AllQuizes;
