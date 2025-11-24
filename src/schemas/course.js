import * as yup from "yup";
export const courseSchema = yup.object({
  name: yup.string().required("error.name_required"),
  code: yup.string().required("error.code_required"),
  description: yup.string().notRequired(),
  teacherId: yup.array(),
});
