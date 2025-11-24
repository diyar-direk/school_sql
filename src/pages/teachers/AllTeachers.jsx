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
import { genders, limit, roles } from "../../constants/enums";
import Button from "../../components/buttons/Button";
import { pagesRoute } from "./../../constants/pagesRoute";
import Add from "../../components/table_toolbar/Add";
import Filters from "./../../components/table_toolbar/Filters";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { formatInputsData } from "./../../utils/formatInputsData";
import AllowedTo from "../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const column = [
  {
    name: "firstName",
    headerName: "name",
    sort: true,
    getCell: ({ row }) => (
      <Link className="visit-text" to={pagesRoute.teacher.view(row.id)}>
        {row.firstName} {row.middleName} {row.lastName}
      </Link>
    ),
  },
  { name: "gender", headerName: "gender" },
  { name: "phoneNumber", headerName: "phoneNumber" },
  { name: "email", headerName: "email", hidden: true },
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
    className: "center",
    allowedTo: [roles.admin],
    getCell: ({ row, t }) => (
      <div className="center gap-10">
        <Link to={pagesRoute.teacher.update(row.id)}>
          <Button> {t("update")}</Button>
        </Link>
        <Link to={pagesRoute.teacher.view(row.id)}>
          <Button btnType="save"> {t("view")}</Button>
        </Link>
      </div>
    ),
  },
];
const apiClient = new APIClient(endPoints.teachers);
const AllTeachers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const [gender, setGender] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.teachers, page, search, sort, gender],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        ...formatInputsData({ gender }),
      }),
  });
  const [selectedItems, setSelectedItems] = useState(new Set());
  const { userDetails } = useAuth();
  const { role } = userDetails || "";
  const { t } = useTranslation();

  return (
    <div className="container">
      <h1 className="title">{t("teachers.all_teachers")}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.teachers}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.teachers}
            />
            <Add path={pagesRoute.teacher.add} />
          </AllowedTo>
          <Filters>
            <SelectOptionInput
              placeholder={gender?.text || "any gender"}
              label="geadner"
              options={[
                { text: "male", value: genders.male },
                { text: "female", value: genders.female },
              ]}
              addOption={<h3 onClick={() => setGender("")}> any gender </h3>}
              onSelectOption={(opt) => setGender(opt)}
            />
          </Filters>
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

export default AllTeachers;
