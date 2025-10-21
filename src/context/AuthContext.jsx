import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../utils/axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const [userDetails, setUserDetails] = useState(null);

  const logout = useCallback(() => {
    setUserDetails(null);
    Cookies.remove("school-token");
    nav("/login");
  }, [nav]);
  const token = Cookies.get("school-token");

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        if (config.method !== "get") {
          setLoading(true);
        }
        return config;
      },
      (error) => {
        setLoading(false);

        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoading(false);
        if (response.config.method !== "get") {
          const message =
            response?.data?.message || "Operation done successfully";

          toast.success(message);
        }
        return response;
      },
      (error) => {
        setLoading(false);
        const message =
          error?.response?.data?.message ||
          error?.data?.message ||
          "Something went wrong";
        toast.error(message);
        if (error.status === 401 || error.status === 403) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout]);

  const [userLoading, setUserLoading] = useState(true);

  const getUserDetails = useCallback(async () => {
    try {
      setUserLoading(true);
      const { data } = await axiosInstance.get(`users/profile`);
      const isAdmin = data?.user?.role === "Admin";
      const isTeacher = data?.user?.role === "Teacher";
      const isStudent = data?.user?.role === "Student";
      return setUserDetails({
        isAdmin,
        isTeacher,
        isStudent,
        ...data?.user,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && !userDetails) {
      getUserDetails();
    }
  }, [token, getUserDetails, userDetails]);

  if (userLoading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{ userDetails, setUserDetails, logout, userLoading }}
    >
      {children}
      {loading && <Loader />}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
