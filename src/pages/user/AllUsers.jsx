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
import { rolesStyle } from "../../utils/enumsElements";

const apiClient = new APIClient(endPoints.users);

const column = [
  { name: "username", headerName: "login.user_name", sort: true },
  {
    name: "role",
    headerName: "users.role",
    getCell: ({ row, t }) => (
      <div
        className="gap-10 center"
        style={{ color: rolesStyle[row.role]?.color }}
      >
        {rolesStyle[row.role]?.icon} {t(`enums.${row.role}`)}
      </div>
    ),
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
  {
    name: "actions",
    headerName: "actions",
    getCell: ({ row, t }) => (
      <Link className="center" to={pagesRoute.user.password(row?.id)}>
        <Button btnStyleType="outlined">
          <i className="fa-solid fa-key" />
          {t("users.update_password")}
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
              placeholder={t(role ? `enums.${role}` : "filters.all")}
              label="role"
              options={[
                {
                  text: (
                    <span
                      className="flex align-center gap-10"
                      style={{ color: rolesStyle[roles.admin]?.color }}
                    >
                      {rolesStyle[roles.admin]?.icon}
                      {t(`enums.${roles.admin}`)}
                    </span>
                  ),
                  value: roles.admin,
                },
                {
                  text: (
                    <span
                      className="flex align-center gap-10"
                      style={{ color: rolesStyle[roles.teacher]?.color }}
                    >
                      {rolesStyle[roles.teacher]?.icon}
                      {t(`enums.${roles.teacher}`)}
                    </span>
                  ),
                  value: roles.teacher,
                },
                {
                  text: (
                    <span
                      className="flex align-center gap-10"
                      style={{ color: rolesStyle[roles.student]?.color }}
                    >
                      {rolesStyle[roles.student]?.icon}
                      {t(`enums.${roles.student}`)}
                    </span>
                  ),
                  value: roles.student,
                },
              ]}
              addOption={
                <h3 onClick={() => setRole("")}>{t("filters.all")}</h3>
              }
              onSelectOption={(opt) => setRole(opt.value)}
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
