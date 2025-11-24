import { roles } from "../constants/enums";

export const rolesStyle = {
  [roles.admin]: {
    icon: (
      <i
        className="fa-solid fa-lock"
        style={{ color: "green", fontSize: "14px" }}
      />
    ),
    color: "green",
  },
  [roles.teacher]: {
    icon: (
      <i
        className="fas fa-chalkboard-teacher"
        style={{ color: "blue", fontSize: "14px" }}
      />
    ),
    color: "blue",
  },
  [roles.student]: {
    icon: (
      <i
        className="fas fa-user-graduate"
        style={{ color: "orange", fontSize: "14px" }}
      />
    ),
    color: "orange",
  },
};
