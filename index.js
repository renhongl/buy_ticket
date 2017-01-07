(function() {
    var count = 0;
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

    postData = 'value=' + JSON.stringify(postData);

    var options = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: postData,
        success: function(result) {
            count++;
            var list = JSON.parse(result).TrainItemsList;
            var canBookList = parseList(list);
            var inforList = [];
            $.each(canBookList, function(i, item) {
                var ticket = {
                    '车次': item.TrainName,
                    '开始车站': item.StartStationName,
                    '到达站': item.EndStationName,
                    '开车时间': item.StratTime,
                    '到达时间': item.EndTime,
                    '花费时间': item.TakeTime,
                    '余票': item.SeatBookingItem[0].Inventory,
                    '价格': item.SeatBookingItem[0].Price,
                    '座位类型': item.SeatBookingItem[0].SeatName
                }
                inforList.push(ticket);
                console.log(JSON.stringify(ticket));
            });
            if(canBookList.length !== 0){
                $.ajax({
                    method: 'POST',
                    url: 'http://127.0.0.1:3000',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(inforList),
                    success: function(result) {
                        console.log('Pushed');
                        result = '已刷新：' + count + '次<br/>' + result;
                        $('body').html(result);
                    },
                    error: function(error) {
                        console.log(error);
                    }
                })
            }else{
                var div = '已刷新：' + count + '次<br/>';
                $('body').html(div + 'No data found');
            }
        },
        error: function(error) {
            console.log(error);
        }
    };

    $.ajax(options);
    setInterval(function() {
        $.ajax(options);
    }, 30000);

    function parseList(list) {
        var newList = []
        $.each(list, function(i, item) {
            var startTime = Number(item.StratTime.split(':')[0]);
            var endTime = Number(item.EndTime.split(':')[0]);
            if (startTime >= 10 && startTime <= 16 && item.SeatBookingItem[0].Inventory !== 0 && endTime <= 18) {
                newList.push(item)
            }
        });
        return newList;
    }

})();