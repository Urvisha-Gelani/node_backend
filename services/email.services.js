import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendUserRegisterEmail = async (username, toEmail) => {
  const mailOptions = {
    from: `MyApp Team <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "🎉 Welcome to MyApp!",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333;">👋 Welcome to MyApp! ${username} </h2>
          <p style="font-size: 16px; color: #555;">
            We're thrilled to have you on board. Your account has been successfully created.
          </p>
          <p style="font-size: 16px; color: #555;">
            Here is your login token (keep it safe or use it for session validation):
          </p>
          <p style="font-size: 16px; color: #555;">
            If you have any questions or need help, feel free to reach out to our support team.
          </p>
          <p style="font-size: 16px; color: #555;">Cheers,<br/>The MyApp Team</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
