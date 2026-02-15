const jwt = require("jsonwebtoken");

const { OTPGenerator } = require("../helper/commonFunctions");
const { mail } = require("../helper/mailsFormat");
const user = require("../models/user");
const sendEmail = require("../utils/nodeMailer");

/**
 * Authentication middleware - validates JWT token
 */
exports.authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

/**
 * Admin authorization middleware
 */
exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/**
 * OTP verification and sending middleware
 */
exports.otpVerifyAndsend = async (req, res, next) => {
  try {
    const { email, OTPToken, OTP } = req.body;

    if (!email) {
      return res.status(400).json({ errorMessage: "Email is required" });
    }

    const emailExist = await user.findOne({ email });
    if (!emailExist) {
      return res.status(404).json({ errorMessage: "User not found" });
    }

    // OTP verification
    if (OTPToken && OTP) {
      try {
        const decoded = jwt.verify(OTPToken, process.env.JWT_OTP_SECRET_KEY);
        if (decoded.OTP === OTP) {
          req.user = { email };
          return next();
        } else {
          return res.status(401).json({ errorMessage: "Invalid OTP" });
        }
      } catch (error) {
        return res.status(401).json({ errorMessage: "OTP expired or invalid" });
      }
    }

    // Generate and send new OTP
    const GeneratedOTP = OTPGenerator();
    const emailSent = await sendEmail(
      email,
      mail.forgotPassword.subject,
      mail.forgotPassword.html(GeneratedOTP),
      true,
    );

    if (!emailSent) {
      return res.status(500).json({ errorMessage: "Failed to send OTP email" });
    }

    const token = jwt.sign(
      { OTP: GeneratedOTP },
      process.env.JWT_OTP_SECRET_KEY,
      { expiresIn: "5m" },
    );

    res.status(200).json({ message: "OTP sent to your email", token });
  } catch (error) {
    console.error("OTP error:", error);
    res.status(500).json({ errorMessage: "Internal server error" });
  }
};
