import { useState } from "react";
import { Link } from "react-router-dom";
import dateFormatter from "../../utils/dateFormatter";
import Table from "../../components/table/Table";
import Search from "../../components/table_toolbar/Search";
import Delete from "../../components/table_toolbar/Delete";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import { endPoints } from "../../constants/endPoints";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { limit, roles } from "../../constants/enums";
import Button from "../../components/buttons/Button";
import { pagesRoute } from "./../../constants/pagesRoute";
import Add from "../../components/table_toolbar/Add";
import AllowedTo from "../../components/AllowedTo";
import { useTranslation } from "react-i18next";

const column = [
  {
    name: "firstName",
    headerName: "admins.name",
    sort: true,
    getCell: ({ row }) => `${row.firstName} ${row.lastName}`,
  },
  { name: "email", headerName: "admins.email" },
  {
    name: "createdAt",
    headerName: "admins.createdAt",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.createdAt, "fullDate"),
  },
  {
    name: "updatedAt",
    headerName: "admins.updatedAt",
    sort: true,
    hidden: true,
    getCell: ({ row }) => dateFormatter(row.updatedAt, "fullDate"),
  },
  {
    name: "actions",
    headerName: "admins.actions",
    className: "center",
    getCell: ({ row }) => (
      <Link to={pagesRoute.admin.update(row.id)}>
        <Button> update</Button>
      </Link>
    ),
  },
];
const apiClient = new APIClient(endPoints.admins);
const AllAdmins = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.admins, page, search, sort],
    queryFn: () => apiClient.getAll({ page, search, sort, limit }),
  });
  const [selectedItems, setSelectedItems] = useState(new Set());

  const { t } = useTranslation();

  return (
    <div className="container">
      <h1 className="title">{t("admins.all_admins")}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.admins}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.admins}
            />
            <Add path={pagesRoute.admin.add} />
          </AllowedTo>
        </TableToolBar>
        <Table
          colmuns={column}
          currentPage={page}
          data={data?.data}
          dataLength={data?.totalCount}
          loading={isFetching}
          selectable
          setPage={setPage}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          setSort={setSort}
        />
      </div>
    </div>
  );
};

export default AllAdmins;
