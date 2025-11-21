import * as yup from "yup";
export const examSchema = yup.object({
  title: yup.string().required("exam title is required"),

  courseId: yup
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

  date: yup.date().required("exam date is required"),

  duration: yup
    .number()
    .required("write exam duration in minutes")
    .min(0, "duration can not be negative value"),

  totalMarks: yup
    .number()
    .required("please write exam total mark")
    .min(0, "total mark can not be negative value"),
});
