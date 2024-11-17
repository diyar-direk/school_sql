import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Context } from "../context/Context";

const StudentAuth = () => {
  const context = useContext(Context);
  const isStudent = context && context.userDetails.isStudent;
  const location = useLocation();
  return isStudent ? (
    <Outlet />
  ) : (
    <Navigate state={{ from: location }} replace to={"/dashboard/not_found"} />
  );
};

export default StudentAuth;
