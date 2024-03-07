// Member Track
let tracks = $('.tracks'), prices;
let qty = 1; //預設將追蹤商品加入購物車的數量

// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        prices = "";
        if (data[i].discount_price !== "" && data[i].discount_price !== 0 && data[i].discount_price !== null && data[i].discount_price !== undefined) {
            prices = `
                    <span class="orig priceMark"><s>${thousands(data[i].Sell_price)}</s></span>
                    <span class="disc priceMark">${thousands(data[i].discount_price)}</span>
                `;
        } else {
            prices = `
                    <span class="disc priceMark">${thousands(data[i].Sell_price)}</span>
                `;
        };
        html += `
            <tr data-num="${data[i].Spu_Id}" data-qty="${data[i].Stock_qty}">
                <td class="txt-left" data-title="商品資訊">
                    <div class="track-item">
                        <a class="track-link" href="./product_view.html?pdtId=${data[i].Spu_Id}">
                            <div class="images">
                                <img src="${IMGURL}products/${data[i].Spu_Id}/${data[i].Product_cover}">
                            </div>
                            <div class="main">
                                <p class="title abridged1" data-num="${data[i].Spu_Id}" title="${data[i].SPU_Title}">${data[i].SPU_Title}</p>
                                <p class="subTitle abridged1" data-num="${data[i].Sku_Id}" title="${data[i].SKU_Title}">${data[i].SKU_Title}</p>
                                <input type="hidden" class="sell_stop" value="0">
                            </div>
                        </a>
                    </div>
                </td>
                <td class="txt-right" data-title="商品金額">
                    <div class="track-price prices">
            `+
            prices
            + `
                    </div>
                </td>
                <td data-title="商品設定">
                    <div class="setupBlock">
                        <button class="button-style first btnAddCart"><i class="fas fa-shopping-bag"></i> 加入購物車</button>
                        <button class="button-style third btnRmTrack"><i class="fad fa-trash"></i> 移除</button>
                    </div>
                </td>
            </tr>
        `;
    }
    tracks.html(html);
    // 加入購物車
    $('.btnAddCart').on('click', function (e) {
        e.preventDefault();
        let dataObj = {
            "spu_id": $(this).parents('tr').data("num"),
            "sku_id": $(this).parents('tr').find('.subTitle').data('num'),
            "qty": qty,
            "stock_qty": $(this).parents('tr').data("qty"),
            "sell_stop": $(this).parents('tr').find('.sell_stop').val()
        };
        addCart(e, dataObj);
    });
    // 移除追蹤
    $('.btnRmTrack').on('click', function (e) {
        e.preventDefault();
        let num = $(this).parents('tr').find('.subTitle').data('num');
        let dataObj = {
            "Sku_id": num
        };
        if (confirm("您確定要移除這項商品的追蹤嗎？")) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200 || xhr.status == 204) {
                    alert("移除商品成功！");
                    location.reload();
                } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    getLogout();
                };
            };
            xhr.open('DELETE', `${URL}MemberUser/DeleteWish`, true)
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send($.param(dataObj));
        };
    });
    // 連至商品詳細頁
    // $('.track-link').on('click', function (e) {
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

};
// NOTFOUND
function fails() {
    html = "";
    html = `
        <tr class="none">
            <td colspan="3" class="txt-left none">
                <span>目前沒有追蹤任何商品。</span>
            </td>
        </tr>
    `;
    tracks.html(html);
};
$().ready(function () {
    // Tracks
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `MemberUser/GetWish`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    //
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            process(res);
        } else {
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") {
            // alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
            getLogout();
        };
    });
    // 全部移除
    $('.btnRmAll').on('click', function (e) {
        e.preventDefault();
        let len = $('.tracks').find('tr:not(.none)').length;
        if (len > 0) {
            if (confirm("您確定要移除所有商品的追蹤嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("移除商品成功！");
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        getLogout();
                    };
                };
                xhr.open('DELETE', `${URL}MemberUser/DeleteWish`, true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(null);
            };
        } else {
            alert("目前沒有追蹤的商品哦！");
        }
    });
});