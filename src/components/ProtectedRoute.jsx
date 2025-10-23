import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import { useContext } from "react";
import { Context } from "../context/Context";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const context = useContext(Context);
  const { userDetails, userLoading } = useAuth();

  if (!userLoading && !userDetails) return <Navigate to={"/login"} replace />;
  return (
    <>
      <Navbar />
      <main>
        <div
          className={`${
            context?.isClosed ? "closed" : ""
          }  dashboard-container`}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default ProtectedRoute;
