// FAQ
let faqs = $('.list');
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        html += `
            <div class="item" data-num="${data[i].Id}">
                <div class="que">
                    <div class="icon">Q.</div>
                    <p class="title">${data[i].Question}</p>
                </div>
                <div class="ans">
                    <div class="contents">
                        <div class="icon">A.</div>
                        <p class="title">${data[i].Asked}</p>
                    </div>
                </div>
            </div>
        `;
    };
    faqs.html(html);

    // click FAQ
    $('#faq .list .item .que').on('click', function (e) {
        let trz = $(this).parents('.item');
        trz.toggleClass('is-open');
        trz.find('.ans').slideToggle('normal');
    });
    // 預設開啟第一個 FAQ
    $('#faq .list .item').eq(0).addClass('is-open').find('.ans').slideDown(0);
};
// NOTFOUND
function fails() { };

$().ready(function () {
    // FAQ
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "FAQ",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
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
});