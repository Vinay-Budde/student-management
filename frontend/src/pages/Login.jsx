import { useState } from "react";

import api from "../api/axios";

import toast from "react-hot-toast";

import {
  useNavigate,
  Link
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const login = async () => {

    try {

      await api.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username,
          password
        }
      );

      toast.success("Login Successful");
      localStorage.setItem(
        "isLoggedIn",
        "true"
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      toast.error("Invalid Credentials");
    }
  };

  return (

    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <div
        className="
        bg-white
        p-10
        rounded-2xl
        shadow-xl
        w-[400px]
      ">

        <h1
          className="
          text-3xl
          font-bold
          text-center
          mb-8
          text-blue-600
        "
        >
          Workers Management
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-4
            outline-none
          "
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)}
          className="
            w-full
            border
            p-3
            rounded-lg
            mb-6
            outline-none
          "
        />

        <button
          onClick={login}
          className="
            w-full
            bg-blue-600
            text-white
            p-3
            rounded-lg
            hover:bg-blue-700
            transition
          "
        >
          Login
        </button>

        <p
          className="
          text-center
          mt-5
        "
        >
          New User?

          <Link
            to="/register"
            className="
            text-blue-600
            ml-2
            font-semibold
          "
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Login;