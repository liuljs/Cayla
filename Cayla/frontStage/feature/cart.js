// Member Cart
let carts = $('.carts'), prices, amt, total;
let totalQty = $('.total-qty'), totalAmt = $('.total-amount'), totals = $('.order-total');
let freeSet = $('.freeSet');
let minVal = 1, maxVal;
function qtyControls(num, newVal, qty, subTotals, qtyTotals, amtTotals, odrTotals, freeSet) {
    let dataObj = {
        "id": num,
        "quantity": newVal
    };
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status == 200 || xhr.status == 204) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200) {
                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                        let callBackData = JSON.parse(xhr.responseText);
                        amt = "";
                        // 商品總額
                        if (callBackData.Discount_Total !== "" && callBackData.Discount_Total !== 0 && callBackData.Discount_Total !== null && callBackData.Discount_Total !== undefined) {
                            amt = callBackData.Discount_Total;
                        } else {
                            amt = callBackData.Total;
                        };

                        let item = $.map(callBackData.Items, function (item, index) {
                            if (num == item.id) {
                                return item;
                            }
                        });
                        qty.val(newVal), subTotals.html(thousands(item[0].amount)), qtyTotals.html(callBackData.Count), amtTotals.html(thousands(amt)), odrTotals.html(thousands(amt));
                        if (amt >= freeRules) {
                            freeSet.html(`
                                <span>滿千元免運</span><span class="notes">免運費</span>
                            `);
                        } else {
                            freeSet.html(`
                                <span>滿千元免運</span>
                                <div class="notEnoughs">尚差 <span class="priceMark total-fee notes">${thousands(parseInt(Number(freeRules) - Number(amt)))}</span></div>
                            `);
                        };
                    };
                };
            };
            xhr.open('GET', `${URL}Orders/GetCart`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(null);
        } else {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    };
    xhr.open('PUT', `${URL}Orders/UpdateCart`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send($.param(dataObj));
};
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.Items.length; i++) {
        prices = "";
        if (data.Items[i].discount_price !== "" && data.Items[i].discount_price !== 0 && data.Items[i].discount_price !== null && data.Items[i].discount_price !== undefined) {
            prices = `
                <div class="prices">
                    <span class="cart-price orig priceMark"><s>${thousands(data.Items[i].price)}</s></span>
                    <span class="cart-price disc priceMark">${thousands(data.Items[i].discount_price)}</span>
                </div>
            `;
        } else {
            prices = `
                <div class="prices">
                    <span class="cart-price disc priceMark">${thousands(data.Items[i].price)}</span>
                </div>
            `;
        };
        html += `
            <tr data-num="${data.Items[i].id}" data-qty="${data.Items[i].stock_qty}">
                <td data-title="商品名稱">
                    <div class="cart-item" data-num="${data.Items[i].sku_id}">
                        <a class="cart-link" href="./product_view.html?pdtId=${data.Items[i].spu_id}">
                            <div class="images">
                                <img src="${IMGURL}products/${data.Items[i].spu_id}/${data.Items[i].product_cover}">
                            </div>
                            <div class="main">
                                <p class="title abridged1" data-num="${data.Items[i].spu_id}" title="${data.Items[i].spu}">${data.Items[i].spu}</p>
                                <p class="subTitle abridged1" data-num="${data.Items[i].sku_id}" title="${data.Items[i].sku}">${data.Items[i].sku}</p>
                            </div>
                        </a>
                    </div>
                </td>
                <td data-title="金額" class="text-right">
            `+
            prices
            + `
                </td>
                <td data-title="數量">
                    <div class="qty">
                        <div data-num="minus" class="btnMinus"><i class="fal fa-minus"></i></div>
                        <input type="text" class="edit_qty numberz" value="${data.Items[i].quantity}">
                        <div data-num="plus" class="btnPlus"><i class="fal fa-plus"></i></div>
                    </div>
                </td>
                <td data-title="小計" class="text-right">
                    <span class="sub-total priceMark">${thousands(data.Items[i].amount)}</span>
                </td> 
                <td data-title="功能">
                    <div class="setupBlock">
                        <a class="btnRemove"><i class="fad fa-trash"></i> 移除</a>
                    </div>
                </td>
            </tr>
        `;
    };
    carts.html(html);
    // 商品總額
    totalQty.html(data.Count);
    if (data.Discount_Total !== "" && data.Discount_Total !== 0 && data.Discount_Total !== null && data.Discount_Total !== undefined) {
        totalAmt.html(thousands(data.Discount_Total));
        totals.html(thousands(data.Discount_Total));
        amt = data.Discount_Total;
    } else {
        totalAmt.html(thousands(data.Total));
        totals.html(thousands(data.Total));
        amt = data.Total
    };
    // 是否免運費
    if (amt >= freeRules) {
        freeSet.html(`
            <span>滿千元免運</span><span class="notes">免運費</span>
        `);
    } else {
        freeSet.html(`
            <span>滿千元免運</span>
            <div class="notEnoughs">尚差 <span class="priceMark total-fee notes">${thousands(parseInt(Number(freeRules) - Number(amt)))}</span></div>
        `);
    };
};
// NOTFOUND
function fails() {
    html = "";
    html = `
        <tr class="none">
            <td colspan="5" class="txt-left none">
                <span>目前購物車沒有任何商品。</span>
            </td>
        </tr>
    `;
    carts.html(html);
    // 總額
    totalQty.html("0");
    totalAmt.html("0");
    totals.html("0");
};
$().ready(function () {

    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `Orders/GetCart`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
            // // 連至商品詳細頁
            // $('.cart-link').on('click', function (e) {
            //     e.preventDefault();
            //     let productNum = $(this).find('.title').data('num');
            //     if (productNum) {
            //         localStorage.setItem("productNum", productNum);
            //         let numz = localStorage.getItem("productNum");
            //         if (numz) { // 確認有將消息編號存入 Storage
            //             location.href = `./product_view.html?pdtId=${num}`; // 跳轉至消息頁面
            //         };
            //     };
            // });
            // 數量增減
            $('.qty').find('input').on('change', function () {
                let trz = $(this);
                let num = trz.parents('tr').data('num'), newVal;
                // 最大數量
                maxVal = trz.parents('tr').data('qty');
                if (trz.val() == "" || trz.val() == 0) {
                    trz.val(minVal);
                    newVal = minVal;
                } else if (trz.val() > maxVal) {
                    alert(`不好意思，目前此商品的最大購買數量為 ${maxVal} 件。`);
                    trz.val(maxVal);
                    newVal = maxVal;
                } else {
                    newVal = trz.val();
                };
                qtyControls(num, newVal, trz.parents('.qty').find('input'), trz.parents('tr').find('.sub-total'), totalQty, totalAmt, totals, $('.freeSet'));
            });
            // 數量控制項
            $('.qty').find('div').on('click', function () {
                let trz = $(this).parents('tr');
                let num = trz.data('num');
                let val = trz.find('.edit_qty'), newVal;
                // 最大數量
                maxVal = trz.data('qty');
                if ($(this).data('num') == "minus") {
                    if (val.val() > minVal) {
                        newVal = parseFloat(val.val()) - 1;
                        qtyControls(num, newVal, val, trz.find('.sub-total'), totalQty, totalAmt, totals, $('.freeSet'));

                    } else {
                        newVal = minVal;
                    };
                } else {
                    if (val.val() < maxVal) {
                        newVal = parseFloat(val.val()) + 1;
                        qtyControls(num, newVal, val, trz.find('.sub-total'), totalQty, totalAmt, totals, $('.freeSet'));
                    } else {
                        newVal = maxVal;
                        alert(`不好意思，目前此商品的最大購買數量為 ${maxVal} 件。`)
                    };
                };
            });
            // 移除購物車商品
            $('.btnRemove').on('click', function (e) {
                e.preventDefault();
                let num = $(this).parents('tr').data('num');
                if (confirm("您確定要移除這件商品嗎？")) {
                    let dataObj = {
                        "id": num
                    };
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            alert("移除商品成功！");
                            location.reload();
                        };
                    };
                    xhr.open('DELETE', `${URL}Orders/DeleteCart`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                    xhr.send($.param(dataObj));
                }
            });
            // Next Part
            $('.btnNextPart').on('click', function (e) {
                e.preventDefault();
                if (Number(totalQty.html()) > 0) {
                    if (Number(totals.html()) < 100) {
                        alert("訂單成立金額需滿 100 元！")
                    } else {
                        location.href = "./flow_consignee.html";
                    };
                } else {
                    alert('目前購物車中沒有加入任何商品哦！');
                }
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
});