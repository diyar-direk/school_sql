import { useCallback, useMemo, useState } from "react";
import { dayes, limit, roles } from "../../constants/enums";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Table from "../../components/table/Table";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import APIClient from "../../utils/ApiClient";
import "./time-table.css";
import IconButton from "../../components/buttons/IconButton";
import Filters from "../../components/table_toolbar/Filters";
import SelectInputApi from "../../components/inputs/SelectInputApi";
import { formatInputsData } from "../../utils/formatInputsData";
import Button from "../../components/buttons/Button";
import TimeTableForm from "./TimeTableForm";
import DeleteTimeTable from "./DeleteTimeTable";
import { Link } from "react-router-dom";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "./../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints["time-table"]);

const TimeTable = () => {
  const [filters, setFilters] = useState({});
  const date = new Date();
  const [dayNumber, setDayNumber] = useState(date.getUTCDay() || 0);

  const { t } = useTranslation();

  const daysOfWeek = [
    dayes.Sunday,
    dayes.Monday,
    dayes.Tuesday,
    dayes.Wednesday,
    dayes.Thursday,
    dayes.Friday,
    dayes.Saturday,
  ];

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

  const [selectedItems, setSelectedItems] = useState(null);

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

  const [isUpdate, setIsUpdate] = useState(false);

  const column = useMemo(
    () => [
      {
        name: "courseId",
        headerName: "timeTable.subject",
        getCell: ({ row }) => (
          <Link
            className="visit-text"
            to={pagesRoute.courses.view(row?.courseId)}
          >
            {row?.course?.name}
          </Link>
        ),
      },
      {
        name: "classId",
        headerName: "error.Class",
        getCell: ({ row }) => row?.class?.name,
      },
      {
        name: "startTime",
        headerName: "timeTable.start_time",
        sort: true,
        getCell: ({ row }) => formatTime(row.startTime),
      },
      {
        name: "actions",
        headerName: "actions",
        allowedTo: roles.admin,
        getCell: ({ row, t }) => (
          <div className="center gap-10">
            <Button
              btnType="delete"
              btnStyleType="outlined"
              onClick={() => setSelectedItems(row?.id)}
            >
              <i className="fa-solid fa-trash-can" /> {t("delete")}
            </Button>
            <Button btnStyleType="outlined" onClick={() => setIsUpdate(row)}>
              <i className="fa-solid fa-pen-to-square" /> {t("update")}
            </Button>
          </div>
        ),
      },
    ],
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const { userDetails } = useAuth();
  const { isTeacher, profileId } = userDetails || {};

  return (
    <div className="container">
      <AllowedTo roles={[roles.admin]}>
        <DeleteTimeTable
          isOpen={selectedItems}
          endPoint={`${endPoints["time-table"]}/${endPoints["delete-many"]}`}
          setIsOpen={setSelectedItems}
        />
        <TimeTableForm
          day={daysOfWeek[dayNumber]}
          setIsOpen={setIsOpen}
          isOpen={isOpen}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
        />
      </AllowedTo>
      <h1 className="title">{t("navBar.time_table")}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <div className="time-table">
            <h2 onClick={decrement}>{t("timeTable.prev_day")}</h2>
            <h2 className="active">{t(`days.${daysOfWeek[dayNumber]}`)}</h2>
            <h2 onClick={increment}>{t("timeTable.next_day")}</h2>
          </div>
          <AllowedTo roles={[roles.admin]}>
            <IconButton
              color="secondry-color"
              title="add new data"
              onClick={() => setIsOpen(true)}
            >
              <i className="fa-solid fa-plus" />
            </IconButton>
          </AllowedTo>
          <Filters
            hideCreatedAtInputs
            dateFields={[
              {
                name: "startTime",
                title: "timeTable.start_time",
                type: "time",
              },
            ]}
            filters={filters}
            setFilters={setFilters}
          >
            <SelectInputApi
              endPoint={endPoints.courses}
              label={t("timeTable.subject")}
              placeholder={filters?.courseId?.name || t("filters.all")}
              optionLabel={(e) => e?.name}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, courseId: null })}>
                  {t("filters.all")}
                </h3>
              }
              onChange={(e) => setFilters({ ...filters, courseId: e })}
              params={{ teacherId: isTeacher ? profileId?.id : null }}
            />
            <SelectInputApi
              endPoint={endPoints.classes}
              label={t("error.Class")}
              placeholder={filters?.classId?.name || t("filters.all")}
              optionLabel={(e) => e?.name}
              addOption={
                <h3 onClick={() => setFilters({ ...filters, classId: null })}>
                  {t("filters.all")}
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

const formatTime = (timeString) => {
  if (!timeString) return "";

  const [hoursStr, minutes] = timeString.split(":");
  let hours = parseInt(hoursStr, 10);
  const at = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const formattedHours = String(hours).padStart(2, "0");
  return `${formattedHours}:${minutes} ${at}`;
};
