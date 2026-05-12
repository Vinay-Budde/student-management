import { useState } from "react";

import api from "../api/axios";

import toast from "react-hot-toast";

import {
  useNavigate,
  Link
} from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const register = async () => {

    try {

      await api.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          username,
          password
        }
      );

      toast.success("Registration Successful");

      navigate("/");

    } catch (error) {
      console.error(error);
      toast.error("Registration Failed");
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
          text-green-600
        "
        >
          Create Account
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
          onClick={register}
          className="
            w-full
            bg-green-600
            text-white
            p-3
            rounded-lg
            hover:bg-green-700
            transition
          "
        >
          Register
        </button>

        <p
          className="
          text-center
          mt-5
        "
        >
          Already have account?

          <Link
            to="/"
            className="
            text-blue-600
            ml-2
            font-semibold
          "
          >
            Login
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;