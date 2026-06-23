import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "ViralVastu <onboarding@resend.dev>", // testing only
      to: [email],
      subject: "OTP Verification - ViralVastu",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
          <h2>Verify Your Email</h2>
          
          <p>Your OTP code is:</p>
          
          <div style="
            font-size:32px;
            font-weight:bold;
            letter-spacing:5px;
            text-align:center;
            background:#f3f4f6;
            padding:15px;
            border-radius:8px;
            margin:20px 0;
          ">
            ${otp}
          </div>

          <p>This OTP will expire in 10 minutes.</p>

          <p>If you didn't request this OTP, please ignore this email.</p>

          <hr />

          <p style="color:#6b7280;font-size:12px;">
            © ${new Date().getFullYear()} ViralVastu
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return false;
    }

    console.log("Email Sent:", data?.id);
    return true;
  } catch (err) {
    console.error("Email Failed:", err);
    return false;
  }
};