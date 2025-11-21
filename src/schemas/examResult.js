import * as yup from "yup";
import { examTypes } from "../constants/enums";
export const examResultSchema = yup.object({
  studentId: yup.object().required("you must choose a student"),
  type: yup
    .string()
    .required("please select exam type")
    .oneOf(Object.values(examTypes)),
  examId: yup
    .mixed()
    .required("You must choose the test material")
    .test("is-valid-course", "Invalid course value", (value) => {
      if (typeof value === "object" && value !== null) {
        return !!value.id;
      }
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      return false;
    }),
  score: yup
    .number()
    .required("please write student score")
    .min(0, "score can not be neagtive number"),
});
