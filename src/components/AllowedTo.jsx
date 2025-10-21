import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AllowedTo = ({ roles, children }) => {
  const { userDetails } = useAuth();

  return roles.includes(userDetails?.role) ? (
    <> {children} </>
  ) : (
    <Navigate replace to={"/not_found"} />
  );
};

export default AllowedTo;
