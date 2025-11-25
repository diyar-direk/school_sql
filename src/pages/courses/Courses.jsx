import { useState } from "react";
import Table from "../../components/table/Table";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Search from "../../components/table_toolbar/Search";
import Delete from "../../components/table_toolbar/Delete";
import Add from "../../components/table_toolbar/Add";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "./../../constants/endPoints";
import { useQuery } from "@tanstack/react-query";
import { limit, roles } from "../../constants/enums";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
import { Link } from "react-router-dom";
import { spritObject } from "./../../utils/spritObject";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";
import Filters from "../../components/table_toolbar/Filters";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.courses);

const column = [
  {
    name: "name",
    headerName: "subject.name",
    sort: true,
    getCell: ({ row }) => (
      <Link className="visit-text" to={pagesRoute.courses.view(row.id)}>
        {row.name}
      </Link>
    ),
  },
  { name: "code", headerName: "subject.code" },
  { name: "description", headerName: "subject.description", hidden: true },
  {
    name: "teacherId",
    headerName: "navBar.teachers",
    getCell: ({ row }) =>
      spritObject(row.teacherId, (e) => (
        <Link to={pagesRoute.teacher.view(e.id)} className="visit-text">
          {e.firstName}
        </Link>
      )),
    allowedTo: [roles.admin, roles.teacher],
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
    getCell: ({ row, t }) => (
      <div className="flex gap-10 center">
        <AllowedTo roles={[roles.admin]}>
          <Link to={pagesRoute.courses.update(row.id)}>
            <Button btnStyleType="outlined">
              <i className="fa-regular fa-pen-to-square" /> {t("update")}
            </Button>
          </Link>
        </AllowedTo>
        <Link to={pagesRoute.courses.view(row.id)}>
          <Button btnType="save" btnStyleType="outlined">
            <i className="fa-solid fa-eye" /> {t("view")}
          </Button>
        </Link>
      </div>
    ),
  },
];

const Courses = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");

  const { userDetails } = useAuth();
  const { role, profileId, isTeacher } = userDetails || {};

  const [filter, setFilter] = useState({
    teacherId: isTeacher ? profileId : null,
  });

  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints.courses,
      page,
      limit,
      sort,
      search,
      formatInputsData(filter),
    ],
    queryFn: () =>
      apiClient.getAll({
        limit,
        page,
        sort,
        search,
        ...formatInputsData(filter),
      }),
  });

  const [selectedItems, setSelectedItems] = useState(new Set());

  const { t } = useTranslation();
  return (
    <div className="container">
      <h1 className="title">{t("navBar.subjects")}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.courses}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.courses}
            />
            <Add path={pagesRoute.courses.add} />
            <Filters filters={filter} setFilters={setFilter}>
              <SelectInputApi
                endPoint={endPoints.teachers}
                label={t("navBar.teachers")}
                onChange={(e) => setFilter({ teacherId: e })}
                optionLabel={(e) =>
                  `${e.firstName} ${e.middleName} ${e.lastName}`
                }
                placeholder={
                  filter?.teacherId
                    ? `${filter?.teacherId?.firstName} ${filter?.teacherId?.lastName}`
                    : t("filters.all")
                }
              />
            </Filters>
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
    </div>
  );
};

export default Courses;
