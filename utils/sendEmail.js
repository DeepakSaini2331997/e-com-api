const nodeMailer = require('nodemailer')
const sendEmail = async(options) =>{
    const transporter = nodeMailer.createTransport({
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_AUTHMAIL,
            pass:process.env.SMTP_AUTHPASSWORD
        }
    })

    const mailOptions ={
        from:process.env.SMTP_AUTHMAIL,
        to:options.email,
        subject:options.subject,
        message:options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail