var App = require('alidayu-node');
var app = new App('23593290', 'b4858df65732eb9985f4c30052538697');
 
function send(options) {
    app.smsSend(options);
    console.log('sms sended: ' + new Date());
}

module.exports = send;