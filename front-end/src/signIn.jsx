import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FooterLinks from "./footerLinks";

function SignIn({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Both fields are required");
      return;
    }

    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signIn",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", email); // Store email for later use
      onLogin();
      navigate("/dashboard");
    } catch (error) {
      setError(error.response ? error.response.data.message : "Login failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="container bg-white p-4 shadow rounded animate__animated animate__fadeInDown"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Welcome Back!</h2>
        {error && <p className="text-danger text-center mb-3">{error}</p>}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-danger w-100 fw-bold" onClick={handleSignIn}>
          Login
        </button>
        <FooterLinks isSignUp={false} />
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <button
            className="btn btn-link p-0"
            onClick={() => navigate("/signUp")}
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
