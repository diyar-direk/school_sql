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
import { roles } from "../constants/enums";
import { endPoints } from "../constants/endPoints";
import { pagesRoute } from "../constants/pagesRoute";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const nav = useNavigate();

  const logout = useCallback(() => {
    setUserDetails(null);
    Cookies.remove("refreshToken");
    nav(pagesRoute.login);
  }, [nav]);

  useEffect(() => {
    let isRefreshing = false;
    let refreshSubscribers = [];

    const onRefreshed = (newToken) => {
      refreshSubscribers.forEach((cb) => cb(newToken));
      refreshSubscribers = [];
    };

    const addSubscriber = (cb) => {
      refreshSubscribers.push(cb);
    };

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = Cookies.get("accessToken");
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (config.method !== "get") setLoading(true);
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
            response?.data?.message || "Operation done successfully ✅";
          toast.success(message);
        }
        return response;
      },
      async (error) => {
        setLoading(false);
        const originalRequest = error.config;
        const status = error.response?.status;

        if (status === 403 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (isRefreshing) {
            return new Promise((resolve) => {
              addSubscriber((newToken) => {
                console.log(newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(axiosInstance(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            const { data } = await axiosInstance.post(
              endPoints["refresh-token"],
              {},
              { withCredentials: true }
            );
            const newAccessToken = data.accessToken;

            Cookies.set("accessToken", newAccessToken);
            axiosInstance.defaults.headers.common.Authorization =
              "Bearer " + newAccessToken;

            onRefreshed(newAccessToken);

            return axiosInstance(originalRequest);
          } catch (err) {
            logout();
            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        const message =
          error?.response?.data?.message ||
          error?.data?.message ||
          "Something went wrong";
        toast.error(message);

        if (status === 401) logout();

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  const getUserDetails = useCallback(async () => {
    try {
      setUserLoading(true);
      const { data: user } = await axiosInstance.get(
        endPoints.profile,
        {},
        { withCredentials: true }
      );
      const { user: data } = user;

      const isAdmin = data.role === roles.admin;
      const isTeacher = data.role === roles.teacher;
      const isStudent = data.role === roles.student;

      const myProfilePath = isAdmin
        ? pagesRoute.admin.view(data?._id)
        : isTeacher
        ? pagesRoute.teacher.view(data?.profileId?._id)
        : pagesRoute.student.view(data?.profileId?._id);

      setUserDetails({
        isAdmin,
        isTeacher,
        isStudent,
        myProfilePath,
        ...data,
      });
    } catch (error) {
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserDetails();
  }, [getUserDetails]);

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
