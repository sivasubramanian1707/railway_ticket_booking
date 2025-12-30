const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const user = require("../models/user");
const sendEmail = require("../utils/nodeMailer");
const { mail } = require("../helper/mailsFormat");

exports.signUp = async (req, res) => {
  const { name, email, phoneNo, password } = req.body;
  const userExist = await user
    .findOne({ email })
    .catch(() =>
      res.status(200).json({ errorMessage: "Sorry Somthing Wrong" })
    );

  if (userExist) {
    res.status(200).json({ errorMessage: "Email Aldready Exist" });
  } else {
    const isMailSended = await sendEmail(
      email,
      mail.signUpMail.subject,
      mail.signUpMail.content(name)
    );
    if (isMailSended) {
      const hashPassword = await bcrypt.hash(password, 10);
      const formData = { name, email, phoneNo, password: hashPassword };
      const data = await user.create(formData);
      res
        .status(201)
        .json(data)
        .then((data) => res.status(201).json(data))
        .catch((err) => {
          console.log(err);
          return res
            .status(200)
            .json({ errorCode: 100, errorMessage: "Sorry Somthing Wrong" });
        });
    } else {
      res
        .status(200)
        .json({ errorCode: 101, errorMessage: "Enter valid email!" });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const existUser = await user.findOne({ email: email });
    if (existUser) {
      const checkPassword = await bcrypt.compare(password, existUser.password);
      if (checkPassword) {
        const token = jwt.sign(
          { userId: existUser._id, role: existUser.role },
          process.env.JWT_AUTH_SECRET_KEY,
          { expiresIn: "1d" }
        );
        res.status(201).json({ token: token, userData: existUser });
      } else {
        return res.status(200).json({ errorMessage: "Incorrect Password" });
      }
    } else {
      return res.status(200).json({ errorMessage: "User not found" });
    }
  } else {
    return res.status(200).json({ errorMessage: "Fill all elements" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);
  user
    .updateOne({ email }, { $set: { password: hashPassword } })
    .then(() => {
      res.status(201).json({ status: "updated" });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(200)
        .json({ errorCode: 100, errorMessage: "Sorry Somthing Wrong" });
    });
};
