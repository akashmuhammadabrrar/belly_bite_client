import axios from "axios";
import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: "https://bistro-boss-restaurant-server-gray-chi.vercel.app",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  // request interceptors to add authorization header for every secure call to the api
  axiosSecure.interceptors.request.use(
    function (config) {
      const token = localStorage.getItem("access-token");
      // console.log("request stopped by interceptors", token);
      config.headers.authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      //
      return Promise.reject(error);
    }
  );

  // intercepts 401 and status
  axiosSecure.interceptors.response.use(
    function (response) {
      return response;
    },
    async (error) => {
      const status = error.response.status;
      // console.log("status error in the interceptor", status);
      // for 401 and 403 logged out the user and moved the user to the login page
      if (status === 401 || 403) {
        await logoutUser();
        navigate("/login");
      }
      return Promise(error);
    }
  );

  return axiosSecure;
};

export default useAxiosSecure;
