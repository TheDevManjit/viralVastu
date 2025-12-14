import nodemailer from 'nodemailer';
import 'dotenv/config';

export const forgotPassLink = async (token, email) => {
  try {
    // create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    // define mail options
    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "🔒 Reset Your Password - Action Required",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
          <h2 style="color: #333333;">Hello 👋,</h2>
          <p style="color: #555555; font-size: 16px;">
            We received a request to reset your password. Click the button below to set up a new one:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://viralvastu-frontend.onrender.com/changepassword/${token}" 
               style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #777777; font-size: 14px;">
            If you didn’t request this, you can safely ignore this email — your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999999; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Viral vastu. All rights reserved.
          </p>
        </div>
      </div>
      `
    };

    // send mail with async/await
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.response);
    return { success: true, message: "Email sent successfully" };

  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};

