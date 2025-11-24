import * as yup from "yup";
import { genders } from "../constants/enums";
export const studentSchema = yup.object({
  firstName: yup.string().required("error.first_name_required"),
  middleName: yup.string().required("error.middle_name_required"),
  lastName: yup.string().required("error.last_name_required"),
  dateOfBirth: yup.date().required("error.date_of_birth_required"),
  phone: yup.string().notRequired(),
  email: yup.string().email("error.email_invalid").notRequired(),
  gender: yup
    .string()
    .required("error.please_choose_gender")
    .oneOf(Object.values(genders)),
  address: yup.string().notRequired(),
  enrollmentDate: yup.date().notRequired(),
  guardianName: yup.string().notRequired(),
  guardianPhone: yup.string().notRequired(),
  guardianRelationship: yup.string().notRequired(),
});
