// Detail
let breadz = $('.bread-odrNum');
let details = $('.details tr');
let odrNum = $('.order-num'), odrDate = $('.order-date'), odrStatus = $('.order-status'), odrType = $('.order-type');
let odrControls = $('.order-controls'), payEndDate = $('.order-payLimit');
let odrName = $('.order-name'), odrCell = $('.order-cell'), odrDevType = $('.order-devType'), odrAddress = $('.order-address');
let odrDateSet = $('.order-dateSet');
let memoStore = $('.memo-store'), memoCustomer = $('.memo-customer');
let odrItems = $('.order-items'), prices;
let odrSubAmts = $('.subAmts'), odrFee = $('.feeSet'), odrAmts = $('.amts');
// 接收資料，做渲染、處理
function process(data) {
    details.attr('data-num', data.Id);
    breadz.text(data.Id)
    odrNum.html(data.Id);
    odrDate.html(data.Creation_Date.split(' ')[0]); // 只顯示年月日
    odrStatus.html(data.Order_Status);
    odrType.html(data.Pay_Type);
    odrType.attr('data-num', data.Order_Status_Id);
    // 依訂單狀態決定控制項
    if (data.Order_Status_Id == 11 && data.Pay_Type_sId != "01") {
        // 尚未付款（顯示付款期限、付款訊息、取消訂單）
        odrControls.find('.setupBlock').html('').html(`
            <div class="rePaies">
                <div class="order-field"><span>付款期限</span><span class="order-payLimit">${data.Pay_End_Date.split(' ')[0]}</span></div>
                <a class="button-style first btnPayInfo"><i class="fal fa-file-invoice-dollar"></i> 付款訊息</a>
            </div>
        `);
        odrControls.find('.setupBlock').append(`<a href="" class="button-style third btnCancelOdr"><i class="fad fa-window-close"></i> 取消訂單</a>`);
    }
    else if (data.Order_Status_Id == 11 && data.Pay_Type_sId == "01") {
        // 尚未付款（顯示付款期限、付款訊息、取消訂單）
        odrControls.find('.setupBlock').html('').html(`
            <div class="rePaies">
                <a class="button-style first btnPayments"><i class="far fa-credit-card"></i> 直接付款</a>
            </div>
        `);
        odrControls.find('.setupBlock').append(`<a href="" class="button-style third btnCancelOdr"><i class="fad fa-window-close"></i> 取消訂單</a>`);
    }
    else if (data.Order_Status_Id == 13) {
        // 付款失敗（重新付款）
        drControls.find('.setupBlock').html('').html(`
            <a href="" class="button-style first btnRePay">重新付款</a>
        `);
        odrControls.find('.setupBlock').append(`<a href="" class="button-style third btnCancelOdr"><i class="fad fa-window-close"></i> 取消訂單</a>`);
    }
    else if (data.Order_Status_Id == 16 || data.Order_Status_Id == 21 || data.Order_Status_Id == 22) {
        // 出貨前（取消訂單，需賣家同意）
        odrControls.find('.setupBlock').html('').append(`<a href="" class="button-style third btnCancelOdr"><i class="fad fa-window-close"></i> 取消訂單</a>`);
    }
    else if (data.Order_Status_Id == 23 || data.Order_Status_Id == 31 || data.Order_Status_Id == 32) {
        // 帶出貨-已出貨、運送中-未送達、運送中-已送達、（不會有控制項）
        odrControls.find('.setupBlock').html('');
    }
    else if (data.Order_Status_Id == 41) {
        // 商品送達（申請退貨、完成訂單）
        odrControls.find('.setupBlock').html('').html(`
            <a href="" class="button-style third btnReturn">申請退貨</a>
            <a href="" class="button-style first btnComplete">完成訂單</a>
        `);
    }
    else if (data.Order_Status_Id == 12 || data.Order_Status_Id == 14 || data.Order_Status_Id == 15 || data.Order_Status_Id == 42 || data.Order_Status_Id == 52) {
        // 訂單完成、訂單失敗、訂單取消-賣家取消、訂單取消-買家取消（再次購買）
        odrControls.find('.setupBlock').html('').html(``);
        // odrControls.find('.setupBlock').html('').html(`
        //     <a href="" class="button-style first btnBuyAgain">再次購買</a>
        // `);
    }
    else if (data.Order_Status_Id == 51) {
        // 取消-待回應
        odrControls.find('.setupBlock').html('');
    }
    else {
        odrControls.html('');
    };
    // 收件資訊
    odrName.html(data.Receiver_Name);
    odrCell.html(data.Receiver_Phone);
    // 配送方式
    odrDevType.html(data.Delivery_Type);
    odrAddress.html(data.Receiver_Address);
    // 訂單時程
    odrDateSet.html('');
    if (data.Creation_Date !== "") {
        // 訂單成立
        odrDateSet.append(`<div><span>訂單成立時間</span><span class="dateSet">${data.Purchase_Date}</span></div>`);
    };
    if (data.Pay_Date !== "") {
        // 訂單付款
        odrDateSet.append(`<div><span>訂單付款時間</span><span class="dateSet">${data.Pay_Date}</span></div>`);
    };
    if (data.Delivery_Date !== "") {
        // 訂單出貨
        odrDateSet.append(`
            <div>
                <span>預計出貨時間</span>
                <span class="dateSet">${data.Delivery_Date.split(' ')[0]} ( 時間點不定 )</span>                               
            </div>
        `);
    };
    if (data.Arrival_Date !== "") {
        // 訂單抵達
        odrDateSet.append(`
            <div>
                <span>預計抵達時間</span>
                <span class="dateSet">${data.Arrival_Date.split(' ')[0]} ( 時間點不定 )</span>
            </div>
        `);
    };
    // if (data.Completed_Date) {
    //     // 訂單完成
    //     odrDateSet.append(`<div><span>訂單完成</span><span class="dateSet">${data.Completed_Date}</span></div>`);
    // }
    // 訂單備註
    if (data.Memo_Store !== "") {
        memoStore.html(data.Memo_Store)
    };
    if (data.Memo_Customer !== "") {
        memoCustomer.html(data.Memo_Customer)
    };
    // 商品資訊
    html = "";
    for (let i = 0; i < data.Items.length; i++) {
        prices = "";
        if (data.Items[i].sell_price !== "" && data.Items[i].sell_price !== 0 && data.Items[i].sell_price !== null && data.Items[i].sell_price !== undefined) {
            prices = `
                <div class="prices">
                    <span class="priceMark orig"><s>${thousands(data.Items[i].Price)}</s></span>
                    <span class="priceMark disc">${thousands(data.Items[i].sell_price)}</span>
                </div>
            `;
        } else {
            prices = `
                <div class="prices">
                    <span class="priceMark disc">${thousands(data.Items[i].Price)}</span>
                </div>
            `;
        };
        html += `
            <a href="./product_view.html?pdtId=${data.Items[i].Spu_Id}" class="order-item">
                <div class="images">
                    <img src="${IMGURL}products/${data.Items[i].Spu_Id}/${data.Items[i].product_cover}">
                </div>
                <div class="main">
                    <p data-num="${data.Items[i].Spu_Id}" class="title abridged1" title="${data.Items[i].Spu}">${data.Items[i].Spu}</p>
                    <p data-num="${data.Items[i].Sku_Id}" class="subTitle abridged1" title="${data.Items[i].Sku}">${data.Items[i].Sku}</p>
                    <div>
                        <span>數量</span>
                        <span>${data.Items[i].quantity}</span>
                    </div>
                    <div>
                        <span>價格</span>
            `+
            prices
            + `
                    </div> 
                </div>
            </a>
        `;
    };
    odrItems.html(html);
    // 訂單金額
    odrSubAmts.html(thousands(data.Order_Total));
    // 運費顯示
    if (data.Delivery_Fee == 0) {
        feeSet = `<span class="notes">免運費</span>`;
    } else {
        feeSet = `<span class="priceMark">${thousands(data.Delivery_Fee)}</span>`;
    };
    odrFee.html(feeSet);
    odrAmts.html(thousands(Number(data.Order_Total) + Number(data.Delivery_Fee)));
};
$().ready(function () {
    // 從 localStorage 取編號，用於呼叫訊息
    // let num = localStorage.getItem('orderNum');
    let num = request('odrId');
    if (num) {
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Orders/GetOrder/${num}`,
            "QUERYs": "",
            "Sends": "",
            "Counts": "",
        };
        getPageDatas(dataObj).then(res => {
            // DOSOMETHING
            if (res !== null) {
                process(res);
                // 直接付款
                $('.btnPayments').on('click', function (e) {
                    e.preventDefault();
                    // let num = $(this).parents('tr').data('num');
                    console.log(num)
                    if (confirm("您要重新支付此筆訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    console.log(callBackData)
                                    let invoArr = callBackData.Invoice.split(",");
                                    let invoName = invoArr[1].split(":")[1], invoCode = invoArr[2].split(":")[1];
                                    let total = parseInt(Number(callBackData.Order_Total) + Number(callBackData.Delivery_Fee));
                                    sendOrder(flowObj.MerchantId, flowObj.TerminalId, flowObj.MerchantName, flowObj.RequestUrl, flowObj.ReturnURL, callBackData.Pay_Type_sId, callBackData.Id, total, "商品", callBackData.Memo_Customer, flowObj.Encoding, callBackData.Receiver_Phone, "", callBackData.Receiver_Address, callBackData.Receiver_Email, idz, flowObj.GoBackURL, flowObj.ReceiveURL, flowObj.DeadlineDate, flowObj.RequiredConfirm, flowObj.deferred, invoCode, invoName, flowObj.validateKey);
                                } else { };
                            };
                        };
                        xhr.open('GET', `${URL}Orders/GetOrder/${num}`, true);
                        // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                        xhr.send(null);
                    };
                });
                // 付款訊息
                $('.btnPayInfo').on('click', function (e) {
                    e.preventDefault();
                    let num = $(this).parents('tr').data('num');
                    if (num) {
                        location.href = `./flow_payments.html?id=${num}`;
                    };
                });
                // 取消訂單
                $('.btnCancelOdr').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要取消訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/CancelOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
                // 重新付款
                $('.btnRePay').on('click', function (e) {
                    e.preventDefault();
                    // let num = $(this).parents('tr').data('num');
                    console.log(num)
                    if (confirm("您要重新支付此筆訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    console.log(callBackData)
                                    let invoArr = callBackData.Invoice.split(",");
                                    let invoName = invoArr[1].split(":")[1], invoCode = invoArr[2].split(":")[1];
                                    let total = parseInt(Number(callBackData.Order_Total) + Number(callBackData.Delivery_Fee));
                                    sendOrder(flowObj.MerchantId, flowObj.TerminalId, flowObj.MerchantName, flowObj.RequestUrl, flowObj.ReturnURL, callBackData.Pay_Type_sId, callBackData.Id, total, "商品", callBackData.Memo_Customer, flowObj.Encoding, callBackData.Receiver_Phone, "", callBackData.Receiver_Address, callBackData.Receiver_Email, idz, flowObj.GoBackURL, flowObj.ReceiveURL, flowObj.DeadlineDate, flowObj.RequiredConfirm, flowObj.deferred, invoCode, invoName, flowObj.validateKey);
                                } else { };
                            };
                        };
                        xhr.open('GET', `${URL}Orders/GetOrder/${num}`, true);
                        // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                        xhr.send(null);
                    };
                });
                // 申請退貨
                $('.btnReturn').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要申請退貨嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/ReturnOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
                // 完成訂單
                $('.btnComplete').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "id": num
                    };
                    if (confirm("您確定要完成訂單嗎？")) {
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200 || xhr.status == 204) {
                                if (xhr.responseText !== "") {
                                    alert(xhr.responseText);
                                    location.reload();
                                };
                            };
                        };
                        xhr.open('PUT', `${URL}Orders/FinishOrder`, true)
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(dataObj));
                    };
                });
            } else {
                fails();
            };
        }, rej => {
            if (rej == "NOTFOUND") {
                // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                getLogout();
            };
        });
    };
});