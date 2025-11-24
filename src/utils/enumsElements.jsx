import { genders, roles } from "../constants/enums";

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

export const gendersStyle = {
  [genders.male]: {
    icon: (
      <i
        className="fas fa-female"
        style={{ color: "violet", fontSize: "14px" }}
      />
    ),
    color: "violet",
  },
  [genders.female]: {
    icon: (
      <i className="fas fa-male" style={{ color: "blue", fontSize: "14px" }} />
    ),
    color: "blue",
  },
};
