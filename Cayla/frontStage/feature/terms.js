// Terms
let terms = $('#editorz');
$().ready(function () {
    // Terms
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "Terms",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            // Terms
            html = quill.setContents(JSON.parse(res[0].Content).ops);
            terms.html(quill.root.innerHTML);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});