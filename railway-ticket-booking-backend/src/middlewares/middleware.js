const jwt = require("jsonwebtoken");

const { OTPGenerator } = require("../helper/commonFunctions");
const { mail } = require("../helper/mailsFormat");
const user = require("../models/user");
const sendEmail = require("../utils/nodeMailer");

exports.authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_AUTH_SECRET_KEY);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.adminOnly = (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

exports.otpVerifyAndsend = async (req, res, next) => {
  const { email, OTPToken, OTP } = req.body;
  const emailExist = await user.findOne({ email });
  if (!emailExist) {
    return res.status(200).json({ errorMessage: "User not found!" });
  }
  if (OTPToken && emailExist && OTP) {
    const token = OTPToken;
    try {
      const encryptedOTP = jwt.verify(
        token,
        process.env.JWT_OTP_SECRET_KEY
      ).OTP;
      console.log(OTP);
      if (encryptedOTP === OTP) {
        next();
      } else {
        return res.status(200).json({ errorMessage: "Invalid OTP....." });
      }
    } catch (error) {
      return res.status(200).json({ errorMessage: "OTP Expired" });
    }
  } else {
    const GeneratedOTP = OTPGenerator();
    const isMailSended = sendEmail(
      email,
      mail.forgotPassword.subject,
      mail.forgotPassword.html(GeneratedOTP),
      true
    );
    if (isMailSended) {
      const token = jwt.sign(
        { OTP: GeneratedOTP },
        process.env.JWT_OTP_SECRET_KEY,
        {
          expiresIn: "5m",
        }
      );
      return res.status(200).json({ token });
    } else {
      return res.status(200).json({ errorMessage: "Enter Valid Mail!" });
    }
  }
};
