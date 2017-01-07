var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: '126',
    auth: {
        user: 'liang_renhong@126.com',
        pass: 'lrh1116'
    }
});

function send(options) {
    transporter.sendMail(options, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
}

module.exports = send;