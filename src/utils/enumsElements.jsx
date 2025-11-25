import { genders, roles } from "../constants/enums";

export const rolesStyle = {
  [roles.admin]: {
    icon: (
      <i
        className="fa-solid fa-lock"
        style={{ color: "green", fontSize: "80%" }}
      />
    ),
    color: "green",
  },
  [roles.teacher]: {
    icon: (
      <i
        className="fas fa-chalkboard-teacher"
        style={{ color: "blue", fontSize: "80%" }}
      />
    ),
    color: "blue",
  },
  [roles.student]: {
    icon: (
      <i
        className="fas fa-user-graduate"
        style={{ color: "orange", fontSize: "80%" }}
      />
    ),
    color: "orange",
  },
};

export const gendersStyle = {
  [genders.female]: {
    icon: (
      <i
        className="fas fa-female"
        style={{ color: "#b510b5", fontSize: "80%" }}
      />
    ),
    color: "#b510b5",
  },
  [genders.male]: {
    icon: (
      <i
        className="fas fa-male"
        style={{ color: "#1717a4", fontSize: "80%" }}
      />
    ),
    color: "#1717a4",
  },
};
