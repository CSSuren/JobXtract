import React, { useState, useEffect } from "react";
import axios from "axios";

function Profile() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [deletingJob, setDeletingJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem("email"); // Get logged-in user's email
        if (!userEmail) {
          console.error(
            "No email found in localStorage. Redirecting to sign-in..."
          );
          return;
        }

        const response = await axios.get(
          "http://localhost:5000/api/users/profile",
          { headers: { email: userEmail } } // Pass email in headers
        );
        const user = response.data.user;

        setFullName(user.fullName || "");
        setEmail(user.email || "");
        setPhone(user.phone || "");
        setLocation(user.location || "");
        setWebsite(user.website || "");
        setSavedJobs(user.savedJobs || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchData();
  }, []);

  const handleRemoveJob = async (jobTitle) => {
    setDeletingJob(jobTitle);
    try {
      setTimeout(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You need to sign in again.");
          return;
        }

        const response = await axios.delete(
          "http://localhost:5000/api/users/saved-jobs", // Correct route
          {
            headers: { Authorization: `Bearer ${token}` },
            data: { email, jobTitle }, // Pass email and jobTitle in the request body
          }
        );

        setSavedJobs(response.data.user.savedJobs);
      }, 500); // Smooth animation duration
    } catch (error) {
      console.error("Error removing job:", error);
    } finally {
      setDeletingJob(null);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      {/* Header */}
      <header className="navbar navbar-light bg-white shadow-sm fixed-top">
        <div
          className="container d-flex justify-content-between align-items-center"
          style={{ height: "48px" }}
        >
          <h1 className="h5 fw-bold">JobTrack</h1>
          <nav>
            <a
              href="/dashboard"
              className="text-secondary me-3 text-decoration-none"
            >
              Home
            </a>
            <a
              href="/profile"
              className="text-secondary text-decoration-none me-3"
            >
              Profile
            </a>
            <a
              onClick={() => {
                localStorage.clear();
                window.location.href = "/signIn";
              }}
              className="text-danger text-decoration-none"
              style={{ cursor: "pointer" }}
            >
              Logout
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="container pt-5 mt-5 d-flex gap-4 animate__animated animate__fadeInUp"
        style={{ animationDuration: "0.8s" }}
      >
        {/* Personal Information Section */}
        <div className="card p-4 shadow rounded flex-grow-1">
          <h2 className="fs-4 fw-bold mb-4">Personal Information</h2>
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label fw-bold">Full Name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                readOnly
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Phone</label>
              <input
                type="text"
                className="form-control"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">Location</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">
                Website/LinkedIn Profile
              </label>
              <input
                type="url"
                className="form-control"
                placeholder="https://www.linkedin.com/in/your-profile"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
          <button
            className="btn btn-danger mt-4 w-100"
            onClick={() => alert("Saved")}
          >
            Save Changes
          </button>
        </div>

        {/* Saved Jobs Section */}
        <div
          className="card p-4 shadow rounded"
          style={{
            width: "30%",
            backgroundColor: "#FFF",
          }}
        >
          <h2 className="fs-5 fw-bold mb-4" style={{ color: "#3E2723" }}>
            Saved Jobs
          </h2>
          <div
            className="overflow-auto"
            style={{
              maxHeight: "500px",
              overflowX: "hidden", // Ensure no horizontal scroll
              paddingRight: "10px", // Add space for the vertical scrollbar
            }}
          >
            {savedJobs.length > 0 ? (
              savedJobs.map((job, index) => (
                <div
                  key={index}
                  className="d-flex align-items-center justify-content-between mb-3 p-3 rounded shadow"
                  style={{
                    backgroundColor: "#fff",
                    width: "100%",
                  }}
                >
                  {/* Job Details */}
                  <div className="flex-grow-1">
                    <p
                      style={{
                        fontWeight: "bold",
                        marginBottom: "5px",
                      }}
                    >
                      {job.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#000",
                      }}
                    >
                      <strong>Company:</strong> {job.company}
                    </p>
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#000",
                      }}
                    >
                      <strong>Location:</strong> {job.location}
                    </p>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-danger text-decoration-none"
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                      }}
                    >
                      View Job
                    </a>
                  </div>

                  {/* Delete Button */}
                  <button
                    className="btn"
                    style={{
                      width: "8px", // Slightly thick, matches Image 2
                      height: "150px", // Matches the height of the card
                      border: "2px solid #ff6f61", // Match the red border
                      borderRadius: "5px", // Slightly rounded corners
                      backgroundColor: "transparent", // Transparent background
                      padding: "0", // Remove extra padding
                    }}
                    onClick={() => handleRemoveJob(job.title)}
                  ></button>
                </div>
              ))
            ) : (
              <p className="text-secondary">No saved jobs.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
