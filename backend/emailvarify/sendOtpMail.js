import nodemailer from 'nodemailer'
import 'dotenv/config'


export const sendOtpMail = (otp, email) =>{
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
        subject: "OTP BY VIRALVASTU", 
        text: `your otp is ${otp} and expire in 10min`
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
