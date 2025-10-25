const nodemailer = require('nodemailer');
const email = process.env.EMAIL
const password = process.env.PASSWORD

async function sendEmail(payload) {
    try {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });

        var mailOptions = {
            from: 'tech@Meena.com',
            to: payload.email,
            subject: payload.subject,
            html: payload.html
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                return true
            }
        });

    } catch (error) {
        console.log("error: ", error)
        return error
    }
}

module.exports = sendEmail;