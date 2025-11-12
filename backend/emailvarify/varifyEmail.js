import nodemailer from 'nodemailer'
import 'dotenv/config'


export const varifyEmail = (token, email) =>{
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
        subject: "Sending Email using Node.js",
        text: `hi there please visit the following link to varify http://localhost:5173/varify/${token}`
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


