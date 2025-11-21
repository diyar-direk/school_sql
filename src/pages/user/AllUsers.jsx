import { useState } from "react";
import Table from "../../components/table/Table";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import dateFormatter from "./../../utils/dateFormatter";
import { limit, roles } from "../../constants/enums";
import Search from "../../components/table_toolbar/Search";
import Add from "../../components/table_toolbar/Add";
import Delete from "../../components/table_toolbar/Delete";
import { pagesRoute } from "./../../constants/pagesRoute";
import APIClient from "../../utils/ApiClient";
import Filters from "../../components/table_toolbar/Filters";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { formatInputsData } from "./../../utils/formatInputsData";
import AllowedTo from "../../components/AllowedTo";
import { Link } from "react-router-dom";
import Button from "../../components/buttons/Button";
import { useTranslation } from "react-i18next";

const apiClient = new APIClient(endPoints.users);

const column = [
  { name: "username", headerName: "username", sort: true },
  { name: "role", headerName: "role" },
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
  {
    name: "actions",
    headerName: "actions",
    getCell: ({ row }) => (
      <Link className="center" to={pagesRoute.user.password(row?.id)}>
        <Button btnStyleType="outlined">
          <i className="fa-solid fa-key" />
          update password
        </Button>
      </Link>
    ),
  },
];
const AllUsers = () => {
  const [page, setPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.users, limit, page, search, role, sort],
    queryFn: () =>
      apiClient.getAll({
        page,
        limit,
        ...formatInputsData({ search, role }),
        sort,
      }),
  });
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1 className="title">{t("users.all_users")}</h1>
      <div className="table-container">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.users}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.users}
            />
            <Add path={pagesRoute.user.add} />
          </AllowedTo>
          <Filters>
            <SelectOptionInput
              placeholder={role?.text || "all roles"}
              label="role"
              options={[
                { text: "admin", value: roles.admin },
                { text: "teacher", value: roles.teacher },
                { text: "student", value: roles.student },
              ]}
              addOption={<h3 onClick={() => setRole("")}> all roles </h3>}
              onSelectOption={(opt) => setRole(opt)}
            />
          </Filters>
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

export default AllUsers;
