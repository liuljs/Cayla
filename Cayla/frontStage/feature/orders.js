// Member Order
let subOrderNav = $('.subOrderNav');
let orderLiv = subOrderNav.find('ul li a');
let orders = $('.orders');
let items, prices, feeSet, invo = "", setupButtons;

let dataObj = {
    "Methods": "POST",
    "APIs": URL,
    "CONNECTs": `Orders/GetOrders`,
    "QUERYs": "",
    "Counts": listSize,
    "Sends": {
        // "id": "",
        // "order_status_id": "",
        // "startDate": "",
        // "endDate": "",
        // "count": "",
        "page": current
    },
};
// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    html = "";
    for (let i = 0; i < data.length; i++) {
        items = "";
        for (let j = 0; j < data[i].Items.length; j++) {
            // 價格顯示
            prices = "";
            if (data[i].Items[j].sell_price !== "" && data[i].Items[j].sell_price !== 0 && data[i].Items[j].sell_price !== null && data[i].Items[j].sell_price !== undefined) {
                prices = `
                    <div class="prices">
                        <span class="orig priceMark"><s>${thousands(data[i].Items[j].Price)}</s></span>
                        <span class="disc priceMark">${thousands(data[i].Items[j].sell_price)}</span>
                    </div>
                `;
            } else {
                prices = `
                    <div class="prices">
                        <span class="disc priceMark">${thousands(data[i].Items[j].Price)}</span>
                    </div>
                `;
            };
            // 選購商品的列表
            items += `
                <div class="order-item">
                    <div class="images">
                        <img src="${IMGURL}products/${data[i].Items[j].Spu_Id}/${data[i].Items[j].product_cover}">
                    </div>
                    <div class="main">
                        <p class="title abridged1" data-num="${data[i].Items[j].Spu_Id}" title="${data[i].Items[j].Spu}">${data[i].Items[j].Spu}</p>
                        <p class="subTitle abridged1" data-num="${data[i].Items[j].Sku_Id}" title="${data[i].Items[j].Sku}">${data[i].Items[j].Sku}</p>
                        <div>
                            <span>數量</span>
                            <span>${data[i].Items[j].quantity}</span>
                        </div>
                        <div>
                            <span>價格</span>
                `+
                prices
                + `
                        </div> 
                    </div>
                </div>
            `;
        };
        // 控制項
        if (data[i].Order_Status_Id == "11" && data[i].Pay_Type_sId == "01") {
            // 發票資訊
            if (data[i].Invoice.indexOf("紙本發票") == -1) {
                invo = data[i].Invoice;
            } else {
                invo = "";
            };
            setupButtons = `
                <button class="button-style third btnPayments" data-invo="${invo}"><i class="far fa-credit-card"></i> 直接付款</button>
                <button class="button-style first btnDetails"><i class="fad fa-file-search"></i> 訂單詳情</button>
            `;
        } else if (data[i].Order_Status_Id == "11" && data[i].Pay_Type_sId == "7") {
            setupButtons = `
                <button class="button-style third btnPayInfos" data-invo="${invo}"><i class="fal fa-file-invoice-dollar"></i> 付款訊息</button>
                <button class="button-style first btnDetails"><i class="fad fa-file-search"></i> 訂單詳情</button>
            `;
        }
        // else if (data[i].Order_Status_Id == "42" || data[i].Order_Status_Id == "52") {
        //     setupButtons = `
        //         <button class="button-style third btnBuyAgains"><i class="fal fa-cart-plus"></i> 再次購買</button>
        //         <button class="button-style first btnDetails"><i class="fad fa-file-search"></i> 訂單詳情</button>
        //     `;
        // }
        else {
            setupButtons = `
                <button class="button-style first btnDetails"><i class="fad fa-file-search"></i> 訂單詳情</button>
            `;
        };
        // 運費顯示
        if (data[i].Delivery_Fee == 0) {
            feeSet = `<span class="notes">免運費</span>`;
        } else {
            feeSet = `<span class="priceMark">${thousands(data[i].Delivery_Fee)}</span>`;
        };
        html += `
            <tr data-num="${data[i].Id}">
                <td class="order-first">
                    <div class="title-block">
                        <span class="order-tit"><i class="far fa-sticky-note"></i><span>編號</span></span>
                        <span class="order-num">${data[i].Id}</span>
                        <div class="date-block">
                            <span class="order-date">${data[i].Purchase_Date}</span>    
                        </div>
                    </div>
                    <div>
                        <span class="order-status" data-type="${data[i].Pay_Type_Id}">${data[i].Order_Status}</span>
                    </div>
                </td>
                <td class="order-list">
                    <a href="./member_order_view.html?odrId=${data[i].Id}">
            `+
            items
            + `
                    </a>
                </td>
                <td class="order-amount">
                    <div>
                        <span>商品金額</span>
                        <span class="priceMark ">${thousands(data[i].Order_Total)}</span>
                    </div>
                    <div>
                        <span>運費</span>
                        <div class="freeSet">${feeSet}</div>
                    </div>
                    <div>
                        <span>訂單金額</span>
                        <span class="priceMark amts">${thousands(parseInt(Number(data[i].Delivery_Fee) + Number(data[i].Order_Total)))}</span>
                    </div>
                </td>
                <td class="order-controls">
                    <div class="setupBlock">
            ` +
            setupButtons
            + `
                    </div>
                </td>
            </tr>
        `;
    };
    orders.html(html);
    // 訂單詳情
    $('.btnDetails').on('click', function (e) {
        e.preventDefault();
        let num = $(this).parents('tr').data('num');

        if (num) {
            // localStorage.setItem("orderNum", num);
            // let numz = localStorage.getItem("orderNum");
            // if (numz) { // 確認有將編號存入 Storage
            //     location.href = `./member_order_view.html?odrId=${num}`; // 跳轉至頁面
            // };
            location.href = `./member_order_view.html?odrId=${num}`; // 跳轉至頁面
        };
    });
    // 付款訊息
    $('.btnPayInfos').on('click', function (e) {
        e.preventDefault();
        let num = $(this).parents('tr').data('num');
        if (num) {
            location.href = `./flow_payments.html?id=${num}`;
        };
    });
    // 直接付款
    $('.btnPayments').on('click', function (e) {
        e.preventDefault();
        let num = $(this).parents('tr').data('num');
        if (confirm("您要重新支付此筆訂單嗎？")) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
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
};
// NOTFOUND
function fails() {
    // 分頁數
    mainLens = 1;
    pageLens = Math.ceil(mainLens / listSize);
    html = "";
    html = `
        <tr class="none">
            <td class="txt-left none">
                <span>目前沒有任何的訂單。</span>
            </td>
        </tr>
    `;
    orders.html(html);
    paginations.find('div').html(curPage(current, pageLens, pageCount));
};

$().ready(function () {
    //// 清除 localStorag 中可能留著的 orderNum
    // if (localStorage.getItem('orderNum')) {
    //     localStorage.removeItem('orderNum');
    // };
    // Filter
    orderLiv.on('click', function (e) {
        e.preventDefault();
        orderLiv.removeClass('active'), $(this).addClass('active');
        let clsNum = $(this).data("num");
        if (clsNum == "all") {
            dataObj.Sends = {
                // "id": "",
                // "order_status_id": "",
                // "startDate": "",
                // "endDate": "",
                // "count": "",
                "page": current
            };
        } else {
            dataObj.Sends = {
                // "id": "",
                "order_status_id": clsNum,
                // "startDate": "",
                // "endDate": "",
                // "count": "",
                "page": current
            };
        };
        // 判斷點擊時
        if (clsNum !== clsRcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
            pageRcd = ""; // 重置頁碼紀錄
            getTotalPages(dataObj).then(res => {
                if (res !== 0) {
                    pageLens = res; // 目前總頁數
                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                    // 點擊頁碼
                    paginations.unbind('click').on('click', 'li', function (e) {
                        e.preventDefault(), e.stopImmediatePropagation();
                        let num = $(this).find('a').data('num');
                        dataObj.Sends.count = dataObj.Counts; // 每次列出筆數
                        if (isNaN(num)) {
                            if (!$(this).hasClass("disabled")) {
                                if (num == "prev") {
                                    pageRcd--;
                                } else if (num == "next") {
                                    pageRcd++;
                                };
                                // 1. 產生分頁器
                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                // 2. 取得點擊頁碼後要呈現的內容
                                pageRcd = pageRcd, dataObj.Sends.page = pageRcd; // 紀錄當下頁碼 || 上下頁：以記錄的頁碼來做拋接值
                                getPageDatas(dataObj).then(res => {
                                    // DO SOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        fails();
                                    };
                                    $('html,body').scrollTop(0);
                                }, rej => {
                                    if (rej == "NOTFOUND") { };
                                });
                            };
                        } else {
                            if (clsNum !== clsRcd) {
                                $(this).addClass('active').siblings().removeClass('active');
                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                clsRcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                dataObj.Sends.page = current; // 傳送的頁碼
                                getPageDatas(dataObj).then(res => {
                                    // DO SOMETHING
                                    if (res !== null) {
                                        process(res);
                                    } else {
                                        fails();
                                    };
                                }, rej => {
                                    if (rej == "NOTFOUND") {
                                        fails();
                                    };
                                });
                            } else {
                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                    $(this).addClass('active').siblings().removeClass('active');
                                    // 1. 產生分頁器
                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                    // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                    pageRcd = num, dataObj.Sends.page = num // 記錄當下頁碼 || 傳送的頁碼
                                    getPageDatas(dataObj).then(res => {
                                        // DO SOMETHING
                                        if (res !== null) {
                                            process(res);
                                        } else {
                                            fails();
                                        };
                                        $('html,body').scrollTop(0);
                                    }, rej => {
                                        if (rej == "NOTFOUND") {
                                            fails();
                                        };
                                    });
                                } else { };
                            };
                        };
                    });
                    paginations.find('div li:first-child').trigger('click');
                } else {
                    clsRcd = clsNum; // 重新記錄目前的分類
                    fails();
                };
            }, rej => {
                if (rej == "NOTFOUND") { };
            });
        } else { };
    });
    orderLiv.eq(0).trigger('click');
});