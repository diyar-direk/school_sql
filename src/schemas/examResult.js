import * as yup from "yup";
import { examTypes } from "../constants/enums";
export const examResultSchema = yup.object({
  studentId: yup.object().required("error.please_choose_student"),
  type: yup
    .string()
    .required("error.please_select_exam_type")
    .oneOf(Object.values(examTypes)),
  examId: yup
    .mixed()
    .required("error.please_choose_exam")
    .test("is-valid-course", "Invalid course value", (value) => {
      if (typeof value === "object" && value !== null) {
        return !!value.id;
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    }),
  score: yup
    .number()
    .required("error.please_write_student_score")
    .min(0, "error.can_not_be_negative_value"),
});
