import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../../constants/endPoints";
import { limit } from "../../../constants/enums";
import TableToolBar from "../../../components/table_toolbar/TableToolBar";
import Search from "../../../components/table_toolbar/Search";
import Table from "../../../components/table/Table";
import dateFormatter from "../../../utils/dateFormatter";
import { useParams } from "react-router-dom";
import APIClient from "../../../utils/ApiClient";

const column = [
  {
    name: "title",
    headerName: "title",
    sort: true,
  },
  {
    name: "date",
    headerName: "date",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.date),
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
  },
  {
    name: "updatedAt",
    headerName: "updatedAt",
    sort: true,
    hidden: true,
    getCell: ({ row }) => dateFormatter(row.updatedAt, "fullDate"),
  },
];
const apiClient = new APIClient(endPoints.exams);
const CourseExams = () => {
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.exams, page, search, sort, id],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        courseId: id,
        "date[gte]": Date.now(),
      }),
  });

  return (
    <div className="table-container flex-1">
      <TableToolBar>
        <h2 className="flex-1">exams</h2>
        <Search setSearch={setSearch} />
      </TableToolBar>
      <Table
        colmuns={column}
        currentPage={page}
        data={data?.data}
        dataLength={data?.totalCount}
        loading={isFetching}
        setPage={setPage}
        setSort={setSort}
      />
    </div>
  );
};

export default CourseExams;
