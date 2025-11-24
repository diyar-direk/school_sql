import * as yup from "yup";
import { dayes } from "../constants/enums";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const timeTableSchema = yup.object({
  classId: yup.object().required("error.please_choose_class"),
  courseId: yup.object().required("error.please_choose_subject"),
  dayOfWeek: yup
    .string()
    .required("error.please_choose_day")
    .oneOf(Object.values(dayes)),
  startTime: yup
    .string()
    .required("error.start_time_required")
    .matches(timeRegex, "error.invalid_time_format")
});
