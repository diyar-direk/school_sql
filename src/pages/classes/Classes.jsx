import { useCallback, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Table from "../../components/table/Table";
import TableToolBar from "../../components/table_toolbar/TableToolBar";
import Search from "../../components/table_toolbar/Search";
import Delete from "../../components/table_toolbar/Delete";
import APIClient from "./../../utils/ApiClient";
import { endPoints } from "./../../constants/endPoints";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { limit, roles } from "../../constants/enums";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
import { useFormik } from "formik";
import { classesSchema } from "../../schemas/classes";
import Input from "../../components/inputs/Input";
import { useTranslation } from "react-i18next";
const apiClient = new APIClient(endPoints.classes);

const Classes = () => {
  const { userDetails } = useAuth();
  const [page, setPage] = useState(1);
  const isAdmin = userDetails?.isAdmin;
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const { data, isFetching } = useQuery({
    queryKey: [endPoints.classes, page, limit, sort, search],
    queryFn: () => apiClient.getAll({ limit, page, sort, search }),
  });
  const [isUpdate, setIsUpdate] = useState(false);
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: { name: isUpdate?.name || "" },
    enableReinitialize: true,
    validationSchema: classesSchema,
    onSubmit: (values) =>
      (isUpdate ? handleUpdate : handleCreate).mutate(values),
  });

  const handleSuccess = useCallback(() => {
    queryClient.invalidateQueries([endPoints.classes]);
    setIsUpdate(false);
    formik.resetForm();
  }, [queryClient, formik]);

  const handleUpdate = useMutation({
    mutationFn: (data) => apiClient.updateData({ data, id: isUpdate?.id }),
    onSuccess: handleSuccess,
  });
  const handleCreate = useMutation({
    mutationFn: (data) => apiClient.addData(data),
    onSuccess: handleSuccess,
  });

  const [selectedItems, setSelectedItems] = useState(new Set());
  const { t } = useTranslation();

  const column = useMemo(
    () => [
      { name: "name", headerName: "name", sort: true },
      {
        name: "createdAt",
        headerName: "createdAt",
        sort: true,
        allowedTo: [roles.admin],
        getCell: ({ row }) => dateFormatter(row.createdAt, "fullDate"),
      },
      {
        name: "updatedAt",
        headerName: "updatedAt",
        sort: true,
        hidden: true,
        allowedTo: [roles.admin],
        getCell: ({ row }) => dateFormatter(row.updatedAt, "fullDate"),
      },
      {
        name: "actions",
        headerName: "actions",
        className: "center",
        getCell: ({ row }) => (
          <Button onClick={() => setIsUpdate(row)}>
            <i className="fa-regular fa-pen-to-square"></i> update
          </Button>
        ),
        allowedTo: [roles.admin],
      },
    ],
    []
  );

  return (
    <div className="container">
      <h1 className="title">{t("class.all_classes")}</h1>
      <div className="flex align-start wrap subjects gap-20">
        {isAdmin && (
          <form className="table-form" onSubmit={formik.handleSubmit}>
            <h1> {t("class.add_new_class")}</h1>
            <Input
              title={t("class.name")}
              errorText={formik?.errors?.name}
              placeholder={t("class.name_placeholder")}
              name="name"
              onChange={formik.handleChange}
              value={formik?.values?.name}
            />
            <div className="actions">
              <Button>save</Button>
              {isUpdate && (
                <Button btnType="cancel" onClick={() => setIsUpdate(false)}>
                  cancle
                </Button>
              )}
            </div>
          </form>
        )}

        <div className="table-container flex-1">
          <TableToolBar>
            <Search setSearch={setSearch} />
            {isAdmin && (
              <Delete
                queryKey={endPoints.classes}
                data={data}
                selectedItems={selectedItems}
                setPage={setPage}
                setSelectedItems={setSelectedItems}
                endPoint={endPoints.classes}
              />
            )}
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
      </div>
    </div>
  );
};

export default Classes;
