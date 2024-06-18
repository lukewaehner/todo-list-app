"use client";

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserContext } from "../lib/utils/UserProvider";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/users/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      const userRes = await axios.get("http://localhost:5001/api/users/me", {
        headers: { "x-auth-token": res.data.token },
      });
      setUser(userRes.data);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid credentials");
      console.log(err);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center select-none overflow-hidden"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className={`bg-white p-6 rounded-xl drop-shadow-2xl shadow-md ease-in-out transition-all duration-300 hover:shadow-2xl w-80 z-10 border-2 border-charcoal-200 border-opacity-50`}
      >
        <h2 className="text-2xl mb-4 text-darkgreen-600 text-center">Login</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-charcoal-200 mb-2 font-semibold">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-charcoal-200 mb-2 font-semibold">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-slategray-500 text-white p-2 rounded mb-4 transition-transform transform hover:scale-105"
        >
          Login
        </button>
        <div className="mb-4">
          <label className="block text-charcoal-200 mb-2 font-semibold">
            Don't have an account?
          </label>

          <button
            type="button"
            onClick={handleRegister}
            className="w-full bg-gray-300 text-slategray-500 p-2 rounded transition-transform transform hover:scale-105"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
