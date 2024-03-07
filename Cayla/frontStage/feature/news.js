// News
let news = $('.list');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <a href="./news_view.html?newsId=${data[i].Id}" class="news-item" data-num="${data[i].Id}">
                <div class="date-box">
                    <p class="date">${data[i].Date.split(' ')[0].split("-").join("/")}</p>
                </div>
                <div class="images"><img src="${data[i].Image_Url}"></div>
                <div class="main">
                    <p class="title">${data[i].Title}</p>
                </div>
            </a>
        `;
    };
    news.html(html);
    $('.list').imagesLoaded(function () {
        $('.list').masonry({
            itemSelector: '.news-item',
            animate: true,
            horizontalOrder: true,
            originTop: true
        });
    });
    //Fade Out the loading screen when all images loaded
    $('.list').imagesLoaded().always(function (instance) {
        $('.loadingScreen').fadeOut();
    });
    // Click News
    // $('.news-item').on('click', function (e) {
    //     e.preventDefault();
    //     // 點擊編輯後，將要編輯的消息編號儲存於瀏覽器（LocalStorage 或 SessionStorage）
    //     let num = $(this).data('num');
    //     if (num) {
    //         localStorage.setItem("newsNum", num);
    //         let numz = localStorage.getItem("newsNum");
    //         if (numz) { // 確認有將消息編號存入 Storage
    //             location.href = `./news_view.html?newsId=${num}`; // 跳轉至消息頁面
    //         };
    //     };
    // });
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // // 清除 localStorag 中可能留著的 newsNum
    // if (localStorage.getItem('newsNum')) {
    //     localStorage.removeItem('newsNum');
    // };
    // News
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `News`,
        "QUERYs": `News/?count=${listSize}&page=${pageRcd}`,
        "Counts": listSize,
        "Sends": "",
    };
    // 產生第一次的分頁器
    getTotalPages(dataObj).then(res => {
        if (res !== null) {
            pageLens = res;
            paginations.find('div').html(curPage(current, pageLens, pageCount));
            // 點擊頁碼
            paginations.unbind('click').on('click', 'li', function (e) {
                e.preventDefault(), e.stopImmediatePropagation();
                let num = $(this).find('a').data('num');
                if (isNaN(num)) {
                    if (!$(this).hasClass("disabled")) {
                        if (num == "prev") {
                            pageRcd--;
                        } else if (num == "next") {
                            pageRcd++;
                        };
                        // 1. 產生分頁器
                        paginations.find('div').html(curPage(pageRcd, pageLens, pageCount));
                        pageRcd = pageRcd // 紀錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `News/?count=${listSize}&page=${pageRcd}`;
                        getPageDatas(dataObj).then(res => {
                            // DOSOMETHING
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
                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                        // 1. 產生分頁器
                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                        pageRcd = num // 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `News/?count=${listSize}&page=${num}`;
                        getPageDatas(dataObj).then(res => {
                            // DOSOMETHING
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
                };
            });
            paginations.find('div li:first-child').trigger('click');
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});