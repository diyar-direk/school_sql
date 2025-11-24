import * as Yup from "yup";
export const classesSchema = Yup.object({
  name: Yup.string().required("error.name_required"),
});
