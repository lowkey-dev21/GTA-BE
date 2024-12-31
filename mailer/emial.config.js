import nodemailer from "nodemailer";
import "dotenv/config";

export const sendEmail = async (res, userEmail, template) => {
  try {
    // Create a transporter object
    let transporter = nodemailer.createTransport({
      name: "Lowkey",
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };
    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
