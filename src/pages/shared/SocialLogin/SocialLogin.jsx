import React from "react";
import { FaGoogle } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useNavigate } from "react-router-dom";

const SocialLogin = () => {
  const { singInGoogle } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogleSignIn = () => {
    singInGoogle().then((result) => {
      // console.log(result.user);
      const userInfo = {
        email: result.user?.email,
        name: result.user?.displayName,
      };
      axiosPublic
        .post("/users", userInfo)
        .then((res) => {
          // console.log(res.data);
          navigate("/");
        })
        .catch((error) => {
          // console.error(error.message);
        });
    });
  };
  return (
    <div>
      <button onClick={handleGoogleSignIn} className="btn btn-ghost w-[307px]">
        <FaGoogle /> Google
      </button>
    </div>
  );
};

export default SocialLogin;
