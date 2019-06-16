const nodemailer = require('nodemailer');

var key = 'real secret keys should be long and random';
var encryptor = require('simple-encryptor')(key);

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
        subject: 'MyChat',
        html: '<h1 style="text-align: center;"><strong>MyChat</strong></h1><table style="border-color: black; margin-left: auto; margin-right: auto;"><tbody><tr><td><h3>Your Account Information</h3></td></tr><tr><td>user: ' + req.body.username + '<p>email: ' + req.body.email + '</p><p>password: ' + encryptor.decrypt(req.body.passwordEncrypt) + '</p></td></tr></tbody></table>'
    };

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