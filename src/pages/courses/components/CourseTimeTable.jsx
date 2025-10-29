import { useState } from "react";
import { dayes, limit } from "../../../constants/enums";
import TableToolBar from "../../../components/table_toolbar/TableToolBar";
import Table from "../../../components/table/Table";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../../constants/endPoints";
import APIClient from "../../../utils/ApiClient";
import Filters from "../../../components/table_toolbar/Filters";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import { formatInputsData } from "../../../utils/formatInputsData";
import { useParams } from "react-router-dom";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";

const apiClient = new APIClient(endPoints["time-table"]);

const column = [
  {
    name: "dayOfWeek",
    headerName: "day Of Week",
  },
  {
    name: "classId",
    headerName: "class",
    getCell: ({ row }) => row?.classId?.name,
  },
  {
    name: "startTime",
    headerName: "startTime",
    sort: true,
    getCell: ({ row }) => formatTime(row.startTime),
  },
];

const CourseTimeTable = () => {
  const [filters, setFilters] = useState({});

  const { id } = useParams();

  const [sort, setSort] = useState({});

  const [page, setPage] = useState(1);

  const [selectedItems, setSelectedItems] = useState(null);

  const { data, isFetching } = useQuery({
    queryKey: [endPoints["time-table"], page, sort, filters, id],
    queryFn: () =>
      apiClient.getAll({
        page,
        sort,
        limit,
        ...formatInputsData(filters),
        courseId: id,
      }),
  });

  return (
    <div className="table-container flex-1">
      <TableToolBar>
        <h2>time table</h2>
        <Filters>
          <SelectOptionInput
            label="days"
            placeholder={filters?.dayOfWeek || "any day"}
            addOption={
              <h3 onClick={() => setFilters({ ...filters, dayOfWeek: "" })}>
                any day
              </h3>
            }
            options={Object.values(dayes).map((e) => ({ text: e, value: e }))}
            onSelectOption={(e) =>
              setFilters({ ...filters, dayOfWeek: e.value })
            }
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
  );
};

export default CourseTimeTable;

const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hoursStr, minutes] = timeString.split(":");
  let hours = parseInt(hoursStr, 10);
  const at = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  return `${formattedHours}:${minutes} ${at}`;
};
