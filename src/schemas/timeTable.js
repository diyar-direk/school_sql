import * as yup from "yup";
import { dayes } from "../constants/enums";

export const timeTableSchema = yup.object({
  classId: yup.object().required("class is required"),
  courseId: yup.object().required("course is required"),
  dayOfWeek: yup
    .string()
    .required("day is required")
    .oneOf(Object.values(dayes)),
  startTime: yup.date().required("please select course start time"),
});
