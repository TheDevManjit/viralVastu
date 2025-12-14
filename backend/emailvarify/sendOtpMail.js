import nodemailer from 'nodemailer'
import 'dotenv/config'


export const sendOtpMail = async (otp, email) => {
  try {
    const sender = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    const mail = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "OTP BY VIRALVASTU",
      text: `Your OTP is ${otp} and it expires in 10 minutes`
    };

    await sender.sendMail(mail);
    console.log("✅ Email sent successfully");
    return true;
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return false;
  }
};