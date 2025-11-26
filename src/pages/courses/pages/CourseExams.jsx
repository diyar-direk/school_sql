import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../../constants/endPoints";
import { limit, roles } from "../../../constants/enums";
import TableToolBar from "../../../components/table_toolbar/TableToolBar";
import Search from "../../../components/table_toolbar/Search";
import Table from "../../../components/table/Table";
import dateFormatter from "../../../utils/dateFormatter";
import { Link, useNavigate, useParams } from "react-router-dom";
import APIClient from "../../../utils/ApiClient";
import IconButton from "../../../components/buttons/IconButton";
import { pagesRoute } from "../../../constants/pagesRoute";
import AllowedTo from "../../../components/AllowedTo";
import Delete from "../../../components/table_toolbar/Delete";
import Filters from "../../../components/table_toolbar/Filters";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../context/AuthContext";
import { formatInputsData } from "../../../utils/formatInputsData";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.exams);
const CourseExams = () => {
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({});
  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints.exams,
      page,
      search,
      sort,
      id,
      formatInputsData(filters),
    ],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        courseId: id,
        ...formatInputsData(filters),
      }),
  });

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || false;

  const nav = useNavigate();
  const [selectedItems, setSelectedItems] = useState(new Set());

  const navigateAddExamPage = useCallback(() => {
    nav(pagesRoute.exam.add, { state: { courseId: id } });
  }, [nav, id]);

  const dateKey = Object.keys(filters).find((key) => key.includes("date"));
  const dateText = dateKey ? filters[dateKey].text : null;

  const column = useMemo(
    () => [
      {
        name: "title",
        headerName: "quizzes.title",
        sort: true,
      },
      {
        name: "date",
        headerName: "exams.date",
        sort: true,
        getCell: ({ row }) => dateFormatter(row.date, "fullDate"),
      },
      {
        name: "duration",
        headerName: "exams.duration",
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
        name: "actions",
        headerName: "actions",
        className: "center",
        getCell: ({ row, t }) => (
          <div className="flex gap-10 align-center">
            <AllowedTo roles={[roles.admin, roles.teacher]}>
              <Link to={pagesRoute.exam.update(row?.id)}>
                <Button btnStyleType="outlined">
                  <i className="fa-regular fa-pen-to-square" /> {t("update")}
                </Button>
              </Link>
            </AllowedTo>
            {new Date(row.date).getTime() < Date.now() && (
              <Link
                to={pagesRoute.examResult.page}
                state={{ courseId: id, examId: row?.id }}
              >
                <Button btnStyleType="outlined" btnType="save">
                  <i className="fa-solid fa-clipboard-list" /> {t("results")}
                </Button>
              </Link>
            )}
          </div>
        ),
      },
    ],
    [id]
  );

  const { t } = useTranslation();
  return (
    <div className="table-container flex-1">
      <TableToolBar>
        <Search setSearch={setSearch} />
        <AllowedTo roles={[roles.admin, roles.teacher]}>
          {isAdmin && (
            <Delete
              queryKey={endPoints.exams}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.exams}
            />
          )}
          <IconButton
            color="secondry-color"
            title="Add"
            onClick={navigateAddExamPage}
          >
            <i className="fa-solid fa-plus" />
          </IconButton>
        </AllowedTo>
        <Filters
          dateFields={[{ name: "date", title: "exams.date" }]}
          filters={filters}
          setFilters={setFilters}
        >
          <SelectOptionInput
            label={t("filters.exam_type")}
            addOption={
              <h3 onClick={() => setFilters({})}>{t("filters.all")}</h3>
            }
            options={[
              {
                text: t("filters.finished"),
                value: Date.now(),
                enum: "date[lt]",
              },
              {
                text: t("filters.not_finished"),
                value: Date.now(),
                enum: "date[gte]",
              },
            ]}
            placeholder={dateText || t("filters.any")}
            onSelectOption={(opt) => setFilters({ [opt.enum]: opt })}
          />
        </Filters>
      </TableToolBar>
      <Table
        colmuns={column}
        currentPage={page}
        data={data?.data}
        dataLength={data?.totalCount}
        loading={isFetching}
        selectable={isAdmin}
        setPage={setPage}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSort={setSort}
      />
    </div>
  );
};

export default CourseExams;
