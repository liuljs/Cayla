// Carousel
let carousel = $('.carousel-inner'), controls = $('.carousel-indicators'), items;
let recs = $('.product-list'), showProducts = 3; // 推薦前 3 筆

$().ready(function () {
    // Carousels
    let casObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `IndexSlideshow`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    getPageDatas(casObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            for (let i = 0; i < res.length; i++) {
                if (res[i].Image_Link !== "") {
                    items = `<a href="${res[i].Image_Link}" target="_blank" class="carousel-item" style="background-image: url('${res[i].Image_Url}')"></a>`;
                } else {
                    items = `<a class="carousel-item" style="background-image: url('${res[i].Image_Url}')"></a>`;
                };
                html += items;
            };
            carousel.html(html);
            //
            $('.carousel-item').eq(0).addClass('active');
            // Control
            let lengths = $('.carousel-item').length;
            if (lengths > 0) {
                html = "";
                for (let i = 0; i < lengths; i++) {
                    html += `
                    <li data-target="#carouselExampleIndicators" data-slide-to="${i}"></li>
                    `;
                };
                controls.html(html);
                controls.find('li').eq(0).addClass('active');
            };
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });

    // 商品推薦的前 3 筆
    let itemObj = {
        "Methods": "POST",
        "APIs": URL,
        "CONNECTs": `Product/GetProducts`,
        "QUERYs": "",
        "Counts": "",
        "Sends": {
            "cid1": "",
            "cid2": "",
            "cid3": "",
            "count": showProducts,
            "page": current,
            "recommend": 1
        },
    };
    getPageDatas(itemObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            for (let i = 0; i < res.length; i++) {
                if (res[i].Discount_Price !== "" && res[i].Discount_Price !== 0 && res[i].Discount_Price !== null && res[i].Discount_Price !== undefined) {
                    price = `
                        <span class="priceMark orig"><s>${thousands(res[i].Sell_Price)}</s></span>
                        <span class="priceMark disc">${thousands(res[i].Discount_Price)}</span>
                    `;
                } else {
                    price = `
                        <span class="priceMark disc">${thousands(res[i].Price)}</span>
                    `;
                };
                if (res[i].View_Sell_Num !== "" && res[i].View_Sell_Num !== 0 && res[i].View_Sell_Num !== null && res[i].View_Sell_Num !== undefined) {
                    sellQty = `
                        <div class="sellOty">
                            <span>已售出</span>
                            <span>${thousands(res[i].sell_qty)}</span>
                            <span>件</span>
                        </div>
                    `;
                } else {
                    sellQty = "";
                };
                html += `
                    <div data-num="${res[i].Id}" class="item">
                    <a href="./product_view.html?pdtId=${res[i].Id}">
                        <div class="images">
                            <img src="${IMGURL}products/${res[i].Id}/${res[i].Product_Cover}">
                        </div>
                        <div class="main">
                            <p class="title abridged2" title="${res[i].Title}">
                                ${res[i].Title}
                            </p>
                            <div>
                                <div class="prices">
                ` +
                    price
                    + `
                        </div>
                    ` +
                    sellQty
                    + `
                                </div>
                                </div>
                            </a>
                        </div>
                    `;
            };
            recs.html(html);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });

});