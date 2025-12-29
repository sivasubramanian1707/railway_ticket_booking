const nodemailer = require("nodemailer");

async function sendEmail(receiver, subject, content, html) {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    service: "gmail",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASS_CODE,
    },
  });

  // Set email options
  let mailOptions = {
    from: process.env.MAIL_ID,
    to: receiver,
    subject: subject,
  };

  html ? (mailOptions["html"] = content) : (mailOptions["text"] = content);

  // Send mail
  try {
    let info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = sendEmail;
