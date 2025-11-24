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
        style={{ color: "#b510b5", fontSize: "14px" }}
      />
    ),
    color: "#b510b5",
  },
  [genders.female]: {
    icon: (
      <i
        className="fas fa-male"
        style={{ color: "#1717a4", fontSize: "14px" }}
      />
    ),
    color: "#1717a4",
  },
};
