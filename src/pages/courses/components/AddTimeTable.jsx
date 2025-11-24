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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {
      classId: isUpdate?.class || "",
      courseId,
      dayOfWeek: day,
      startTime: isUpdate?.startTime || "",
    },
    enableReinitialize: true,
    validationSchema: yup.object({
      classId: yup.object().required("error.please_choose_subject"),
      startTime: yup
        .string()
        .required("error.start_time_required")
        .matches(timeRegex, "error.invalid_time_format"),
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
            id: isUpdate?.id,
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
          label={t("error.Class")}
          optionLabel={(e) => e?.name}
          placeholder={
            formik.values?.classId?.name || t("attendance.class_placeholder")
          }
          onChange={(e) => formik.setFieldValue("classId", e)}
          errorText={t(formik?.errors?.classId)}
        />
        <Input
          title={t("timeTable.start_time")}
          type="time"
          name="startTime"
          onChange={formik.handleChange}
          value={formik.values?.startTime}
          errorText={t(formik?.errors?.startTime)}
        />

        <div className="actions">
          <Button type="submit" isSending={handleConfirm.isPending}>
            {t("save")}
          </Button>
          <Button btnType="cancel" type="button" onClick={handleClose}>
            {t("admins.cancel_btn")}
          </Button>
        </div>
      </form>
    </PopUp>
  );
};

export default AddTimeTable;
