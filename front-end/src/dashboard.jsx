import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [jobListings, setJobListings] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setJobListings([]);
    try {
      const response = await axios.get(
        "http://localhost:5000/api/jobs/search",
        {
          params: { jobTitle, location },
        }
      );
      setJobListings(response.data);
    } catch (error) {
      console.error("Error fetching job data:", error);
      setError("Error fetching job data");
    }
  };

  const handleSaveJob = async (job) => {
    try {
      const userEmail = localStorage.getItem("email"); // Get the logged-in user's email
      const response = await axios.post(
        "http://localhost:5000/api/users/saved-jobs",
        {
          email: userEmail,
          job,
        }
      );

      alert(response.data.message); // Show success message
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Failed to save job.");
    }
  };

  return (
    <div className="dashboard-container">
      <header
        className="navbar navbar-light bg-white shadow-sm fixed-top"
        style={{ height: "48px" }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="h5 fw-bold">JobTrack</h1>
          <nav>
            <a
              href="/dashboard"
              className="text-secondary me-3 text-decoration-none"
            >
              Home
            </a>
            <a href="/profile" className="text-secondary text-decoration-none">
              Profile
            </a>
          </nav>
        </div>
      </header>

      <main className="container-fluid pt-5 mt-5 animate__animated animate__fadeInUp">
        <section className="mb-4">
          <div className="card p-4 shadow-sm bg-white mb-4">
            <div className="row g-2">
              <div className="col-md">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
              <div className="col-md">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-danger" onClick={handleSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>

          <h2 className="fw-bold fs-5 mb-3">Job Listings</h2>
          {error && <p className="text-danger">{error}</p>}

          <div className="overflow-auto" style={{ maxHeight: "70vh" }}>
            <div className="row gy-3">
              {jobListings.map((job, index) => (
                <div
                  key={index}
                  className="col-md-6 col-lg-4 animate__animated animate__zoomIn"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: "0.5s",
                  }}
                >
                  <div className="card shadow-sm rounded">
                    <div className="card-body">
                      <h3 className="card-title h6">{job.title}</h3>
                      <p className="card-text">
                        <strong>Company:</strong> {job.company}
                      </p>
                      <p className="card-text">
                        <strong>Location:</strong> {job.location}
                      </p>
                      <p className="card-text">
                        <strong>Salary Range:</strong>{" "}
                        {job.salary_min
                          ? `${job.salary_min} - ${job.salary_max}`
                          : "Not Specified"}
                      </p>
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-danger text-decoration-none"
                      >
                        View Job
                      </a>
                      <button
                        className="btn btn-primary btn-sm float-end mt-3"
                        onClick={() => handleSaveJob(job)}
                      >
                        Save Job
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
