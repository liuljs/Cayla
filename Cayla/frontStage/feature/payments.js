// Payments
let totalPayment = $('.total-payment'), paymentEndDate = $('.payment-endDate'), btnPrev = $('.btnPrev');
let bankName = $('.bankName'), bankCode = $('.bankCode'), bankAcc = $('.bankAcc'), payType = $('.payType');
// 倒數計時器 EndDate Timer
let dateInfo = $('.date-info')
let endDateTimer = $('.payment-timing'), dayz = $('.dayz'), hourz = $('.hourz'), minutez = $('.minutez'), secondz = $('.secondz');
function GetTimeRemaining(timez) {
    const Total = Date.parse(timez) - Date.parse(new Date());
    const Seconds = Math.floor((Total / 1000) % 60);
    const Minutes = Math.floor((Total / 1000 / 60) % 60);
    const Hours = Math.floor((Total / (1000 * 60 * 60)) % 24);
    const Days = Math.floor(Total / (1000 * 60 * 60 * 24));
    return {
        Total,
        Seconds,
        Minutes,
        Hours,
        Days
    };
};
function InitializeClock(obj, timez) {
    //     let clock = obj;
    //     let timeInterval = setInterval(() => {
    //         const Times = GetTimeRemaining(timez);
    //         clock.html(`
    //             <span>${Times.Days} 天</span>
    //             <span>${Times.Hours} 小時</span>
    //             <span>${Times.Minutes} 分鐘</span>
    //             <span>${Times.Seconds} 秒</span>
    //         `);
    //         if (Times.Total <= 0) {
    //             clearInterval(timeInterval);
    //         };
    //     }, 1000);
};
$().ready(function () {
    
    if (request('id')) {
        let num = request('id');
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Orders/GetOrder/${num}`,
            "QUERYs": "",
            "Counts": "",
            "Sends": "",
        };
        getPageDatas(dataObj).then(res => {
            // DOSOMETHING
            if (res !== null) {
                if (res.Pay_End_Date !== "") { // 沒有付款期限的話
                    totalPayment.html(thousands(parseInt(Number(res.Delivery_Fee) + Number(res.Order_Total))));
                    paymentEndDate.html(` 
                        <span>${res.Pay_End_Date.split(' ')[0]}</span>
                    `);
                    // DeadLine
                    const DeadLine = res.Pay_End_Date;
                    // UpdateClock
                    function UpdateClock() {
                        const Times = GetTimeRemaining(DeadLine);
                        dayz.html(Times.Days);
                        hourz.html(('0' + Times.Hours).slice(-2));
                        minutez.html(('0' + Times.Minutes).slice(-2));
                        secondz.html(('0' + Times.Seconds).slice(-2));
                        if (Times.Total <= 0) {
                            // clearInterval(timeInterval);
                            endDateTimer.html('').html('已到期');
                        };
                    };
                    UpdateClock();
                    let timeInterval = setInterval(UpdateClock, 1000);
                    // Info
                    if (res.Pay_Type_Id == 7) { // 如果是超商代碼，顯示對應的超商圖片
                        bankName.find(`.images[data-num="${res.Bank_Name}"]`).addClass('active')
                        bankCode.html('-');
                    } else {
                        bankName.find('.names').html(res.Bank_Name);
                        bankCode.html(res.Bank_No);
                    };
                    bankAcc.html(res.Payment_No.replace(/(\s)/g, '').replace(/(.{4})/g, '$1 ').replace(/\s*$/, ''));
                    payType.html(res.Pay_Type);
                } else {
                    dateInfo.html('').html('<span>付款失敗</span>');
                };
            } else {
                location.href = "./member_login.html";
            };
        }, rej => {
            if (rej == "NOTFOUND") {
                // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                getLogout();
            };
        });
        // 回上一頁
        btnPrev.on('click', function (e) {
            e.preventDefault();
            location.href = `member_order_view.html?odrId=${num}`;
        });
    } else { };

});