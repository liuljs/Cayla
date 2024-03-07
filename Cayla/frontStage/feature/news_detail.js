// News Detail
let itemTitle = $('#view .subject');
let breadz = $('#view .current');
let itemDate = $('#view .date-box');
let itemContent = $('#view #editorz');
// 接收資料，做渲染、處理
function process(data) {
    breadz.html(data.Title);
    itemTitle.html(data.Title);
    let date = data.Date.split(' ')[0].split('-');
    itemDate.find('.year').html(date[0]);
    itemDate.find('.mouth').html(MonthArr[Number(date[1]) - 1]);
    itemDate.find('.date').html(date[2]);

    html = "";
    // Content
    html = quill.setContents(JSON.parse(data.Contents).ops);
    itemContent.html(quill.root.innerHTML);
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // 從 localStorage 取編號，用於呼叫消息訊息
    // let num = localStorage.getItem('newsNum');
    let num = request('newsId');
    if (num) {
        let dataObj = {
            "Methods": "GET",
            "APIs": URL,
            "CONNECTs": `News/${num}`,
            "QUERYs": "",
            "Sends": "",
            "Counts": "",
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
});