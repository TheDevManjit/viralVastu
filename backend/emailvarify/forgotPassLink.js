import nodemailer from 'nodemailer'
import 'dotenv/config'


export const forgotPassLink = (token, email) => {
    let sender = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    let mail = {
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
          <a href="http://localhost:5173/changepassword/${token}" 
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


    sender.sendMail(mail, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log("Email sent successfully: "
                + info.response);
        }
    });

}


