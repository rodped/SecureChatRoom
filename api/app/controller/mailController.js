const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    tls: {
        rejectUnauthorized: false
    },
    auth: {
        user: 'q1w2w2w2@gmail.com',
        pass: 'teste123teste'
    }
});


exports.sendMail = function (req, res) {
    const mailOptions = {
        from: 'q1w2w2w2@gmail.com',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    // transporter.sendMail(mailOptions)

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log('\n\n' + error + '\n\n');
            res.send(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send(info.response);
        }
    });
}