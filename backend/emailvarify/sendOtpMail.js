import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOtpMail = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS, // APP PASSWORD
      },
    });

    const mailOptions = {
      from: `"ViralVastu" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "OTP BY VIRALVASTU",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>OTP Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    return false;
  }
};
