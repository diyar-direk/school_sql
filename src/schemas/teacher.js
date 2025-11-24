import * as yup from "yup";
import { genders } from "../constants/enums";
export const teacherSchema = yup.object({
  firstName: yup.string().required("error.first_name_required"),
  middleName: yup.string().required("error.middle_name_required"),
  lastName: yup.string().required("error.last_name_required"),
  email: yup
    .string()
    .required("error.email_required")
    .email("error.email_invalid"),
  gender: yup
    .string()
    .required("error.please_choose_gender")
    .oneOf(Object.values(genders)),
  phoneNumber: yup.string().notRequired(),
});
