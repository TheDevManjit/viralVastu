import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOtpMail = async (email, otp) => {
  try {
    const response = await resend.emails.send({
      from: `viralvastu <noreply@teachmark.in>`, 
      to: email,
      subject: "OTP Verification - ViralVastu",
      html: `
        <div style="font-family: Arial, sans-serif; background:#f9fafb; padding:20px;">
          <div style="max-width:500px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
            
            <h2 style="color:#111827;">OTP Verification</h2>

            <p style="font-size:15px; color:#374151;">
              Use the OTP below to verify your email address:
            </p>

            <h1 style="letter-spacing:4px; text-align:center; color:#4f46e5;">
              ${otp}
            </h1>

            <p style="font-size:13px; color:#6b7280; margin-top:20px;">
              This OTP is valid for <b>10 minutes</b>.  
              If you didn’t request this, please ignore this email.
            </p>

            <hr style="margin:20px 0;" />

            <p style="font-size:12px; color:#9ca3af; text-align:center;">
              © ${new Date().getFullYear()} ViralVastu
            </p>

          </div>
        </div>
      `,
    });

    console.log("✅ OTP email sent via Resend:", response.data?.id);
    return true;

  } catch (error) {
    console.error("❌ OTP email failed:", error?.message || error);
    return false;
  }
};
