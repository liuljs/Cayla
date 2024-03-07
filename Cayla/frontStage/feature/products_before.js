// Products List 
let lists = $('.product-list'), price, sellQty;
let clsTitle = $('.clsTitle');
let searchs = $('.searchs'), btnPdtSearch = $('.btnPdtSearch');
// Category 宣告第一層分類層
let firstCls = $('.firstCls'), secondItems, secondItem, thirdItems, thirdItem, arrow;
// 
let clsObj = {
    "keyword": "",
    "cid1": "",
    "cid2": "",
    "cid3": "",
    "count": "",
    "page": ""
};
// Current Variable
let clsFirstRcd, clsSecondRcd, clsThirdRcd;
$().ready(function () {
    // // 清除 localStorag 中可能留著的 productNum
    // if (localStorage.getItem('productNum')) {
    //     localStorage.removeItem('productNum');
    // };
    // 渲染出商品分類的 Filter
    let cls = new XMLHttpRequest();
    cls.onload = function () {
        if (cls.status == 200) {
            if (cls.responseText !== "" && cls.responseText !== "[]") {
                let callBackData = JSON.parse(cls.responseText);
                html = `
                    <li data-num="all" class="firstItem">
                        <a>
                            <span><i class="fad fa-circle"></i> 全部商品</span>
                        </a>
                    </li>
                `;
                for (let i = 0; i < callBackData.length; i++) {
                    if (callBackData[i].SubCategories.length !== 0) {
                        secondItem = "";
                        for (let j = 0; j < callBackData[i].SubCategories.length; j++) {
                            thirdItem = "";
                            if (callBackData[i].SubCategories[j].SubCategories.length !== 0) {
                                for (let z = 0; z < callBackData[i].SubCategories[j].SubCategories.length; z++) {
                                    thirdItem += `
                                        <li data-num="${callBackData[i].SubCategories[j].SubCategories[z].Id}" class="thirdItem"><a>${callBackData[i].SubCategories[j].SubCategories[z].Name}</a></li>
                                    `;
                                }
                                arrow = `<span class="arrow"></span>`;
                                secondItem += `
                                    <li data-num="${callBackData[i].SubCategories[j].Id}" data-target="${callBackData[i].SubCategories[j].Id}" class="secondItem">
                                        <a>${callBackData[i].SubCategories[j].Name}
                                    ` +
                                    arrow
                                    + `
                                        </a>
                                    </li>
                                    <ul id="${callBackData[i].SubCategories[j].Id}" class="sub-menu thirdCls">
                                    ` +
                                    thirdItem
                                    + `
                                    </ul>
                                `;
                            } else {
                                secondItem += `
                                    <li data-num="${callBackData[i].SubCategories[j].Id}" class="secondItem"><a>${callBackData[i].SubCategories[j].Name}</a></li>
                                `;
                            };
                        };
                        secondItems = `
                            <ul id="${callBackData[i].Id}" class="sub-menu secondCls">
                            ` +
                            secondItem
                            + `
                            </ul>
                        `;
                        arrow = `<span class="arrow"></span>`;
                    } else {
                        arrow = "";
                        secondItems = "";
                    };
                    html += `
                        <li data-num="${callBackData[i].Id}" data-target="${callBackData[i].Id}" class="firstItem">
                            <a>
                                <span><i class="fad fa-circle"></i> ${callBackData[i].Name}</span>
                        ` +
                        arrow
                        + `
                            </a>
                        </li>
                    `+ secondItems;
                };
                firstCls.html(html);
                // First FilterItem
                $('.firstCls').find('.firstItem').on('click', function () {
                    // 如果有搜尋痕跡的話，將其清除
                    if (request('search') || clsObj.keyword !== "") {
                        window.history.pushState({}, document.title, "/" + "product_list.html");
                        clsObj.keyword = ""; // 清除 Keyword
                        searchs.val(''); // 清除 searchBar
                        // 回復預設 Title
                        clsTitle.html(`
                            <i class="fad fa-gifts"></i>
                            <span>商品列表</span>
                        `);
                    };
                    // 展開第二層分類
                    if ($(`#${$(this).data('target')} li`).length !== 0) {
                        if ($(this).hasClass('active')) {
                            $(`#${$(this).data('target')}`).slideToggle('normal')
                        } else {
                            $(`#${$(this).data('target')}`).slideDown('normal');
                        };
                    };
                    $(this).addClass('active').siblings('').removeClass('active');
                    // 取得點選的第一層 Id
                    let clsNum = $(this).data('num');
                    // 依點擊的第一層分類下去做篩選，並取得總筆數 (清除第二、第三層的取值)
                    if (clsNum == "all") {
                        clsFirstRcd = "", clsSecondRcd = "", clsThirdRcd = "";
                        clsObj.cid1 = clsFirstRcd;
                        clsObj.cid2 = clsSecondRcd;
                        clsObj.cid3 = clsThirdRcd;
                        clsObj.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                        clsObj.page = current; // 重新選擇分類的話，預設為第一頁開始
                    } else {
                        clsFirstRcd = clsNum, clsSecondRcd = "", clsThirdRcd = "";
                        clsObj.cid1 = clsFirstRcd;
                        clsObj.cid2 = clsSecondRcd;
                        clsObj.cid3 = clsThirdRcd;
                        clsObj.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                        clsObj.page = current; // 重新選擇分類的話，預設為第一頁開始
                    };
                    // 判斷點擊時
                    if (clsNum !== cls1Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    // 分頁數
                                    mainLens = callBackData.length;
                                    pageLens = Math.ceil(mainLens / listSize);
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    // 點擊分頁
                                    paginations.unbind('click').on('click', 'li', function (e) {
                                        e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                        let clsNow = $('.firstCls').find('.firstItem.active').data('num');
                                        let num = $(this).find('a').data("num");
                                        clsObj.count = listSize; // 每次列出 12 筆
                                        if (isNaN(num)) {
                                            if (!$(this).hasClass('disabled')) {
                                                if (num == "prev") {
                                                    pageRcd--;
                                                } else if (num == "next") {
                                                    pageRcd++;
                                                };
                                                // 上下頁，以記錄的頁碼來做拋接值
                                                clsObj.page = pageRcd;
                                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            }
                                        } else {
                                            if (clsNow !== cls1Rcd) { // 點擊的第一層分類與記錄的不同時
                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = current, cls1Rcd = clsNow; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                                            cls2Rcd = ""; // 重設已記錄第二層
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else {
                                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                    $(this).addClass('active').siblings().removeClass('active');
                                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                    clsObj.page = num // 傳送的頁碼
                                                    let xhr = new XMLHttpRequest();
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                                let callBackData = JSON.parse(xhr.responseText);
                                                                html = "";
                                                                pageRcd = num;
                                                                for (let i = 0; i < callBackData.length; i++) {
                                                                    if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                        price = `
                                                                            <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                        `;
                                                                    } else {
                                                                        price = `
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                        `;
                                                                    };
                                                                    if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                        sellQty = `
                                                                            <div class="sellOty">
                                                                                <span>已售出</span>
                                                                                <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                                <span>件</span>
                                                                            </div>
                                                                        `;
                                                                    } else {
                                                                        sellQty = "";
                                                                    };
                                                                    html += `
                                                                        <div data-num="${callBackData[i].Id}"  class="item">
                                                                            <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                                <div class="images">
                                                                                    <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                                </div>
                                                                                <div class="main">
                                                                                    <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                        ${callBackData[i].Title}
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

                                                                $('html,body').scrollTop(0);
                                                            } else {
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
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(clsObj));
                                                } else { };
                                            };
                                        };
                                    });
                                    paginations.find('div li:first-child').trigger('click');
                                } else { };
                            };
                        };
                        xhr.open('POST', `${URL}Product/GetProducts`, true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(clsObj));
                        // 清除第二層分類的點選狀態
                        $('.secondCls').find('.secondItem').removeClass('active');
                        // 清除第三層分類的點選狀態
                        $('.thirdCls').find('.thirdItem').removeClass('active');
                    } else { };
                });
                // Second FilterItem
                $('.secondCls').find('.secondItem').on('click', function () {
                    // 展開第三層分類
                    if ($(`#${$(this).data('target')} li`).length !== 0) {
                        if ($(this).hasClass('active')) {
                            $(`#${$(this).data('target')}`).slideToggle('normal')
                        } else {
                            $(`#${$(this).data('target')}`).slideDown('normal');
                        };
                    };
                    // 清除其餘第第二層的選擇狀態
                    $('.secondCls').find('.secondItem').removeClass('active');
                    $(this).addClass('active');
                    // 取隸屬的第一層 Id
                    let clsFirst = Number($(this).parents('.secondCls').attr('id'));
                    if (!$('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).hasClass('active')) {
                        // 隸屬的第一層 Id 必須為點擊狀態 (active)
                        $('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).addClass('active').siblings().removeClass('active');
                        // 須將記錄記為隸屬的第一層 Id
                        cls1Rcd = clsFirst;
                    };
                    // 取得第二層 Id
                    let clsNum = $(this).data('num');
                    if (clsNum) {
                        clsFirstRcd = clsFirst, clsSecondRcd = clsNum, clsThirdRcd = "";

                        clsObj.cid1 = clsFirstRcd;
                        clsObj.cid2 = clsSecondRcd;
                        clsObj.cid3 = clsThirdRcd;
                        clsObj.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                        clsObj.page = current; // 重新選擇分類的話，預設為第一頁開始
                    };
                    if (clsNum !== cls2Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    // 分頁數
                                    mainLens = callBackData.length;
                                    pageLens = Math.ceil(mainLens / listSize);
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    // 點擊分頁
                                    paginations.unbind('click').on('click', 'li', function (e) {
                                        e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                        let clsNow = $('.secondCls').find('.secondItem.active').data('num');
                                        let num = $(this).find('a').data("num");
                                        clsObj.count = listSize; // 每次列出 12 筆
                                        if (isNaN(num)) {
                                            if (!$(this).hasClass('disabled')) {
                                                if (num == "prev") {
                                                    pageRcd--;
                                                } else if (num == "next") {
                                                    pageRcd++;
                                                };
                                                // 上下頁，以記錄的頁碼來做拋接值
                                                clsObj.page = pageRcd;
                                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            }
                                        } else {
                                            if (clsNow !== cls2Rcd) { // 點擊的分類與記錄的不同時
                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            // 清除所有第三層的點擊
                                                            $('.thirdCls').find('.thirdItem').removeClass('active');

                                                            pageRcd = current, cls2Rcd = clsNow, cls3Rcd = ""; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else {
                                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                    $(this).addClass('active').siblings().removeClass('active');
                                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                    clsObj.page = num // 傳送的頁碼
                                                    let xhr = new XMLHttpRequest()
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                                let callBackData = JSON.parse(xhr.responseText);
                                                                html = "";
                                                                pageRcd = num;
                                                                for (let i = 0; i < callBackData.length; i++) {
                                                                    if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                        price = `
                                                                            <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                        `;
                                                                    } else {
                                                                        price = `
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                        `;
                                                                    };
                                                                    if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                        sellQty = `
                                                                            <div class="sellOty">
                                                                                <span>已售出</span>
                                                                                <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                                <span>件</span>
                                                                            </div>
                                                                        `;
                                                                    } else {
                                                                        sellQty = "";
                                                                    };
                                                                    html += `
                                                                        <div data-num="${callBackData[i].Id}" class="item">
                                                                            <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                                <div class="images">
                                                                                    <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                                </div>
                                                                                <div class="main">
                                                                                    <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                        ${callBackData[i].Title}
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

                                                                $('html,body').scrollTop(0);
                                                            } else {
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
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(clsObj));
                                                } else { };
                                            }
                                        };
                                    });
                                    paginations.find('div li:first-child').trigger('click');

                                } else {
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
                            };
                        };
                        xhr.open('POST', `${URL}Product/GetProducts`, true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(clsObj));

                    } else { };
                });
                // Third FilterItem
                $('.thirdCls').find('.thirdItem').on('click', function () {
                    // 清除其餘第第三層的選擇狀態
                    $('.thirdCls').find('.thirdItem').removeClass('active');
                    $(this).addClass('active');
                    // 取隸屬的第一層 Id
                    let clsFirst = Number($(this).parents('.secondCls').attr('id'));
                    // 取隸屬的第二層 Id
                    let clsSecond = Number($(this).parents('.thirdCls').attr('id'));
                    if (!$('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).hasClass('active')) {
                        // 隸屬的第一層 Id 必須為點擊狀態 (active)
                        $('.firstCls').find(`.firstItem[data-target="${clsFirst}"]`).addClass('active').siblings().removeClass('active');
                        // 須將記錄記為隸屬的第一層 Id
                        cls1Rcd = clsFirst;
                        // 隸屬的第二層的 Id　必須為點擊狀態 (active)
                        $('.secondCls').find('.secondItem').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                        $('.secondCls').find(`.secondItem[data-target="${clsSecond}"]`).addClass('active');
                        // 須將記錄記為隸屬的第二層 Id
                        cls2Rcd = clsSecond;
                    } else {
                        // 隸屬的第二層的 Id　必須為點擊狀態 (active)
                        $('.secondCls').find('.secondItem').removeClass('active'); // 清除非隸屬的第二層點擊 (active)
                        $('.secondCls').find(`.secondItem[data-target="${clsSecond}"]`).addClass('active');
                        // 須將記錄記為隸屬的第二層 Id
                        cls2Rcd = clsSecond;
                    };
                    let clsNum = $(this).data('num');
                    if (clsNum) {
                        clsFirstRcd = clsFirst, clsSecondRcd = clsSecond, clsThirdRcd = clsNum;

                        clsObj.cid1 = clsFirstRcd;
                        clsObj.cid2 = clsSecondRcd;
                        clsObj.cid3 = clsThirdRcd;
                        clsObj.count = ""; // 須清除已加入的頁數筆數，才會呈現總筆數
                        clsObj.page = current; // 重新選擇分類的話，預設為第一頁開始
                    };
                    if (clsNum !== cls3Rcd) { // 如果是第一次選擇分類 || 第二次選擇不同的分類
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    // 分頁數
                                    mainLens = callBackData.length;
                                    pageLens = Math.ceil(mainLens / listSize);
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    // 點擊分頁
                                    paginations.unbind('click').on('click', 'li', function (e) {
                                        e.preventDefault();
                                        e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                        let clsNow = $('.thirdCls').find('.thirdItem.active').data('num');
                                        let num = $(this).find('a').data("num");
                                        clsObj.count = listSize; // 每次列出 9 筆
                                        if (isNaN(num)) {
                                            if (!$(this).hasClass('disabled')) {
                                                if (num == "prev") {
                                                    pageRcd--;
                                                } else if (num == "next") {
                                                    pageRcd++;
                                                };

                                                // 上下頁，以記錄的頁碼來做拋接值
                                                clsObj.page = pageRcd;
                                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = pageRcd; // 更新頁碼的紀錄
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            }
                                        } else {
                                            if (clsNow !== cls3Rcd) { // 點擊的分類與記錄的不同時
                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = current, cls3Rcd = clsNow; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else {
                                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                    $(this).addClass('active').siblings().removeClass('active');
                                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                    clsObj.page = num // 傳送的頁碼
                                                    let xhr = new XMLHttpRequest()
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                                let callBackData = JSON.parse(xhr.responseText);
                                                                html = "";
                                                                pageRcd = num;
                                                                for (let i = 0; i < callBackData.length; i++) {
                                                                    if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                        price = `
                                                                            <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                        `;
                                                                    } else {
                                                                        price = `
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                        `;
                                                                    };
                                                                    if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                        sellQty = `
                                                                            <div class="sellOty">
                                                                                <span>已售出</span>
                                                                                <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                                <span>件</span>
                                                                            </div>
                                                                        `;
                                                                    } else {
                                                                        sellQty = "";
                                                                    };
                                                                    html += `
                                                                        <div data-num="${callBackData[i].Id}" class="item">
                                                                            <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                                <div class="images">
                                                                                    <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                                </div>
                                                                                <div class="main">
                                                                                    <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                        ${callBackData[i].Title}
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

                                                                $('html,body').scrollTop(0);
                                                            } else {
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
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(clsObj));
                                                } else { };
                                            }
                                        };
                                    });
                                    paginations.find('div li:first-child').trigger('click');

                                } else {
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
                            };
                        };
                        xhr.open('POST', `${URL}Product/GetProducts`, true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(clsObj));
                    } else { };
                });
                // 有用搜尋的話，呈現搜尋結果；沒有則為預設（全部商品）
                if (request('search')) {
                    // 呈現搜尋結果
                    let num = decodeURI(request('search'));
                    // 搜尋 Title
                    clsTitle.html(`
                        <i class="fad fa-search"></i>
                        <span> 關鍵字 "<span class="keywords">${num}</span>" 搜尋結果</span>
                    `);
                    clsObj = {
                        "keyword": num,
                        "cid1": "",
                        "cid2": "",
                        "cid3": "",
                        "count": "",
                        "page": ""
                    };
                    cls1Rcd = "", cls2Rcd = "", cls3Rcd = "", pageRcd = "";// 使用搜尋，清空目前記錄的篩選
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                let callBackData = JSON.parse(xhr.responseText);
                                // 分頁數
                                mainLens = callBackData.length;
                                pageLens = Math.ceil(mainLens / listSize);
                                paginations.find('div').html(curPage(current, pageLens, pageCount));
                                // 點擊分頁
                                paginations.unbind('click').on('click', 'li', function (e) {
                                    e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                    let clsNow = "";// 當前點擊的分類設為空值
                                    let num = $(this).find('a').data("num");
                                    clsObj.count = listSize; // 每次列出 9 筆
                                    if (isNaN(num)) {
                                        if (!$(this).hasClass('disabled')) {
                                            if (num == "prev") {
                                                pageRcd--;
                                            } else if (num == "next") {
                                                pageRcd++;
                                            };
                                            // 上下頁，以記錄的頁碼來做拋接值
                                            clsObj.page = pageRcd;
                                            paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                            let xhr = new XMLHttpRequest();
                                            xhr.onload = function () {
                                                if (xhr.status == 200) {
                                                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                        let callBackData = JSON.parse(xhr.responseText);
                                                        html = "";
                                                        for (let i = 0; i < callBackData.length; i++) {
                                                            if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                price = `
                                                                    <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                    <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                `;
                                                            } else {
                                                                price = `
                                                                    <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                `;
                                                            };
                                                            if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                sellQty = `
                                                                    <div class="sellOty">
                                                                        <span>已售出</span>
                                                                        <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                        <span>件</span>
                                                                    </div>
                                                                `;
                                                            } else {
                                                                sellQty = "";
                                                            };
                                                            html += `
                                                                <div data-num="${callBackData[i].Id}" class="item">
                                                                    <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                        <div class="images">
                                                                            <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                        </div>
                                                                        <div class="main">
                                                                            <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                ${callBackData[i].Title}
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
                                                        $('html,body').scrollTop(0);
                                                    } else {
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
                                                    }
                                                };
                                            };
                                            xhr.open('POST', `${URL}Product/GetProducts`, true);
                                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                            xhr.send($.param(clsObj));
                                        }
                                    } else {
                                        if (clsNow !== cls1Rcd) { // 點擊的第一層分類與記錄的不同時
                                            $(this).addClass('active').siblings().removeClass('active');
                                            paginations.find('div').html(curPage(current, pageLens, pageCount));
                                            let xhr = new XMLHttpRequest();
                                            xhr.onload = function () {
                                                if (xhr.status == 200) {
                                                    if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                        let callBackData = JSON.parse(xhr.responseText);
                                                        html = "";
                                                        pageRcd = current, cls1Rcd = clsNow; // 重設頁碼紀錄為 Current && 重新記錄目前的分類
                                                        cls2Rcd = ""; // 重設已記錄第二層
                                                        for (let i = 0; i < callBackData.length; i++) {
                                                            if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                price = `
                                                                    <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                    <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                `;
                                                            } else {
                                                                price = `
                                                                    <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                `;
                                                            };
                                                            if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                sellQty = `
                                                                    <div class="sellOty">
                                                                        <span>已售出</span>
                                                                        <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                        <span>件</span>
                                                                    </div>
                                                                `;
                                                            } else {
                                                                sellQty = "";
                                                            };
                                                            html += `
                                                                <div data-num="${callBackData[i].Id}" class="item">
                                                                    <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                        <div class="images">
                                                                            <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                        </div>
                                                                        <div class="main">
                                                                            <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                ${callBackData[i].Title}
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
                                                        $('html,body').scrollTop(0);
                                                    } else {
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
                                                };
                                            };
                                            xhr.open('POST', `${URL}Product/GetProducts`, true);
                                            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                            xhr.send($.param(clsObj));
                                        } else {
                                            if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                clsObj.page = num // 傳送的頁碼
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = num;
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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

                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else { };
                                        };
                                    };
                                });
                                paginations.find('div li:first-child').trigger('click');
                            } else {
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
                        };
                    };
                    xhr.open('POST', `${URL}Product/GetProducts`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                    xhr.send($.param(clsObj));
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
                        clsObj = {
                            "keyword": key,
                            "cid1": "",
                            "cid2": "",
                            "cid3": "",
                            "count": "",
                            "page": current
                        };
                        cls1Rcd = "", cls2Rcd = "", cls3Rcd = "", pageRcd = "";// 使用搜尋，清空目前記錄的篩選
                        //
                        $('.firstCls').find('.firstItem').removeClass('active');
                        $('.secondCls').find('.secondItem').removeClass('active');
                        $('.thirdCls').find('.thirdItem').removeClass('active');
                        $('.sub-menu').slideUp(0);
                        let xhr = new XMLHttpRequest();
                        xhr.onload = function () {
                            if (xhr.status == 200) {
                                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                    let callBackData = JSON.parse(xhr.responseText);
                                    // 分頁數
                                    mainLens = callBackData.length;
                                    pageLens = Math.ceil(mainLens / listSize);
                                    paginations.find('div').html(curPage(current, pageLens, pageCount));
                                    // 點擊分頁
                                    paginations.unbind('click').on('click', 'li', function (e) {
                                        e.preventDefault(), e.stopImmediatePropagation(); // 取消捕獲 Capture 事件
                                        let num = $(this).find('a').data("num");
                                        let clsNow = "";// 當前點擊的分類設為空值
                                        clsObj.count = listSize; // 每次列出筆數
                                        if (isNaN(num)) {
                                            if (!$(this).hasClass('disabled')) {
                                                if (num == "prev") {
                                                    pageRcd--;
                                                } else if (num == "next") {
                                                    pageRcd++;
                                                };
                                                // 上下頁，以記錄的頁碼來做拋接值
                                                clsObj.page = pageRcd;
                                                paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = pageRcd; // 更新頁碼的紀錄
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            }
                                        } else {
                                            if (clsNow !== cls1Rcd) { // 點擊的第一層分類與記錄的不同時

                                                $(this).addClass('active').siblings().removeClass('active');
                                                paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                let xhr = new XMLHttpRequest();
                                                xhr.onload = function () {
                                                    if (xhr.status == 200) {
                                                        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                            let callBackData = JSON.parse(xhr.responseText);
                                                            html = "";
                                                            pageRcd = num, cls1Rcd = clsNow; // 重新記錄目前的分類
                                                            cls2Rcd = "", cls3Rcd = ""; // 重設已記錄第二層、第三層
                                                            for (let i = 0; i < callBackData.length; i++) {
                                                                if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                    price = `
                                                                        <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                    `;
                                                                } else {
                                                                    price = `
                                                                        <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                    `;
                                                                };
                                                                if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                    sellQty = `
                                                                        <div class="sellOty">
                                                                            <span>已售出</span>
                                                                            <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                            <span>件</span>
                                                                        </div>
                                                                    `;
                                                                } else {
                                                                    sellQty = "";
                                                                };
                                                                html += `
                                                                    <div data-num="${callBackData[i].Id}" class="item">
                                                                        <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                            <div class="images">
                                                                                <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                            </div>
                                                                            <div class="main">
                                                                                <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                    ${callBackData[i].Title}
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
                                                            $('html,body').scrollTop(0);
                                                        } else {
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
                                                    };
                                                };
                                                xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                xhr.send($.param(clsObj));
                                            } else {
                                                if (num !== pageRcd) { // 如果不是點同一頁碼的話
                                                    $(this).addClass('active').siblings().removeClass('active');
                                                    paginations.find('div').html(curPage(num, pageLens, pageCount));
                                                    clsObj.page = num // 傳送的頁碼
                                                    let xhr = new XMLHttpRequest();
                                                    xhr.onload = function () {
                                                        if (xhr.status == 200) {
                                                            if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                                                                let callBackData = JSON.parse(xhr.responseText);
                                                                html = "";
                                                                pageRcd = num;
                                                                for (let i = 0; i < callBackData.length; i++) {
                                                                    if (callBackData[i].Discount_Price !== "" && callBackData[i].Discount_Price !== 0 && callBackData[i].Discount_Price !== null && callBackData[i].Discount_Price !== undefined) {
                                                                        price = `
                                                                            <span class="priceMark orig"><s>${thousands(callBackData[i].Sell_Price)}</s></span>
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Discount_Price)}</span>
                                                                        `;
                                                                    } else {
                                                                        price = `
                                                                            <span class="priceMark disc">${thousands(callBackData[i].Price)}</span>
                                                                        `;
                                                                    };
                                                                    if (callBackData[i].View_Sell_Num !== "" && callBackData[i].View_Sell_Num !== 0 && callBackData[i].View_Sell_Num !== null && callBackData[i].View_Sell_Num !== undefined) {
                                                                        sellQty = `
                                                                            <div class="sellOty">
                                                                                <span>已售出</span>
                                                                                <span>${thousands(callBackData[i].sell_qty)}</span>
                                                                                <span>件</span>
                                                                            </div>
                                                                        `;
                                                                    } else {
                                                                        sellQty = "";
                                                                    };
                                                                    html += `
                                                                        <div data-num="${callBackData[i].Id}" class="item">
                                                                            <a href="./product_view.html?pdtId=${callBackData[i].Id}">
                                                                                <div class="images">
                                                                                    <img src="${IMGURL}products/${callBackData[i].Id}/${callBackData[i].Product_Cover}">
                                                                                </div>
                                                                                <div class="main">
                                                                                    <p class="title abridged2" title="${callBackData[i].Title}">
                                                                                        ${callBackData[i].Title}
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

                                                                $('html,body').scrollTop(0);
                                                            } else {
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
                                                        };
                                                    };
                                                    xhr.open('POST', `${URL}Product/GetProducts`, true);
                                                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                                                    xhr.send($.param(clsObj));
                                                } else { };
                                            };
                                        };
                                    });
                                    paginations.find('div li:first-child').trigger('click');
                                } else {
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
                            };
                        };
                        xhr.open('POST', `${URL}Product/GetProducts`, true);
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.send($.param(clsObj));
                    } else {
                        alert("請輸入商品名稱或關鍵字！");
                        clsObj = {};
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
            };
        };
    };
    cls.open('GET', `${URL}Category`, true);
    cls.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    cls.send(null);
});
