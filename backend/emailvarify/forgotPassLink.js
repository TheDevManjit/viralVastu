import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const forgotPassLink = async (token, email) => {
  console.log("Sending reset mail to:", email);

  try {
    const resetUrl = `https://viralvastu-frontend.onrender.com/changepassword/${token}`;

    const response = await resend.emails.send({
      from: `viralvastu <noreply@viralvastu.in>`,
      to: email, 
      subject: "🔒 Reset Your Password - Action Required",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f8f9fa; padding: 30px;">
          <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); padding: 25px;">
            <h2>Hello 👋</h2>
            <p>Click the button below to reset your password:</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background-color:#007bff;color:#fff;padding:12px 25px;border-radius:6px;text-decoration:none;">
                Reset Password
              </a>
            </div>

            <p style="font-size:14px;color:#777;">
              If you didn’t request this, you can ignore this email.
            </p>

            <p style="font-size:12px;color:#999;text-align:center;">
              © ${new Date().getFullYear()} ViralVastu
            </p>
          </div>
        </div>
      `,
    });

    console.log("✅ Resend response:", response);
    return { success: true };

  } catch (error) {
    console.error("❌ Resend error:", error?.message || error);
    return { success: false, error };
  }
};
