const express = require("express");
const { spawn } = require("child_process");

const router = express.Router();

router.get("/search", (req, res) => {
  const { jobTitle, location } = req.query;

  const pythonProcess = spawn("python", [
    "./extractJob.py",
    jobTitle,
    location,
  ]);

  let data = "";
  pythonProcess.stdout.on("data", (chunk) => {
    data += chunk;
  });

  pythonProcess.stderr.on("data", (error) => {
    console.error("Python Error:", error.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      return res.status(500).json({ message: "Error fetching job data" });
    }

    try {
      const jobs = JSON.parse(data);
      res.json(jobs);
    } catch (error) {
      console.error("Parsing Error:", error);
      res.status(500).json({ message: "Error parsing job data" });
    }
  });
});

module.exports = router;
