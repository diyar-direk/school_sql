import * as yup from "yup";
import { roles } from "../constants/enums";
export const usersSchema = yup.object({
  username: yup
    .string()
    .required("error.username_required")
    .min(3, "error.minimum_3_characters")
    .max(50, "error.maximum_50_characters"),
  password: yup
    .string()
    .required("error.password_required")
    .min(6, "error.minimum_6_characters"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "error.passwords_must_match")
    .required("error.passwords_must_match"),
  role: yup
    .string()
    .required("error.please_choose_role")
    .oneOf(Object.values(roles)),
  profileId: yup.object().required("error.profile_required"),
});
