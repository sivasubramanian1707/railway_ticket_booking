exports.mail = {
  signUpMail: {
    subject: "Welcome to Railway Ticket platform Thanks for Signing Up!",
    content: (name) => `Hi ${name},

Thank you for signing up with Railway Ticket!
We’re excited to have you on board.

Your account has been successfully created, and you're now ready to explore everything we have to offer.


If you have any questions or need support, feel free to reach out to us anytime at http://localhost:5173/.

Thanks again, and welcome to the community!
— The Railway Ticket Team`,
  },
  forgotPassword: {
    subject: "🔐 Your One-Time Password (OTP)",
    html: (
      OTP
    ) => `<p>We received a request to reset your password for your <b>Elite Agency</b> account.</p>

<p>Your One-Time Password (OTP) is:</p>

<h2 style="color: #007bff; letter-spacing: 4px;">${OTP}</h2>

<p>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>

<p>If you didn’t request a password reset, you can safely ignore this email.</p>

<br>
<p>Thanks,<br>The Railway Ticket Team</p>`,
  },
};
