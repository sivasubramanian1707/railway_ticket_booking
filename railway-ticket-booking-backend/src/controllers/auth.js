const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const user = require("../models/user");
const sendEmail = require("../utils/nodeMailer");
const { mail } = require("../helper/mailsFormat");
const { validateEmail, validatePassword } = require("../helper/validation");

exports.signUp = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    // Input validation
    if (!name || !email || !phoneNo || !password) {
      return res.status(400).json({ errorMessage: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ errorMessage: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ errorMessage: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.status(409).json({ errorMessage: "Email already exists" });
    }

    // Send welcome email
    const isMailSended = await sendEmail(
      email,
      mail.signUpMail.subject,
      mail.signUpMail.content(name),
    );

    if (!isMailSended) {
      return res
        .status(400)
        .json({ errorMessage: "Failed to send email. Please try again." });
    }

    // Hash password and create user
    const hashPassword = await bcrypt.hash(password, 10);
    const userData = await user.create({
      name,
      email,
      phoneNo,
      password: hashPassword,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = userData.toObject();
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("SignUp error:", err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Email and password are required" });
    }

    const existUser = await user.findOne({ email }).select("+password");
    if (!existUser) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ errorMessage: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userData: existUser, role: existUser.role },
      process.env.JWT_AUTH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    const { password: _, ...userWithoutPassword } = existUser.toObject();
    res.status(200).json({
      message: "Login successful",
      token,
      userData: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ errorMessage: "Email and password are required" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ errorMessage: "Password must be at least 6 characters" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = await user.findOneAndUpdate(
      { email },
      { password: hashPassword },
      { new: true },
    );

    if (!result) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};
