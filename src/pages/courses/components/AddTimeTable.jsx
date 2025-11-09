import { useFormik } from "formik";
import PopUp from "../../../components/popup/PopUp";
import SelectInputApi from "../../../components/inputs/SelectInputApi";
import Input from "../../../components/inputs/Input";
import { endPoints } from "../../../constants/endPoints";
import "../../students/student.css";
import Button from "../../../components/buttons/Button";
import { useCallback } from "react";
import APIClient from "../../../utils/ApiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatInputsData } from "../../../utils/formatInputsData";
import * as yup from "yup";
const apiClient = new APIClient(endPoints["time-table"]);

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const AddTimeTable = ({
  day,
  setIsOpen,
  isOpen,
  isUpdate,
  setIsUpdate,
  courseId,
}) => {
  const formik = useFormik({
    initialValues: {
      classId: isUpdate?.classId || "",
      courseId,
      dayOfWeek: day,
      startTime: isUpdate?.startTime || "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      classId: yup.object().required("class is required"),
      startTime: yup
        .string()
        .required("please select course start time")
        .matches(timeRegex, "invalid time format, use HH:mm"),
    }),
    onSubmit: (values) => handleConfirm.mutate(values),
  });
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setIsUpdate(false);
  }, [setIsOpen, setIsUpdate]);
  const query = useQueryClient();

  const handleConfirm = useMutation({
    mutationFn: (data) =>
      isUpdate
        ? apiClient.updateData({
            data: formatInputsData(data),
            id: isUpdate?._id,
          })
        : apiClient.addData(formatInputsData(data)),
    onSuccess: () => {
      query.invalidateQueries([endPoints["time-table"], day]);
      formik.resetForm();
      handleClose();
    },
  });

  return (
    <PopUp
      className="add-course-popup"
      isOpen={isOpen || isUpdate}
      onClose={handleClose}
    >
      <form onSubmit={formik.handleSubmit}>
        <SelectInputApi
          endPoint={endPoints.classes}
          label="class"
          optionLabel={(e) => e?.name}
          placeholder={formik.values?.classId?.name || "select class"}
          onChange={(e) => formik.setFieldValue("classId", e)}
          errorText={formik?.errors?.classId}
        />
        <Input
          title="start time"
          type="time"
          name="startTime"
          onChange={formik.handleChange}
          value={formik.values?.startTime}
          errorText={formik.errors?.startTime}
        />

        <div className="actions">
          <Button type="submit" isSending={handleConfirm.isPending}>
            save
          </Button>
          <Button btnType="cancel" type="button" onClick={handleClose}>
            cancel
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default AddTimeTable;
