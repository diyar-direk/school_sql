import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import { examTypes, limit, roles } from "../../constants/enums";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Delete from "../../components/table_toolbar/Delete";
import Add from "../../components/table_toolbar/Add";
import { pagesRoute } from "../../constants/pagesRoute";
import Table from "../../components/table/Table";
import dateFormatter from "../../utils/dateFormatter";
import { Link, useLocation } from "react-router-dom";
import Button from "../../components/buttons/Button";
import APIClient from "../../utils/ApiClient";
import Filters from "./../../components/table_toolbar/Filters";
import SelectInputApi from "./../../components/inputs/SelectInputApi";
import { formatInputsData } from "./../../utils/formatInputsData";
import AllowedTo from "../../components/AllowedTo";
import { useAuth } from "../../context/AuthContext";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import AddExamResultPopup from "./AddExamResultPopup";

const column = [
  {
    name: "studentId",
    headerName: "studentId",
    getCell: ({ row }) => (
      <Link
        className="visit-text"
        to={pagesRoute.student.view(row?.studentId?._id)}
      >
        {row?.studentId?.firstName} {row?.studentId?.middleName}
        {row?.studentId?.lastName}
      </Link>
    ),
  },
  {
    name: "examId",
    headerName: "examId",
    getCell: ({ row }) => row.examId?.title,
  },
  {
    name: "type",
    headerName: "type",
    getCell: ({ row }) => (
      <span
        className="center gap-10"
        style={{ color: row.type === examTypes.Exam ? "green" : "orange" }}
      >
        {row.type === examTypes.Exam ? (
          <i className="fa-solid fa-list-check" style={{ fontSize: "13px" }} />
        ) : (
          <i className="fa-solid fa-pencil" style={{ fontSize: "13px" }} />
        )}
        {row.type}
      </span>
    ),
  },
  {
    name: "score",
    headerName: "score",
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
      <Link to={pagesRoute.examResult.update(row?._id)}>
        <Button> update</Button>
      </Link>
    ),
  },
];
const apiClient = new APIClient(endPoints["exam-results"]);
const ExamResult = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState({});
  const { userDetails } = useAuth();
  const { isStudent, role, isAdmin } = userDetails || {};

  const { state } = useLocation();
  const { examId, courseId } = state || {};

  const [filters, setFilters] = useState({
    examId,
    studentId: isStudent ? userDetails?.profileId?._id : null,
    type: null,
  });
  const { data, isFetching } = useQuery({
    queryKey: [
      endPoints["exam-results"],
      page,
      sort,
      formatInputsData(filters),
    ],
    queryFn: () =>
      apiClient.getAll({
        page,
        sort,
        limit,
        ...formatInputsData(filters),
      }),
  });

  const [selectedItems, setSelectedItems] = useState(new Set());

  const handleStudentFilter = useMemo(
    () => ({
      endPoint: courseId ? endPoints["student-courses"] : endPoints.students,
      label: "student",
      placeholder: filters?.studentId
        ? `${filters?.studentId?.firstName} ${filters?.studentId?.lastName}`
        : "all students",
      optionLabel: (opt) => {
        if (courseId)
          return `${opt?.studentId?.firstName} ${opt?.studentId?.middleName} ${opt?.studentId?.lastName}`;
        else return `${opt?.firstName} ${opt?.middleName} ${opt?.lastName}`;
      },
      onChange: (opt) =>
        setFilters({ ...filters, studentId: courseId ? opt.studentId : opt }),
    }),
    [courseId, filters]
  );

  return (
    <div className="container">
      <h1 className="title">exams result</h1>
      <div className="table-container flex-1">
        <TableToolBar>
          <AllowedTo roles={[roles.teacher, roles.admin]}>
            <div className="flex-1"></div>
            <Delete
              queryKey={endPoints.exams}
              data={data}
              selectedItems={selectedItems}
              setPage={setPage}
              setSelectedItems={setSelectedItems}
              endPoint={endPoints.exams}
            />
            {courseId ? (
              <AddExamResultPopup examId={examId} />
            ) : (
              isAdmin && <Add path={pagesRoute.examResult.add} />
            )}
          </AllowedTo>
          <Filters>
            <AllowedTo roles={[roles.admin, roles.teacher]}>
              <SelectInputApi
                endPoint={handleStudentFilter.endPoint}
                label={handleStudentFilter.label}
                placeholder={handleStudentFilter.placeholder}
                optionLabel={handleStudentFilter.optionLabel}
                onChange={handleStudentFilter.onChange}
                addOption={
                  <h3
                    onClick={() => setFilters({ ...filters, studentId: null })}
                  >
                    all students
                  </h3>
                }
              />
            </AllowedTo>
            {!examId && (
              <AllowedTo roles={[roles.admin]}>
                <SelectInputApi
                  endPoint={endPoints.exams}
                  label="exam"
                  placeholder={filters?.examId?.title || "any exam"}
                  optionLabel={(opt) => opt?.title}
                  onChange={(opt) => setFilters({ ...filters, examId: opt })}
                  addOption={
                    <h3
                      onClick={() => setFilters({ ...filters, examId: null })}
                    >
                      any exam
                    </h3>
                  }
                />
              </AllowedTo>
            )}
            <SelectOptionInput
              addOption={
                <h3 onClick={() => setFilters({ ...filters, type: null })}>
                  any type
                </h3>
              }
              label="type"
              options={[
                { text: "exam", value: examTypes.Exam },
                { text: "quiz", value: examTypes.Quiz },
              ]}
              onSelectOption={(opt) => setFilters({ ...filters, type: opt })}
              placeholder={filters?.type?.text || "any type"}
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

export default ExamResult;
