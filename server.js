var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var mail = require('./mail');
var sms = require('./sms');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/'));

app.post('/', function(req, res) {
    var html= '';
    var trainNames = [];
    var numbers = [];
    for(var i = 0; i < req.body.length; i++ ){
        html += JSON.stringify(req.body[i]);
        html += '<br/>';
        trainNames.push(req.body[i]['车次']);
        numbers.push(req.body[i]['余票']);
    }
    trainNames = trainNames[0];
    numbers = numbers[0] + '';
    var message = JSON.stringify({"name": "罗佳", "trainName": trainNames, "number": numbers});
    var mailOptions = {
        from: 'liang_renhong@126.com',
        to: '1075220132@qq.com',
        subject: 'Tickets',
        html: html
    };

    var smsOptions = {
        sms_free_sign_name: '提示信息',
        sms_param: message,
        rec_num: '18583711502', 
        sms_template_code: 'SMS_39010188'
    };
    console.log(trainNames + ': ' + numbers);
    if(req.body.length !== 0){
        sms(smsOptions);
    }
    //mail(mailOptions);
    res.send(html);
});

app.listen(3000, function() {
    console.log('3000 running...');
});