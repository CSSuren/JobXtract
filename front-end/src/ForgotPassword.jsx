import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
      );
      alert(response.data.message);
      navigate(`/reset-password/${email}`);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="container bg-white p-4 shadow rounded"
        style={{ maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Forgot Password</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          className="btn btn-danger w-100 fw-bold"
          onClick={handleEmailSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ForgotPassword;
