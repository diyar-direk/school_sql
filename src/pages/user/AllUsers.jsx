import { useContext, useState } from "react";
import { Context } from "../../context/Context";
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

const apiClient = new APIClient(endPoints.users);

const column = [
  { name: "username", headerName: "username", sort: true },
  { name: "role", headerName: "role" },
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
];
const AllUsers = () => {
  const context = useContext(Context);
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
  const language = context?.selectedLang;

  return (
    <div className="container">
      <h1 className="title">{language.users && language.users.all_users}</h1>
      <div className="table-container">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <Delete
            queryKey={endPoints.users}
            data={data}
            selectedItems={selectedItems}
            setPage={setPage}
            setSelectedItems={setSelectedItems}
            endPoint={endPoints.users}
          />
          <Add path={pagesRoute.user.add} />
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
          dataLength={data?.numverOfAcriveUsers}
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
