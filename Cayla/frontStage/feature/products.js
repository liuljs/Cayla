// Products List
let clsTitle = $('.clsTitle'), lists = $('.product-list'), price, sellQty;
// 分類
let firstCls = $('.firstCls');// Category 宣告第一層分類層
let secondItems, secondItem, thirdItems, thirdItem, arrow;
// 
let clsFirstRcd, clsSecondRcd, clsThirdRcd;
// 搜尋
let searchs = $('.searchs'), btnPdtSearch = $('.btnPdtSearch');
// 
let dataObj = {
    "Methods": "POST",
    "APIs": URL,
    "CONNECTs": `Product/GetProducts`,
    "QUERYs": "",
    "Counts": listSize,
    "Sends": {
        "keyword": "",
        "cid1": "",
        "cid2": "",
        "cid3": "",
        "count": "",
        "page": ""
    },
};
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        //
        if (data[i].Discount_Price !== "" && data[i].Discount_Price !== 0 && data[i].Discount_Price !== null && data[i].Discount_Price !== undefined) {
            price = `
                <span class="priceMark orig"><s>${thousands(data[i].Sell_Price)}</s></span>
                <span class="priceMark disc">${thousands(data[i].Discount_Price)}</span>
            `;
        } else {
            price = `
                <span class="priceMark disc">${thousands(data[i].Price)}</span>
            `;
        };
        //
        if (data[i].View_Sell_Num !== "" && data[i].View_Sell_Num !== 0 && data[i].View_Sell_Num !== null && data[i].View_Sell_Num !== undefined) {
            sellQty = `
                <div class="sellOty">
                    <span>已售出</span>
                    <span>${thousands(data[i].sell_qty)}</span>
                    <span>件</span>
                </div>
            `;
        } else {
            sellQty = "";
        };
        //
        html += `
            <div data-num="${data[i].Id}" class="item">
                <a href="./product_view.html?pdtId=${data[i].Id}">
                    <div class="images">
                        <img src="${IMGURL}products/${data[i].Id}/${data[i].Product_Cover}">
                    </div>
                    <div class="main">
                        <p class="title abridged2" title="${data[i].Title}">
                            ${data[i].Title}
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
    lists.html(html);
};
// NOTFOUND
function fails() {
    pageLens = 1; // 沒有搜尋到訂單，頁數呈現為 1 頁
    html = "";
    html = `
        <div class="results">
            <div class="images"><img src="./img/searchs.png"></div>
            <div>
                <p>未找到與此相關的商品</p>
                <p>您可以重新搜尋不同的商品或者常見的關鍵字</p>
            </div>
        </div>
    `;
    lists.html(html);
    paginations.find('div').html('').html(curPage(current, pageLens, pageCount));
};
$().ready(function () {
    // // 清除 localStorag 中可能留著的 productNum
    // if (localStorage.getItem('productNum')) {
    //     localStorage.removeItem('productNum');
    // };
    // 渲染出商品分類的 Filters
    let clsObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `Category`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
    // Classification
    getPageDatas(clsObj).then(res => {
        // 全部
        html = `
            <li data-num="all" class="firstItem">
                <a>
                    <span><i class="fad fa-circle"></i> 全部商品</span>
                </a>
            </li>
        `;
        for (let i = 0; i < res.length; i++) {
            if (res[i].SubCategories.length !== 0) {
                secondItem = "";
                for (let j = 0; j < res[i].SubCategories.length; j++) {
                    thirdItem = "";
                    if (res[i].SubCategories[j].SubCategories.length !== 0) {
                        for (let z = 0; z < res[i].SubCategories[j].SubCategories.length; z++) {
                            thirdItem += `
                                <li data-num="${res[i].SubCategories[j].SubCategories[z].Id}" class="thirdItem"><a>${res[i].SubCategories[j].SubCategories[z].Name}</a></li>
                            `;
                        }
                        arrow = `<span class="arrow"></span>`;
                        secondItem += `
                            <li data-num="${res[i].SubCategories[j].Id}" data-target="${res[i].SubCategories[j].Id}" class="secondItem">
                                <a>${res[i].SubCategories[j].Name}
                            ` +
                            arrow
                            + `
                                </a>
                            </li>
                            <ul id="${res[i].SubCategories[j].Id}" class="sub-menu thirdCls">
                            ` +
                            thirdItem
                            + `
                            </ul>
                        `;
                    } else {
                        secondItem += `
                            <li data-num="${res[i].SubCategories[j].Id}" class="secondItem"><a>${res[i].SubCategories[j].Name}</a></li>
                        `;
                    };
                };
                secondItems = `
                <ul id="${res[i].Id}" class="sub-menu secondCls">
                    ` +
                    secondItem
                    + `
                    </ul>
                `;
                arrow = `<span class="arrow"></span>`;
            } else {
                arrow = "", secondItems = "";
            };
            html += `
                <li data-num="${res[i].Id}" data-target="${res[i].Id}" class="firstItem">
                    <a>
                        <span><i class="fad fa-circle"></i> ${res[i].Name}</span>
                ` +
                arrow
                + `
                    </a>
                </li>
                `+
                secondItems;
        };
        firstCls.html(html);
        // FIRST
        $('.firstCls').find('.firstItem').on('click', function (e) {
            e.preventDefault();
            // 如果有搜尋痕跡的話，將其清除
            if (request('search') || dataObj.Sends.keyword !== "" || searchs.val() !== "") {
                window.history.pushState({}, document.title, "/" + "product_list.html");
                dataObj.Sends.keyword = ""; // 清除 Keyword
                searchs.val(''); // 清除 Search Bar
                // 回復預設 Title
                clsTitle.html(`
                    <i class="fad fa-gifts"></i>
                    <span>商品列表</span>
                `);
            };
            // 是否要展開第二層分類
            if ($(`#${$(this).data('target')} li`).length !== 0) {
                if ($(this).hasClass('active')) {
                    $(`#${$(this).data('target')}`).slideToggle('normal')
                } else {
                    $(`#${$(this).data('target')}`).slideDown('normal');
                };
            };
            $(this).addClass('active').siblings('').removeClass('active');
            // 取得點選的第一層
            let clsNum = $(this).data('num');
            // 依點擊的第一層分類下去做篩選，並取得總筆數 (清除第二、第三層的取值)
            if (clsNum == "all") {
                clsFirstRcd = "", clsSecondRcd = "", clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            } else {
                clsFirstRcd = clsNum, clsSecondRcd = "", clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls1Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
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
                                if (clsNum !== cls1Rcd) {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    cls1Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                    cls2Rcd = "", cls3Rcd = "" // 重設已記錄第二層、第三層
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
                                }
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        cls1Rcd = clsNum; // 重新記錄目前的分類
                        cls2Rcd = "", cls3Rcd = "" // 重設已記錄第二層、第三層
                        fails();
                    }
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
                // 清除第二層分類的點選狀態
                $('.secondCls').find('.secondItem').removeClass('active');
                // 清除第三層分類的點選狀態
                $('.thirdCls').find('.thirdItem').removeClass('active');
            } else { };
        });
        // SECOND
        $('.secondCls').find('.secondItem').on('click', function (e) {
            e.preventDefault();
            // 取得第二層（當前）
            let clsNum = $(this).data('num');
            // 取隸屬的第一層
            let clsFirst = Number($(this).parents('.secondCls').attr('id'));
            if (!$('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).hasClass('active')) {
                // 隸屬的第一層必須為點擊狀態 (active)
                $('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).addClass('active').siblings().removeClass('active');
                // 須將記錄記為隸屬的第一層
                cls1Rcd = clsFirst;
            };
            // 是否展開第三層分類
            if ($(`#${$(this).data('target')} li`).length !== 0) {
                if ($(this).hasClass('active')) {
                    $(`#${$(this).data('target')}`).slideToggle('normal')
                } else {
                    $(`#${$(this).data('target')}`).slideDown('normal');
                };
            };
            // 清除其餘第二層的選擇狀態
            $('.secondCls').find('.secondItem').removeClass('active'), $(this).addClass('active');
            if (clsNum) {
                clsFirstRcd = cls1Rcd, clsSecondRcd = clsNum, clsThirdRcd = "";
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls2Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
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
                                if (clsNum !== cls2Rcd) {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    $('.thirdCls').find('.thirdItem').removeClass('active'); // 清除所有第三層的點擊
                                    cls2Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                    cls3Rcd = "" // 重設已記錄第三層
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
                                        if (rej == "NOTFOUND") { };
                                    });
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        $(this).addClass('active').siblings().removeClass('active');
                                        // 1. 產生分頁器
                                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                        pageRcd = num, dataObj.Sends.page = num  // 記錄當下頁碼 || 傳送的頁碼
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
                                    } else { };
                                }
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        cls2Rcd = clsNum, cls3Rcd = ""; // 重新記錄目前的分類 || 重設已記錄第三層
                        fails();
                    };
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
            } else { };
        });
        // THIRD
        $('.thirdCls').find('.thirdItem').on('click', function (e) {
            e.preventDefault();
            // 取得第三層（當前）
            let clsNum = $(this).data('num');
            // 取隸屬的第一層
            let clsFirst = Number($(this).parents('.secondCls').attr('id'));
            // 取隸屬的第二層
            let clsSecond = Number($(this).parents('.thirdCls').attr('id'));
            if (!$('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).hasClass('active')) {
                // 隸屬的第一層 必須為點擊狀態 (active)
                $('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).addClass('active').siblings().removeClass('active');
                // 須將記錄記為隸屬的第一層
                cls1Rcd = clsFirst;
                // 隸屬的第二層 必須為點擊狀態 (active)
                $('.secondCls').find('.secondItem').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                $('.secondCls').find(`.secondItem[data-target="${clsSecond}"]`).addClass('active');
                // 須將記錄記為隸屬的第二層
                cls2Rcd = clsSecond;
            } else {
                // 隸屬的第二層的 Id　必須為點擊狀態 (active)
                $('.secondCls').find('.secondItem').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                $('.secondCls').find(`.secondItem[data-target="${clsSecond}"]`).addClass('active');
                // 須將記錄記為隸屬的第二層 Id
                cls2Rcd = clsSecond;
            };
            // 清除其餘第三層的選擇狀態
            $('.thirdCls').find('.thirdItem').removeClass('active'), $(this).addClass('active');
            if (clsNum) {
                clsFirstRcd = cls1Rcd, clsSecondRcd = cls2Rcd, clsThirdRcd = clsNum;
                dataObj.Sends.cid1 = clsFirstRcd;
                dataObj.Sends.cid2 = clsSecondRcd;
                dataObj.Sends.cid3 = clsThirdRcd;
                dataObj.Sends.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                dataObj.Sends.page = current; // 重新選擇分類的話，預設為第一頁開始
            };
            // 判斷點擊時
            if (clsNum !== cls3Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                pageRcd = ""; // 重置頁碼紀錄
                getTotalPages(dataObj).then(res => {
                    if (res !== 0) {
                        pageLens = res; // 目前總頁數
                        paginations.find('div').html(curPage(current, pageLens, 3));
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
                                if (clsNum !== cls3Rcd) {
                                    $(this).addClass('active').siblings().removeClass('active');
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    cls3Rcd = clsNum, pageRcd = current; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
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
                                        if (rej == "NOTFOUND") { };
                                    });
                                } else {
                                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                        $(this).addClass('active').siblings().removeClass('active');
                                        // 1. 產生分頁器
                                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                                        pageRcd = num, dataObj.Sends.page = num  // 記錄當下頁碼 || 傳送的頁碼
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
                                    } else { };
                                }
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        cls3Rcd = clsNum; // 重新記錄目前的分類
                        fails();
                    };
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
            } else { };
        });
        // 有用搜尋的話，呈現搜尋結果；沒有則為預設（全部商品）
        if (request('search')) {
            // 呈現搜尋結果
            let key = decodeURI(request('search'));
            // 搜尋 Title
            clsTitle.html(`
                <i class="fad fa-search"></i>
                <span> 關鍵字 "<span class="keywords">${key}</span>" 搜尋結果</span>
            `);
            cls1Rcd = "", cls2Rcd = "", cls3Rcd = "", pageRcd = "";// 使用搜尋，清空目前記錄的篩選
            let clsNum = key; // 搜尋
            dataObj.Sends = {
                "keyword": clsNum,
                "cid1": "",
                "cid2": "",
                "cid3": "",
                "count": "",
                "page": ""
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
                                }
                            };
                        });
                        paginations.find('div li:first-child').trigger('click');
                    } else {
                        clsRcd = clsNum; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                        fails();
                    }
                }, rej => {
                    if (rej == "NOTFOUND") { };
                });
            } else { };
        } else {
            // 預設 Title
            clsTitle.html(`
                <i class="fad fa-gifts"></i>
                <span>商品列表</span>
            `);
            // 預設點擊全部商品 || 點擊紀錄的第一層分類
            firstCls.find(`.firstItem`).eq(0).trigger('click');
        };
        if (($(window).width() + 17) < 1024) {
            $('.menu-list').addClass('none');
            $('.btnSideMenu').on('click', function () {
                if ($(this).hasClass('active')) {
                    $('.menu-list').slideUp('normal');
                    $(this).removeClass('active');
                } else {
                    $('.menu-list').slideDown('normal');
                    $(this).addClass('active');
                };
            });
        };
        $(window).on('resize', function () {
            if (($(document).width() + 17) < 1024) {
                $('.menu-list').addClass('none');
                $('.menu-list').slideUp(0);
                $('.btnSideMenu').unbind('click').on('click', function () {
                    if ($(this).hasClass('active')) {
                        $('.menu-list').slideUp('normal');
                        $(this).removeClass('active');
                    } else {
                        $('.menu-list').slideDown('normal');
                        $(this).addClass('active');
                    };
                });
            } else {
                $('.menu-list').removeClass('none');
                $('.menu-list').slideDown(0);
                $('.btnSideMenu').unbind('click');
            };
        });
        // 搜尋功能
        btnPdtSearch.on('click', function () {
            if (searchs.val() !== "") {
                // 搜尋 Title
                let key = searchs.val();
                clsTitle.html(`
                    <i class="fad fa-search"></i> 關鍵字 "<span class="keywords">${key}</span>" 搜尋結果
                `);
                let clsNum = key; // 搜尋
                dataObj.Sends = {
                    "keyword": clsNum,
                    "cid1": "",
                    "cid2": "",
                    "cid3": "",
                    "count": "",
                    "page": ""
                };
                cls1Rcd = "", cls2Rcd = "", cls3Rcd = "", pageRcd = ""; // 使用搜尋，清空目前記錄的篩選
                // 清除點擊痕跡
                $('.firstCls').find('.firstItem').removeClass('active');
                $('.secondCls').find('.secondItem').removeClass('active');
                $('.thirdCls').find('.thirdItem').removeClass('active');
                $('.sub-menu').slideUp(0);
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
                            clsRcd = clsNum; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                            fails();
                        }
                    }, rej => {
                        if (rej == "NOTFOUND") { };
                    });
                } else { };

            } else {
                alert("請輸入商品名稱或關鍵字！");
            };
        });
        searchs.on('change', function (e) {
            e.preventDefault();
            if ($(this).val() == "") {
                // 當使用搜尋功能值為空時，會顯示全部
                firstCls.find(`.firstItem`).eq(0).trigger('click');
            };
        });
        // 點擊商品
        // $(document).on('click', '.item', function (e) {
        //     e.preventDefault();
        //     let num = $(this).data('num');
        //     if (num) {
        //         localStorage.setItem("productNum", num);
        //         let numz = localStorage.getItem("productNum");
        //         if (numz) { // 確認有將消息編號存入 Storage
        //             location.href = `./product_view.html?pdtId=${num}`; // 跳轉至消息頁面
        //         };
        //     };
        // });
    });
});