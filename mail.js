const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: `${process.env.EMAIL_USERNAME}`,
        pass: `${process.env.PASSWORD}`
    }
});

// signup message
function mailConfigurations(email) {
    return {

    // It should be a string of sender email
    from: `${process.env.COMPANY}`,

    // Comma Separated list of mails
    to: email,

    // Subject of Email
    subject: `Sign up at Management Dredgreat`,

    // This would be the text of email body
    text: `You have successfully signed up, `
        + 'for Management on Dredgreat, '
        + `Enjoy your Days with proper management`
};}


// resp.redirect('/bookroom')
module.exports = {
    mail: function (to) {
       return transporter.sendMail(mailConfigurations(to), function (error, info) {
            if (error) {
                throw Error(error);
            } else {


                console.log('Email Sent Successfully');

                // console.log(info);
            }
        })
    },

};