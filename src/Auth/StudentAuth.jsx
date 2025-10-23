import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const StudentAuth = () => {
  const { userDetails } = useAuth();
  const isStudent = userDetails?.isStudent;
  const location = useLocation();
  return isStudent ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/not_found"} />
  );
};

export default StudentAuth;
