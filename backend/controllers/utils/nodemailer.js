import nodemailer from "nodemailer";

import { configDotenv } from "dotenv";
configDotenv()
const sendEmail = async ({ to, subject, html }) => {
  // Configure transporter (use environment variables in production)
  const transporter = nodemailer.createTransport({
     service:'gmail',
    // host: "smtp.gmail.com", 
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  };

  // Send mail
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
