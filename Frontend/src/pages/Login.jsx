import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginForm({ onLogin, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Invalid credentials");
      const data = await res.json();
      
      // Pass navigate function to login
      onLogin(data, navigate);
      onClose();
    } catch (e) {
      setErrMsg("Login failed. Please check credentials.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50"> 
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-white/80 to-cyan-50/80 p-8 rounded-2xl shadow-2xl max-w-sm w-full space-y-5 border border-white/40"
      >
      
        <h2 className="text-3xl font-extrabold text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
          AquaLink Login
        </h2>

        {errMsg && <div className="text-red-500 text-sm text-center">{errMsg}</div>}

        <input
          type="email"
          required
          placeholder="Email address"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-lg px-4 py-2 border border-cyan-300 focus:ring-2 focus:ring-cyan-400 outline-none transition"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
          >
            Login
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 pt-2">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-cyan-600 hover:text-cyan-800 font-medium"
          >
            Sign up here
          </a>
        </p>
      </form>
    </div>
  );
}

export default LoginForm;
