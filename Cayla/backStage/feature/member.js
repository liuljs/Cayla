// 宣告要帶入的欄位
let members = $('.members'), edits = $('.edits');

let add_acc = $('.add_acc'), add_name = $('.add_name'), add_gender = $('.add_gender'), add_birth = $('.add_birth'), add_cell = $('.add_cell'), add_twZipCode = $('.add_twZipCode'), add_addr = $('.add_addr');
let mem_num = $('.mem_num'), edit_num = $('.edit_num'), edit_date = $('.edit_date'), edit_status = $('.edit_status'), edit_acc = $('.edit_acc'), edit_name = $('.edit_name'), edit_gender = $('.edit_gender'), edit_birth = $('.edit_birth'), edit_cell = $('.edit_cell'), edit_twZipCode = $('.edit_twZipCode'), edit_addr = $('.edit_addr');
let enabled, addrs, gender, birth, cell, addrArr = new Array();
let btnAddMem = $('.btnAddMem'), btnSaveMem = $('.btnSaveMem');
CONNECT = 'MemberAdmin';
// 接收資料，做渲染、處理
function process(data) {
    html = "";
    for (let i = 0; i < data.length; i++) {
        // Show Address
        if (data[i].Address != "" && data[i].Address != "[]") {
            addrs = "";
            addrArr = JSON.parse(data[i].Address);
            for (let i = 0; i < addrArr.length; i++) {
                addrs += addrArr[i];
            };
        } else {
            addrArr = [];
            addrs = `<span> - </span>`;
        };
        // Gender Status
        gender = "";
        if (data[i].Gender == 0) {
            gender = "女";
        } else if (data[i].Gender == 1) {
            gender = "男";
        } else {
            gender = "其他";
        };
        // Birth
        if (data[i].Birthday == !"" || data[i].Birthday.split(" ")[0] !== "0001/01/01") {
            birth = data[i].Birthday.split(" ")[0];
        } else {
            birth = `<span> - </span>`;
        };
        // Cell Phone
        if (data[i].Phone !== "") {
            cell = data[i].Phone;
        } else {
            cell = `<span> - </span>`;
        };
        // 狀態
        if (data[i].Enabled !== 0) {
            enabled = `<span class="text-success"> 開啟 </span>`;
        } else {
            enabled = `<span class="text-danger"> 關閉 </span>`;
        }
        html += `
            <tr data-num="${data[i].Id}">
                <td data-title="會員編號">
                    <div class="btnThirds d-flex justify-content-between align-items-end flex-wrap">
                        <span>${data[i].No}</span>
                    </div>
                </td>
                <td data-title="帳號（Email）">${data[i].Account}</td>
                <td data-title="姓名" class="text-center">${data[i].Name}</td>
                <td data-title="性別" class="text-center" data-gender="${data[i].Gender}">${gender}</td>
                <td data-title="生日" class="text-center">${birth}</td>
                <td data-title="手機" class="text-center">${cell}</td>
                <td data-title="地址" data-addr="${addrArr}">${addrs}</td>
                <td data-title="狀態" class="text-center" data-status="${data[i].Enabled}">${enabled}</td>
                <td data-title="設定" class="setup">
                    <div class="setupBlock"></div>
                </td>
            </tr>
        `;
    };
    members.html(html);
    // 顯示新增、編輯功能
    if (menuAuth[authParent.indexOf("MM")].ACT_EDT == "Y") {
        $('.btnAdds').html('').append(`
            <button class="btn btn-primary" data-toggle="modal" data-target="#memberAdd"><i class="fal fa-user-plus"></i> 新增會員</button>
        `);
        $('.setup .setupBlock').html('').append(`
            <button class="btn btn-warning btn-sm mb-1 btnEdit" data-toggle="modal" data-target="#memberEdit"><i class="far fa-edit"></i> 編輯</button>
        `);
        $('.btnThirds').append(`
            <a href="#" class="text-primary btnThird btnOpenPsw" data-toggle="modal" data-target="#memPswEdit">［密碼］</a>
        `);
    };
    // 顯示刪除功能
    if (menuAuth[authParent.indexOf("MM")].ACT_DEL == "Y") {
        $('.setup .setupBlock').append(`
            <a class="btn btn-danger btn-sm mb-1 btnDel" href="#"><i class="fas fa-trash"></i> 刪除</a>
        `);
        // Delete 刪除
        $('.btnDel').on('click', function (e) {
            e.preventDefault(); // 取消 a 預設事件
            let num = $(this).parents('tr').data('num');
            let dataObj = {
                "id": num
            };
            if (confirm("您確定要刪除這位會員嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("刪除資料成功！");
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        location.reload();
                    }
                };
                xhr.open('DELETE', `${URL}${CONNECT}/${num}`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        });
    };
};
// NOTFOUND
function fails() {
    html = "";
    html = `
        <tr class="none">
            <td colspan="9" class="txt-left none">
                <span>目前沒有任何的會員。</span>
            </td>
        </tr>
    `;
    members.html(html);
    paginations.find('div').html(curPage(current, pageLens, pageCount));
};
// 驗證
function dataUpdateCheck(aId, acc, name, birth, cell) {
    if (aId.trim() === '') {
        errorText = '請確認必填欄位皆有填寫！';
        check = false;
        return;
    }
    if (acc.val().trim() === '' || EmailRegExp.test(acc.val()) === false) {
        acc.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認會員姓名是否確實填寫，或格式是否正確！';
    }
    if (birth.val().trim() === '') {
        birth.focus();
        return check = false, errorText = '請確認會員生日是否確實選取！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val()) === false) {
        cell.focus();
        return check = false, errorText = '請確認手機是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
function memPswCheck(psw) {
    if (psw.val().trim() === '' || Rules.test(psw.val()) === false) {
        psw.focus();
        return check = false, errorText = '請確認新密碼是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
$().ready(function () {
    //
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": CONNECT,
        "QUERYs": `${CONNECT}?count=${listSize}&page=${pageRcd}`,
        "Counts": listSize,
        "Sends": "",
    };
    // 產生第一次的分頁器
    getTotalPages(dataObj).then(res => {
        if (res !== 0) {
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
                        dataObj.QUERYs = `${CONNECT}?count=${listSize}&page=${pageRcd}`;
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
                                alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                                location.reload();
                            };
                        });
                    };
                } else {
                    if (num !== pageRcd) { // 如果不是點同一頁碼的話
                        // 1. 產生分頁器
                        paginations.find('div').html(curPage(num, pageLens, pageCount));
                        pageRcd = num // 記錄當下頁碼
                        // 2. 取得點擊頁碼後要呈現的內容(要呈現的筆數)
                        dataObj.QUERYs = `${CONNECT}?count=${listSize}&page=${num}`;
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
                                alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                                location.reload();
                            };
                        });
                    } else { };
                };
            });
            paginations.find('div li:first-child').trigger('click');
        } else {
            pageLens = 0; // 資料筆數為 0 頁數為 0
            fails();
        };
    }, rej => {
        if (rej == "NOTFOUND") { };
    });
    // Add
    btnAddMem.on('click', function () {
        // twzipcode 取值
        addrArr = [];
        add_twZipCode.twzipcode('get', function (county, district, zipcode) {
            if (county !== "") {
                addrArr.push(county);
                if (district !== "") {
                    addrArr.unshift(zipcode);
                    addrArr.push(district);
                };
            };
            return addrArr;
        });
        if (add_addr.val() !== "") {
            addrArr.push(add_addr.val());
        };
        // 驗證
        dataUpdateCheck(idz, add_acc, add_name, add_birth, add_cell);
        if (check == true) {
            let dataObj = {
                "account": add_acc.val(),
                "name": add_name.val(),
                "gender": $('.add_gender:checked').val(),
                "birthday": add_birth.val(),
                "phone": add_cell.val(),
                "address": JSON.stringify(addrArr)
            };
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status == 200 || xhr.status == 204) {
                    alert("新增會員成功！");
                    location.reload();
                } else {
                    let callBackData = JSON.parse(xhr.responseText);
                    if (callBackData.Message == 1) {
                        alert("註冊錯誤：會員帳號（信箱）已註冊過！");
                        add_act.focus();
                    } else if (callBackData.Message == 2) {
                        alert("註冊錯誤：手機號碼已註冊過！");
                        add_cell.focus();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        location.reload();
                    };
                };
            };
            xhr.open('POST', `${URL}${CONNECT}/AddMember`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send($.param(dataObj));
        } else {
            alert(errorText);
        };
    });
    // Edit 編輯
    $(document).on('click', '.btnEdit', function () {
        // 點擊編輯後，直接取頁面上的資料動態產生再編輯燈箱中
        let num = $(this).parents('tr').data('num');
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (xhr.status == 200) {
                if (xhr.responseText !== "" && xhr.responseText !== "[]") {
                    let callBackData = JSON.parse(xhr.responseText);
                    mem_num.html(callBackData.No);
                    edit_num.val(callBackData.No);
                    edit_num.data('num', callBackData.Id)
                    edit_date.val(callBackData.Creation_Date);
                    edit_status.val(callBackData.Enabled);
                    edit_acc.val(callBackData.Account);
                    edit_name.val(callBackData.Name);
                    $(`.edit_gender[value="${callBackData.Gender}"]`).prop('checked', true);
                    if (callBackData.Birthday !== "") {
                        edit_birth.val(dateChange(callBackData.Birthday));
                    } else {
                        edit_birth.val('');
                    }
                    if (callBackData.Phone !== "") {
                        edit_cell.val(callBackData.Phone);
                    } else {
                        edit_cell.val('');
                    };
                    // 會員帳號的狀態顯示
                    let chk = $('.edit_status');
                    for (let i = 0; i < chk.length; i++) {
                        if (chk.eq(i).val() == "1") {
                            chk.eq(i).prop('checked', true);
                        } else {
                            chk.eq(i).prop('checked', false);
                        };
                    };
                    // 會員帳號的狀態控制
                    chk.on('change', function () {
                        if ($(this).prop('checked') == true) {
                            $(this).val("1");
                        } else {
                            $(this).val("0");
                        }
                    });
                    // 台灣地址 下拉式選單
                    edit_twZipCode.twzipcode({
                        zipcodeIntoDistrict: true, // 郵遞區號自動顯示在地區
                        css: ["addReceiptCity odrEdit custom-select", "addReceiptTown odrEdit custom-select"], // 自訂 "城市"、"地區" class 名稱 
                        countyName: "city", // 自訂城市 select 標籤的 name 值
                        districtName: "town" // 自訂地區 select 標籤的 name 值
                    });
                    // Set Address
                    if (callBackData.Address !== "" && callBackData.Address !== "[]") {
                        let addrArr = JSON.parse(callBackData.Address);
                        edit_twZipCode.twzipcode('set', {
                            'zipcode': addrArr[0],
                            'county': addrArr[1],
                            'district': addrArr[2]
                        });
                        $('.edit_addr').val(addrArr[3]);
                    };
                } else { };
            } else {
                alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                location.reload();
            };
        };
        xhr.open('GET', `${URL}${CONNECT}/${num}`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(null);
    });
    // Save 儲存
    btnSaveMem.on('click', function (e) {
        e.preventDefault();
        let num = $(this).parents('.edits').find('.edit_num').data('num');
        // twzipcode 取值
        addrArr = [];
        edit_twZipCode.twzipcode('get', function (county, district, zipcode) {
            if (county !== "") {
                addrArr.push(county);
                if (district !== "") {
                    addrArr.unshift(zipcode);
                    addrArr.push(district);
                };
            };
            return addrArr;
        });
        if (edit_addr.val() !== "") {
            addrArr.push(edit_addr.val());
        };
        // // 驗證
        dataUpdateCheck(idz, edit_acc, edit_name, edit_birth, edit_cell);
        // 
        if (check == true) {
            let dataObj = {
                "account": edit_acc.val(),
                "name": edit_name.val(),
                "birthday": edit_birth.val(),
                "phone": edit_cell.val(),
                "address": JSON.stringify(addrArr),
                "gender": $(`.edit_gender:checked`).val(),
                "Enabled": edit_status.val(),
            };
            if (confirm("您確定要修改這筆會員的資料嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改資料成功！");
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        location.reload();
                    };
                };
                xhr.open('PUT', `${URL}${CONNECT}/${num}`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            };
        } else {
            alert(errorText);
        };
    });
    // 更新會員密碼
    $('.btnOpenPsw').on('click', function () {
        let num = $(this).parents('tr').data("num");
        $('.mem_id').val(num);
    });
    $('.btnChangeMemPsw').on('click', function () {
        let trz = $(this).parents('.modal-content');
        let num = trz.find('.mem_id').val();
        memPswCheck(trz.find('.new_memPsw'));
        if (check == true) {
            let dataObj = {
                "id": num,
                "Password": trz.find('.new_memPsw').val()
            };
            if (confirm("您確定要進行修改嗎（會在下次登入生效）？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改資料成功！");
                        location.reload();
                    } else {
                        alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                        location.reload();
                    };
                };
                xhr.open('PATCH', `${URL}${CONNECT}/${num}`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            }
        } else {
            alert(errorText);
        }
    });
    // Cancel
    $(document).on('click', '.btnCancel, .close', function () {
        let trz = $(this).parents('.modal-content');
        $.map(trz.find('.editInput'), function (item, index) {
            if (item.value !== "") {
                return check = false
            };
        });
        if (check == true) {
            // 欄位未填任何內容，直接關閉
            trz.find('.closez').trigger('click');

            check = true; // 重置 check
        } else {
            // 資訊皆是渲染，可直接清空
            if (confirm("您尚未儲存內容，是否直接關閉？")) {
                // 清空欄位的值
                trz.find('.editInput').val('');
                // 關閉
                trz.find('.closez').trigger('click');

                check = true; // 重置 check
            };
        };
    });
});