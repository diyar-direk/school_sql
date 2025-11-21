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
      <Link className="visit-text" to={pagesRoute.student.view(row.id)}>
        {row.firstName} {row.middleName} {row.lastName}
      </Link>
    ),
  },
  { name: "gender", headerName: "gender" },
  {
    name: "dateOfBirth",
    headerName: "dateOfBirth",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.dateOfBirth),
  },
  { name: "address", headerName: "address" },
  { name: "phone", headerName: "phone" },
  { name: "email", headerName: "email", hidden: true },
  {
    name: "enrollmentDate",
    headerName: "enrollmentDate",
    sort: true,
    getCell: ({ row }) => dateFormatter(row.enrollmentDate),
  },
  {
    name: "guardianName",
    headerName: "guardianName",
    hidden: true,
  },
  {
    name: "guardianRelationship",
    headerName: "guardianRelationship",
    hidden: true,
  },
  {
    name: "guardianPhone",
    headerName: "guardianPhone",
    hidden: true,
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
    className: "center",
    allowedTo: [roles.admin],
    getCell: ({ row }) => (
      <div className="center gap-10">
        <Link to={pagesRoute.student.update(row.id)}>
          <Button> update</Button>
        </Link>
        <Link to={pagesRoute.student.view(row.id)}>
          <Button btnType="save"> view</Button>
        </Link>
      </div>
    ),
  },
];
const apiClient = new APIClient(endPoints.students);

const AllStudents = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const [gender, setGender] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.students, page, search, sort, gender],
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

  const { t } = useTranslation();

  const { userDetails } = useAuth();
  const { role } = userDetails || {};

  return (
    <div className="container">
      <h1 className="title">{t("students.all_students")}</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <Search setSearch={setSearch} />
          <AllowedTo roles={[roles.admin]}>
            <Delete
              queryKey={endPoints.students}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.students}
            />
            <Add path={pagesRoute.student.add} />
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

export default AllStudents;
