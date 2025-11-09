import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../../constants/endPoints";
import { limit, roles } from "../../../constants/enums";
import TableToolBar from "../../../components/table_toolbar/TableToolBar";
import Search from "../../../components/table_toolbar/Search";
import Table from "../../../components/table/Table";
import dateFormatter from "../../../utils/dateFormatter";
import { Link, useNavigate, useParams } from "react-router-dom";
import APIClient from "../../../utils/ApiClient";
import IconButton from "../../../components/buttons/IconButton";
import { pagesRoute } from "../../../constants/pagesRoute";
import AllowedTo from "../../../components/AllowedTo";
import Delete from "../../../components/table_toolbar/Delete";
import Filters from "../../../components/table_toolbar/Filters";
import SelectOptionInput from "../../../components/inputs/SelectOptionInput";
import Button from "../../../components/buttons/Button";
import { useAuth } from "../../../context/AuthContext";
import { formatInputsData } from "../../../utils/formatInputsData";

const apiClient = new APIClient(endPoints.exams);
const CourseExams = () => {
  const [page, setPage] = useState(1);
  const { id } = useParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({});
  const [filters, setFilters] = useState({});
  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints.exams,
      page,
      search,
      sort,
      id,
      formatInputsData(filters),
    ],
    queryFn: () =>
      apiClient.getAll({
        page,
        search,
        sort,
        limit,
        courseId: id,
        ...formatInputsData(filters),
      }),
  });

  const { userDetails } = useAuth();
  const { isAdmin } = userDetails || false;

  const nav = useNavigate();
  const [selectedItems, setSelectedItems] = useState(new Set());

  const navigateAddExamPage = useCallback(() => {
    nav(pagesRoute.exam.add, { state: { courseId: id } });
  }, [nav, id]);

  const dateKey = Object.keys(filters).find((key) => key.includes("date"));
  const dateText = dateKey ? filters[dateKey].text : null;

  const [isOpen, setIsOpen] = useState(false);

  const column = useMemo(
    () => [
      {
        name: "title",
        headerName: "title",
        sort: true,
      },
      {
        name: "date",
        headerName: "date",
        sort: true,
        getCell: ({ row }) => dateFormatter(row.date, "fullDate"),
      },
      {
        name: "duration",
        headerName: "duration",
        sort: true,
      },
      {
        name: "totalMarks",
        headerName: "totalMarks",
        sort: true,
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
        allowedTo: [roles.admin, roles.teacher],
        getCell: ({ row }) => (
          <div className="flex gap-10 align-center">
            <Link to={pagesRoute.exam.update(row?._id)}>
              <Button btnStyleType="outlined"> update</Button>
            </Link>
            {new Date(row.date).getTime() >= Date.now() && (
              <Button btnStyleType="outlined" btnType="save">
                add result
              </Button>
            )}
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="table-container flex-1">
      <TableToolBar>
        <Search setSearch={setSearch} />
        <AllowedTo roles={[roles.admin, roles.teacher]}>
          {isAdmin && (
            <Delete
              queryKey={endPoints.exams}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.exams}
            />
          )}
          <IconButton
            color="secondry-color"
            title="Add"
            onClick={navigateAddExamPage}
          >
            <i className="fa-solid fa-plus" />
          </IconButton>
        </AllowedTo>
        <Filters>
          <SelectOptionInput
            label="exam type"
            addOption={<h3 onClick={() => setFilters({})}>any type</h3>}
            options={[
              { text: "finished", value: Date.now(), enum: "date[lt]" },
              { text: "not finished", value: Date.now(), enum: "date[gte]" },
            ]}
            placeholder={dateText || "any type"}
            onSelectOption={(opt) => setFilters({ [opt.enum]: opt })}
          />
        </Filters>
      </TableToolBar>
      <Table
        colmuns={column}
        currentPage={page}
        data={data?.data}
        dataLength={data?.totalCount}
        loading={isFetching}
        selectable={isAdmin}
        setPage={setPage}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setSort={setSort}
      />
    </div>
  );
};

export default CourseExams;
