// Product Detail
let productz = $('#product-detail');
let breadz = $('.current');
// 輪播
let swipers = $('.swiper-wrapper');
// 商品資訊
let marketings = $('.marketings');
let productTitle = $('.product-title'), productInfo = $('.product-info'), productPrices = $('.product-prices'), specPrice = $('.spec-price'), productDesc = $('.product-desc'), productFee = $('.product-fee'),
    productSpec = $('.product-spec');
let price;
let showFeeSet = $('.showFeeSet');
let specs = $('.specs'), specItem = $('.spec-item');
let remainQty, minVal, maxVal; // 至少買一件，最多買（依規格庫存訂定）
let btnAddCart = $('.btnAddCart'), btnAddWish = $('.btnAddWish');
// let stockingDate = $('.stocking-date'), shipmentDayz = $('.shipmentDayz');
let productStand = $('.product-stand'), productStatus = $('.product-status'), pdtStatus = $('.pdtStatus');
let pdtTabs = $('.pdtTabs'), productTab = $('.product-tab');
let tabContent1 = $('#editorz1'), tabContent2 = $('#editorz2');
let qties = $('.qties'), qty = $('.qty'), edit_qty = $('.edit_qty'); // 取頁面上要增加的數量
let remainingStock = $('.remaining-stock'), stocks;
// Ask Part
let asks = $('.ask-items');

