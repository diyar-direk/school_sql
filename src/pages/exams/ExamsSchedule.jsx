import { useCallback, useMemo, useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/buttons/Button";
import APIClient from "../../utils/ApiClient";
import Filters from "./../../components/table_toolbar/Filters";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import SelectOptionInput from "./../../components/inputs/SelectOptionInput";
import { formatInputsData } from "./../../utils/formatInputsData";
import AllowedTo from "../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";

const apiClient = new APIClient(endPoints.exams);
const ExamSchedule = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({ courseId: null });
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.exams, page, search, sort, formatInputsData(filters)],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        ...formatInputsData(filters),
      }),
  });

  const [selectedItems, setSelectedItems] = useState(new Set());
  const { userDetails } = useAuth();
  const { role } = userDetails || "";

  const dateKey = Object.keys(filters).find((key) => key.includes("date"));
  const dateText = dateKey ? filters[dateKey].text : null;
  const nav = useNavigate();
  const handleNavigate = useCallback(
    (row) => nav(pagesRoute.examResult.add, { state: { examId: row } }),
    [nav]
  );

  const column = useMemo(
    () => [
      {
        name: "title",
        headerName: "title",
        sort: true,
      },
      {
        name: "courseId",
        headerName: "courseId",
        getCell: ({ row }) => (
          <Link
            className="visit-text"
            to={pagesRoute.courses.view(row?.courseId?._id)}
          >
            {row?.courseId?.name}
          </Link>
        ),
      },
      {
        name: "date",
        headerName: "date",
        sort: true,
        getCell: ({ row }) => dateFormatter(row.date, "fullDate"),
      },
      {
        name: "duration",
        headerName: "duration",
        sort: true,
      },
      {
        name: "totalMarks",
        headerName: "totalMarks",
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
        allowedTo: [roles.admin],
        getCell: ({ row }) => (
          <div className="flex gap-10 align-center">
            <Link to={pagesRoute.exam.update(row?._id)}>
              <Button btnStyleType="outlined"> update</Button>
            </Link>
            {new Date(row.date).getTime() >= Date.now() && (
              <Button
                btnStyleType="outlined"
                btnType="save"
                onClick={() => handleNavigate(row)}
              >
                add result
              </Button>
            )}
          </div>
        ),
      },
    ],
    [handleNavigate]
  );

  return (
    <div className="container">
      <h1 className="title">exams</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.exams}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.exams}
            />
            <Add path={pagesRoute.exam.add} />
          </AllowedTo>
          <Filters>
            <SelectInputApi
              endPoint={endPoints.courses}
              label="course"
              placeholder={filters?.courseId?.name || "all courses"}
              optionLabel={(opt) => opt?.name}
              onChange={(opt) => setFilters({ ...filters, courseId: opt })}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, courseId: null })}>
                  all courses
                </h3>
              }
            />
            <SelectOptionInput
              label="exam type"
              addOption={
                <h3 onClick={() => setFilters({ courseId: filters?.courseId })}>
                  any type
                </h3>
              }
              options={[
                { text: "finished", value: Date.now(), enum: "date[lt]" },
                { text: "not finished", value: Date.now(), enum: "date[gte]" },
              ]}
              placeholder={dateText || "any type"}
              onSelectOption={(opt) =>
                setFilters({ courseId: filters?.courseId, [opt.enum]: opt })
              }
            />
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

export default ExamSchedule;
