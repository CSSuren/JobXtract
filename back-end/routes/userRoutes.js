const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../modules/user");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Ensure you have a secret key

// Sign Up Route
router.post("/signUp", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ fullName, email, password });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Sign In Route
router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Profile Route
router.get("/profile", async (req, res) => {
  try {
    const email = req.headers.email; // Pass email from headers

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

// Update Profile Route
router.post("/profile", async (req, res) => {
  try {
    const { email, fullName, phone, location, website } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email }, // Match user by email
      { $set: { fullName, phone, location, website } }, // Update only specified fields
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});
// Save Job Route
router.post("/saved-jobs", async (req, res) => {
  try {
    const { email, job } = req.body; // Extract email and job details from request

    // Find user and add the job to savedJobs array
    const updatedUser = await User.findOneAndUpdate(
      { email }, // Match the user by email
      { $addToSet: { savedJobs: job } }, // Add job to savedJobs array if it doesn't already exist
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Job saved successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error saving job", error });
  }
});
// Get Saved Jobs Route
router.get("/saved-jobs", async (req, res) => {
  try {
    const email = req.headers.email; // Identify user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ savedJobs: user.savedJobs });
  } catch (error) {
    res.status(500).json({ message: "Error fetching saved jobs", error });
  }
});

router.delete("/saved-jobs", async (req, res) => {
  try {
    const { email, jobTitle } = req.body;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $pull: { savedJobs: { title: jobTitle } } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Job removed successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error removing job", error });
  }
});

// Forgot Password Route// Forgot Password Route
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return success response if the user exists
    res.status(200).json({
      message: "User found. You can now reset your password.",
      email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error });
  }
});

// Reset Password Route
router.post("/reset-password", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error });
  }
});

module.exports = router;