// 接收資料，做渲染、處理
function process(data) {
    console.log(data)
    // 記錄商品 Id
    productz.attr('data-num', data.Id);
    // 麵包屑
    breadz.html(data.Title), breadz.attr('title', data.Title);
    // 封面圖 // 第一張為封面圖
    html = "";
    if (data.Product_Cover) {
        html = `
            <div class="swiper-slide"><img src="${IMGURL}products/${data.Id}/${data.Product_Cover}"></div>
        `;
        swipers.html(html);
    }
    // 輪播圖
    html = "";
    for (let i = 1; i < imgLimit + 1; i++) { // 對應名稱從 1 開始算，總數限制 + 1 才為對應正常數值 
        // 如果有就加入輪播圖
        if (data[`Product0${i}`] !== "" && data[`Product0${i}`] !== null) {
            html += `
                <div class="swiper-slide"><img src="${IMGURL}/products/${data.Id}/${data[`Product0${i}`]}"></div>
            `;
        };
    };
    swipers.append(html);
    var swiper = new Swiper('.swiper-container', {
        spaceBetween: 30,
        centeredSlides: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
    // 行銷時間
    if (data.Marketing_Title !== "" && data.Marketing_Title !== null) {
        html = "";
        html = `
                <div class="marketing-title"><i class="far fa-bookmark"></i> <span class="mktTitle">${data.Marketing_Title}</span></div>
            `;
        marketings.append(html);

        if (data.Marketing_Starts_At !== "" || data.Marketing_Ends_At !== "") {
            html = "";
            html = `
                <div class="marketing-date"><span class="date mktStart">${data.Marketing_Starts_At.split(' ')[0]}</span><span class="markz">-</span><span class="date mktEnd">${data.Marketing_Ends_At.split(' ')[0]}</span></div>
            `;
            marketings.append(html);
        }
    };
    // 商品名稱
    productTitle.html(data.Title), productTitle.attr('title', data.Title);
    // 商品各個規格顯示
    if (data.SellInfos.length > 0) {
        // 各個規格價格
        html = "";
        for (let i = 0; i < data.SellInfos.length; i++) {
            if (data.SellInfos[i].Discount_Price !== "" && data.SellInfos[i].Discount_Price !== 0 && data.SellInfos[i].Discount_Price !== null && data.SellInfos[i].Discount_Price !== undefined) {
                price = `
                    <div class="prices">
                        <span class="orig priceMark"><s>${thousands(data.SellInfos[i].Sell_Price)}</s></span>
                        <span class="disc priceMark">${thousands(data.SellInfos[i].Discount_Price)}</span>
                    </div>
                    <div class="qtas"><span>約</span><span class="qta">${data.SellInfos[i].Discount_Percent / 10}</span><span>折</span></div>
                `;
            } else {
                price = `
                    <div class="prices">
                        <span class="disc priceMark">${thousands(data.SellInfos[i].Sell_Price)}</span>
                    </div>
                `;
            };
            html += `
                <div class="spec-price">
                `+
                price
                + `
                </div>
            `;

        };
        productPrices.html(html);
        $('.spec-price').eq(0).addClass('active'); // 預設選擇第一筆的
        // 各個規格顯示
        html = "";
        for (let i = 0; i < data.SellInfos.length; i++) {
            html += `
                <div data-num="${data.SellInfos[i].Id}" class="spec-item" data-qty="${data.SellInfos[i].Stock_Qty}">${data.SellInfos[i].Title}</div>
            `;
        };
        specs.html(html);
        // 銷售量
        if (data.View_Sell_Num !== 0) {
            html = "";
            for (let i = 0; i < data.SellInfos.length; i++) {
                html += `
                    <div class="product-sales"> 已售出 <span class="sales">${thousands(data.SellInfos[i].Sell_Qty)}</span> 件</div>
                `;
            };
        } else {
            html = "";
        };
        productInfo.html(html);
        // 庫存數
        if (data.View_Stock !== 0) {
            html = "";
            for (let i = 0; i < data.SellInfos.length; i++) {
                if (data.SellInfos[i].Stock_Qty <= 0) {
                    remainQty = 0;
                } else {
                    remainQty = data.SellInfos[i].Stock_Qty;
                }
                html += `
                    <div class="stocks">庫存數<span>${remainQty}</span>件</div>
                `;
            };
        } else {
            html = "";
        };
        remainingStock.html(html);
        // 停售
        if (data.Sell_Stop !== 0) {
            // 取消填寫數量欄位
            qties.find('.qty').remove();
            qties.find('.remaining-stock').remove();
            qties.html(`
                <span class="discontinued"><i class="far fa-ban"></i> 停售</span>
            `);
            // 禁止加入購物車
            btnAddCart.unbind('click').addClass('none');
        };
        // 選擇要購買的規格
        $('.spec-item').on('click', function (e) {
            e.preventDefault();
            let trz = $(this);
            // 選擇
            trz.addClass('active').siblings().removeClass('active');
            // 顯示對應的出售數量
            $('.product-sales').eq(trz.index()).addClass('active').siblings().removeClass('active');
            // 顯示對應價格
            $('.spec-price').eq(trz.index()).addClass('active').siblings().removeClass('active');
            // 顯示對應的目前庫存數量
            $('.stocks').eq(trz.index()).addClass('active').siblings().removeClass('active');
            // 目前庫存數為 0 則不能購買；目前商品停售，則不能購買
            if ($(this).data('qty') <= 0 || data.Sell_Stop == 1) {
                // 最少購買數量變為 0
                edit_qty.val(0);
                minVal = 0, maxVal = 0;
                // 禁止加入購物車
                btnAddCart.unbind('click').addClass('none');
            } else {
                // 最少購買數（至少要 1 件）
                edit_qty.val(1);
                minVal = 1, maxVal = Number($(this).data('qty')); // 最大購買數
                // 
                btnAddCart.unbind('click').removeClass('none').on('click', function (e) {
                    e.preventDefault();
                    let dataObj = {
                        "spu_id": $('#product-detail').data('num'), // 選取的商品規格 Id
                        "sku_id": $('.spec-item.active').data('num'), // 選取的商品規格 Id
                        "qty": $('.edit_qty').val(),
                        "stock_qty": $('.spec-item.active').data('qty'),
                        "sell_stop": data.Sell_Stop
                    };
                    addCart(e, dataObj);
                });
            };
        });
        $('.spec-item').eq(0).trigger('click');
        // 數量填寫
        edit_qty.val(minVal);
        edit_qty.on('input', function () {
            if ($(this).val() == 0) {
                $(this).val(minVal);
            } else if ($(this).val() > maxVal) {
                $(this).val(maxVal)
            };
        });
    } else {
        // 取消填寫數量欄位
        qties.find('.qty').remove();
        qties.find('.remaining-stock').remove();
        // 禁止加入購物車
        btnAddCart.unbind('click').addClass('none');
    };
    // 商品敘述
    if (data.Describe !== "" && data.Describe !== null) {
        let descArr = data.Describe.split(',');
        html = "";
        for (let i = 0; i < descArr.length; i++) {
            html += `
                <li><span>${descArr[i]}</span></li>
            `;
        };
        productDesc.find('ol').html(html);
    };
    // 商品規格
    if (data.Spec !== "" && data.Spec !== null) {
        productStand.html(data.Spec);
    } else {
        productStand.html(`目前沒有任何規格說明。`);
    };
    // 備貨時程
    // if (data.Preserve_Status > 3) {
    //     stockingDate.html('').html(`
    //         <span>較長時程（會在<span class="shipmentDayz">${data.Preserve_Status}</span>內出貨）</span>
    //     `);
    // } else {
    //     stockingDate.html('').html(`
    //         <span>一般時程（會在<span class="shipmentDayz">${data.Preserve_Status}</span>天內出貨）</span>
    //     `);
    // };

    // 保存狀況
    if (data.Product_Status == 0) {
        productStatus.html('').html(`
            <span class="pdtStatus">全新商品</span>
        `);
    } else {
        productStatus.html('').html(`
            <span class="pdtStatus">二手商品</span>
        `);
    };
    // TabContents // 至少會有一個
    html = "";
    html = quill_0.setContents(JSON.parse(data.Detail.Introduction1).ops);
    tabContent1.html(quill_0.root.innerHTML);
    pdtTabs.append(`
        <li class="nav-item product-tab">
            <a class="nav-link active" data-toggle="tab" href="#tit1">${data.Detail.Title1}</a>
        </li>
    `);
    if (data.Detail.Title2 !== "") {
        pdtTabs.append(`
        <li class="nav-item product-tab">
            <a class="nav-link" data-toggle="tab" href="#tit2">${data.Detail.Title2}</a>
        </li>
        `);
        html = "";
        html = quill_1.setContents(JSON.parse(data.Detail.Introduction2).ops);
        tabContent2.html(quill_1.root.innerHTML);
    };
    // Ask 訪客、會員都能看到
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "Product/GetProductsQnA",
        "QUERYs": "",
        "Counts": "",
        "Sends": {
            "spu_id": data.Id
        }
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            for (let i = 0; i < data.length; i++) {
                html += `
                <div data-num="${data[i].id}" class="ask-item">
                    <div class="ask-question">
                        <div class="ask-name"><span>${data[i].account} 提問：</span></div>
                        <p>${data[i].quection}</p>
                        <p class="ask-time">發問於 ${data[i].created_at.split('T')[0]}</p>
                    </div>
                    <div class="ask-answer">
                        <p>賣家回覆：</p>
                        <p>${data[i].answer}</p>
                        <p class="ask-time">回答於 ${data[i].updated_at.split('T')[0]}</p>
                    </div>
                </div>
                `;
            };
            asks.html(html);
        } else {
            html = "";
            html = `
                <div class="ask-item none">
                    <span> 目前沒有任何的詢問紀錄。</span>
                </div>
            `;
            asks.html(html);
        };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
};
// NOTFOUND
function fails() { };

$().ready(function () {
    // 從 localStorage 取編號，用於呼叫資訊
    // let num = localStorage.getItem('productNum');
    let num = request('pdtId');
    if (num) {
        // PRODUCT DETAIL
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `Product/${num}`,
            "QUERYs": "",
            "Counts": "",
            "Sends": "",
        };
        getPageDatas(dataObj).then(res => {
            // DOSOMETHING
            if (res !== null) {
                process(res);
            } else {
                fails();
            };
        }, rej => {
            if (rej == "NOTFOUND") { };
        });
    };
    // 數量增減
    qty.find('div').on('click', function () {
        let trz = $(this);
        let val = trz.parents('.qty').find('input').val(), newVal;
        if (trz.data('num') == "minus") {
            if (val > minVal) {
                newVal = parseFloat(val) - 1;
            } else {
                newVal = minVal;
            }
        } else {
            if (val < maxVal) {
                newVal = parseFloat(val) + 1;
            } else {
                newVal = maxVal;
            }
        }
        trz.parents('.qty').find('input').val(newVal);
    });
});