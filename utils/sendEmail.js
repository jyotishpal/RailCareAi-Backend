const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RailCareAI" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error("Email error:", error);
  }
};

module.exports = sendEmail;
