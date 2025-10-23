import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../../context/Context";
import dateFormatter from "../../utils/dateFormatter";
import Table from "../../components/table/Table";
import Search from "../../components/table_toolbar/Search";
import Delete from "../../components/table_toolbar/Delete";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import { endPoints } from "../../constants/endPoints";
import { useQuery } from "@tanstack/react-query";
import APIClient from "../../utils/ApiClient";
import { limit } from "../../constants/enums";
import Button from "../../components/buttons/Button";
import { pagesRoute } from "./../../constants/pagesRoute";
import Add from "../../components/table_toolbar/Add";

const column = [
  {
    name: "firstName",
    headerName: "name",
    sort: true,
    getCell: ({ row }) => `${row.firstName} ${row.lastName}`,
  },
  { name: "email", headerName: "email" },
  {
    name: "createdAt",
    headerName: "createdAt",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.createdAt),
  },
  {
    name: "updatedAt",
    headerName: "updatedAt",
    sort: true,
    hidden: true,
    getCell: ({ row }) => dateFormatter(row.updatedAt),
  },
  {
    name: "actions",
    headerName: "actions",
    className: "center",
    getCell: ({ row }) => (
      <Link to={pagesRoute.admin.update(row._id)}>
        <Button> update</Button>
      </Link>
    ),
  },
];
const apiClient = new APIClient(endPoints.admins);
const AllAdmins = () => {
  const context = useContext(Context);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.admins, page, search, sort],
    queryFn: () => apiClient.getAll({ page, search, sort, limit }),
  });
  const [selectedItems, setSelectedItems] = useState(new Set());

  const language = context?.selectedLang;

  return (
    <div className="container">
      <h1 className="title">{language.admins && language.admins.all_admins}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <Delete
            queryKey={endPoints.admins}
            data={data}
            selectedItems={selectedItems}
            setPage={setPage}
            setSelectedItems={setSelectedItems}
            endPoint={endPoints.admins}
          />
          <Add path={pagesRoute.admin.add} />
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
