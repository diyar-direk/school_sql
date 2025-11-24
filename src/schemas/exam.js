import * as yup from "yup";
export const examSchema = yup.object({
  title: yup.string().required("error.title_required"),

  courseId: yup
    .mixed()
    .required("error.please_choose_subject")
    .test("is-valid-course", "Invalid course value", (value) => {
      if (typeof value === "object" && value !== null) {
        return !!value.id;
      }
      if (typeof value === "number") {
        return value > 0;
      }
      return false;
    }),

  date: yup.date().required("error.start_time_required"),

  duration: yup
    .number()
    .required("error.write_duration_in_minutes")
    .min(0, "error.can_not_be_negative_value"),

  totalMarks: yup
    .number()
    .required("error.write_total_mark")
    .min(0, "error.can_not_be_negative_value"),
});
