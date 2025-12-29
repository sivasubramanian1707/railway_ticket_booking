const { login, signUp, forgotPassword } = require("../controllers/auth");
const { otpVerifyAndsend } = require("../middlewares/middleware");

const routes = require("express").Router();

routes.post("/sign-in", login);
routes.post("/sign-up", signUp);
routes.post("/forgot-password", otpVerifyAndsend, forgotPassword);

module.exports = routes;
