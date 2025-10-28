import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FooterLinks from "./footerLinks";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          fullName: name,
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      setSuccess("Sign-up successful!");
      navigate("/dashboard");
    } catch (error) {
      setError(error.response ? error.response.data.message : "Sign-up failed");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="container bg-white p-4 shadow rounded animate__animated animate__fadeInDown"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">New Here? Sign Up</h2>
        {error && <p className="text-danger text-center mb-3">{error}</p>}
        {success && <p className="text-success text-center mb-3">{success}</p>}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="password-container">
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-danger w-100 fw-bold" onClick={handleSignUp}>
          Sign Up
        </button>
        <FooterLinks isSignUp={true} />
      </div>
    </div>
  );
}

export default SignUp;
