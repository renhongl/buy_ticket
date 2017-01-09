var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');
var fs = require('fs');
var from = 10;
var end = 16;

var App = require('alidayu-node');
var app = new App('23593290', 'b4858df65732eb9985f4c30052538697');

var url = 'http://trains.ctrip.com/TrainBooking/Ajax/SearchListHandler.ashx?Action=getSearchList';
var postData = {
    "IsBus": false,
    "Filter": "0",
    "Catalog": "",
    "IsGaoTie": false,
    "IsDongChe": false,
    "CatalogName": "",
    "DepartureCity": "chengdu",
    "ArrivalCity": "yingshan2",
    "HubCity": "",
    "DepartureCityName": "成都",
    "ArrivalCityName": "营山",
    "DepartureDate": "2017-01-24",
    "DepartureDateReturn": "2017-01-26",
    "ArrivalDate": "",
    "TrainNumber": ""
};

var options = {
    encoding: null,
    method: 'POST',
    url: url,
    form: {
        value: JSON.stringify(postData)
    },
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded:charset=gb2312',
    }
};

function main() {
    console.log('Search From:', new Date().toString() + '\n');
    fs.appendFile('log.txt', new Date().toString() + '\n');
    request.post(options, callback);
    setInterval(function() {
        console.log('Search From:', new Date().toString() + '\n');
        fs.appendFile('log.txt', new Date().toString() + '\n');
        request.post(options, callback);
    }, 30000);
}

function callback(error, response, body) {
    console.log('\n');
    var $ = cheerio.load(body);
    var list = JSON.parse(iconv.decode(body, "gb2312")).TrainItemsList;
    var newList = parseList(list);
    showList(newList);
}

function parseList(list) {
    var newList = [];
    for (var i = 0; i < list.length; i++) {
        var start = Number(list[i].StratTime.split(':')[0]);
        var Inventory = list[i].SeatBookingItem[0].Inventory;
        if (start > from && start < end && Inventory === 0) {
            newList.push(list[i]);
        }
    }
    return newList;
}

function showList(list) {
    if (list.length === 0) {
        console.log('No data found\n');
        fs.appendFile('log.txt', 'No data found\n');
    } else {
        sendSMS(list);
        for (var i = 0; i < list.length; i++) {
            var TrainName = list[i].TrainName;
            var StartStationName = list[i].StartStationName;
            var EndStationName = list[i].EndStationName;
            var StratTime = list[i].StratTime;
            var EndTime = list[i].EndTime;
            var Inventory = list[i].SeatBookingItem[0].Inventory;
            var str = '车次：' + TrainName + ' 开始：' + StartStationName + ' 到达：' + EndStationName + ' 发出时间：' + StratTime + ' 到达时间：' + EndTime + ' 余票：' + Inventory + '\n';
            console.log(str);
            fs.appendFile('log.txt', str);
        }
    }
}

function sendSMS(list) {
    var trainNames = list[0].TrainName;
    var numbers = list[0].SeatBookingItem[0].Inventory;
    var message = JSON.stringify({
        "name": "lrh",
        "trainName": trainNames,
        "number": numbers
    });

    var smsOptions = {
        sms_free_sign_name: '提示信息',
        sms_param: message,
        rec_num: '81193903',
        sms_template_code: 'SMS_39010188'
    };
    app.smsSend(options);
}

main();