// Privacy
let privacies = $('#editorz');

$().ready(function () {
    // Privacy
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": "Privacy",
        "QUERYs": "",
        "Sends": "",
        "Counts": ""
    };
    getPageDatas(dataObj).then(res => {
        // DOSOMETHING
        if (res !== null) {
            html = "";
            // Privacies
            html = quill.setContents(JSON.parse(res[0].Content).ops);
            privacies.html(quill.root.innerHTML);
        } else { };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
});