import { useCallback, useContext, useState } from "react";
import { Context } from "../../context/Context";
import { dayes, limit } from "../../constants/enums";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Table from "../../components/table/Table";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import APIClient from "../../utils/ApiClient";
import dateFormatter from "../../utils/dateFormatter";
import "./activities.css";
import IconButton from "../../components/buttons/IconButton";
import Filters from "./../../components/table_toolbar/Filters";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { useFormik } from "formik";
import { timeTableSchema } from "../../schemas/timeTable";

const apiClient = new APIClient(endPoints["time-table"]);

const column = [
  {
    name: "classId",
    headerName: "class",
    getCell: ({ row }) => row?.classId?.name,
  },
  {
    name: "courseId",
    headerName: "course",
    getCell: ({ row }) => row?.courseId?.name,
  },
  {
    name: "startTime",
    headerName: "startTime",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.startTime, "fullDate"),
  },
];

const TimeTable = () => {
  const context = useContext(Context);
  const [filters, setFilters] = useState({});
  const date = new Date();
  const [dayNumber, setDayNumber] = useState(date.getUTCDay() || 0);

  const language = context?.selectedLang;

  const daysOfWeek = [
    dayes.Sunday,
    dayes.Monday,
    dayes.Tuesday,
    dayes.Wednesday,
    dayes.Thursday,
    dayes.Friday,
    dayes.Saturday,
  ];

  const formik = useFormik({
    classId: "",
    courseId: "",
    dayOfWeek: daysOfWeek[dayNumber],
    startTime: "",
    enableReinitialize: true,
    validationSchema: timeTableSchema,
  });

  const increment = useCallback(
    () => setDayNumber((prev) => (prev + 1) % 7),
    []
  );
  const decrement = useCallback(
    () => setDayNumber((prev) => (prev - 1 + 7) % 7),
    []
  );

  const [sort, setSort] = useState({});

  const [page, setPage] = useState(1);

  const [selectedItems, setSelectedItems] = useState(new Set());

  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints["time-table"],
      page,
      sort,
      filters,
      daysOfWeek[dayNumber],
    ],
    queryFn: () =>
      apiClient.getAll({
        page,
        sort,
        limit,
        ...formatInputsData(filters),
        dayOfWeek: daysOfWeek[dayNumber],
      }),
  });

  return (
    <div className="container">
      <h1 className="title">time table</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <div className="time-table">
            <h2>prev</h2>
            <h2 className="active">
              {language?.days?.[daysOfWeek[dayNumber]]}
            </h2>
            <h2>next</h2>
          </div>
          <IconButton color="secondry-color" title="add new data">
            <i className="fa-solid fa-plus" />
          </IconButton>
          <Filters>
            <SelectInputApi
              endPoint={endPoints.courses}
              label="course"
              placeholder={filters?.courseId?.name || "any course"}
              optionLabel={(e) => e?.name}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, courseId: null })}>
                  any course
                </h3>
              }
              onChange={(e) => setFilters({ ...filters, courseId: e })}
            />
            <SelectInputApi
              endPoint={endPoints.classes}
              label="class"
              placeholder={filters?.classId?.name || "any class"}
              optionLabel={(e) => e?.name}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, classId: null })}>
                  any class
                </h3>
              }
              onChange={(e) => setFilters({ ...filters, classId: e })}
            />
          </Filters>
        </TableToolBar>
        <Table
          colmuns={column}
          currentPage={page}
          data={data?.data}
          dataLength={data?.totalCount}
          loading={isFetching}
          setPage={setPage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setSort={setSort}
        />
      </div>
    </div>
  );
};

export default TimeTable;
