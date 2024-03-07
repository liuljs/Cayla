// Member Profile
let edit_act = $('.edit_act'), edit_cstName = $('.edit_cstName'), edit_gender = $('.edit_gender'), edit_birth = $('.edit_birth'), edit_cell = $('.edit_cell'), edit_addr = $('.edit_addr');
let addrs, gender;
let btnOpen = $('.btnOpen'), btnChangePsw = $('.btnChangePsw');
let oldz = $('.old_psw'), newz = $('.new_psw'), cfmz = $('.cfm_psw');
let addrArr = new Array();
let btnSave = $('.btnSave');
// 驗證
function dataUpdateCheck(act, name, birth, cell) {
    if (act.text().trim() === '' || EmailRegExp.test(act.text().trim()) === false) {
        act.focus();
        return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
    }
    if (name.val().trim() === '') {
        name.focus();
        return check = false, errorText = '請確認會員姓名是否確實填寫，或格式是否正確！';
    }
    if (birth.val().trim() === '' || birth.val() === '0001-01-01') { // 預設日期的格式 0001-01-01
        birth.focus();
        return check = false, errorText = '請確認會員生日是否確實選取！';
    }
    if (cell.val().trim() === '' || CellRegExp.test(cell.val().trim()) === false) {
        cell.focus();
        return check = false, errorText = '請確認手機是否確實填寫，或格式是否正確！';
    }
    else {
        return check = true, errorText = "";
    }
};
function checkPassword(oPsw, nPsw, cPsw) {
    if (oPsw.val().trim() === '') {
        oPsw.focus();
        return check = false, errorText = '請確實填寫舊密碼！';
    }
    else if (Rules.test(oPsw.val()) === false) {
        oPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (nPsw.val().trim() === '') {
        nPsw.focus();
        return check = false, errorText = '請確實填寫新密碼！';
    }
    else if (Rules.test(nPsw.val()) === false) {
        nPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    if (cPsw.val().trim() === '') {
        cPsw.focus();
        return check = false, errorText = '請確實填寫確認新密碼！';
    }
    else if (Rules.test(cPsw.val()) === false) {
        cPsw.focus();
        return check = false, errorText = '請填寫正確的密碼格式！';
    }
    else {
        return check = true;
    }
};
// 接收資料，做渲染、處理
function process(data) {
    edit_act.text(data.Account);
    edit_cstName.val(data.Name);
    $(`.edit_gender[value="${data.Gender}"]`).prop('checked', true);
    edit_birth.val(dateChange(data.Birthday));
    edit_cell.val(data.Phone);
    // Set Address
    if (data.Address !== "") {
        let addrArr = JSON.parse(data.Address);
        $('.edit_twZipCode').twzipcode('set', {
            'zipcode': addrArr[0],
            'county': addrArr[1],
            'district': addrArr[2]
        });
        edit_addr.val(addrArr[3]);
    };
};
// NOTFOUND
function fails() { };
$().ready(function () {
    // Profile
    let dataObj = {
        "Methods": "GET",
        "APIs": URL,
        "CONNECTs": `MemberUser`,
        "QUERYs": "",
        "Counts": "",
        "Sends": "",
    };
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

    // 修改資料
    btnSave.on('click', function () {
        // twzipcode 取值
        addrArr = [];
        $('.edit_twZipCode').twzipcode('get', function (county, district, zipcode) {
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
        // 驗證
        dataUpdateCheck(edit_act, edit_cstName, edit_birth, edit_cell);
        if (check == true) {
            let dataObj = {
                "account": edit_act.text(),
                "name": edit_cstName.val(),
                "gender": $('.edit_gender:checked').val(), // 已選擇的 radio 值
                "birthday": edit_birth.val(),
                "phone": edit_cell.val(),
                "address": JSON.stringify(addrArr)
            };
            if (confirm("再次確認您傳送的資料無誤？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                        alert("修改資訊成功！");
                        location.reload();
                    } else {
                        let callBackData = JSON.parse(xhr.responseText)
                        console.log(callBackData)
                        if (callBackData.Message == "RepeatPhone") {
                            alert("修改錯誤：手機號碼已存在！");
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                            // getLogout();
                        };
                    };
                };
                xhr.open('PUT', `${URL}MemberUser`, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
            }
        } else {
            alert(errorText);
        };
    });
    // 修改密碼
    btnOpen.on('click', function () {
        let trz = $('#passWordEdit .modal-content');
        trz.find('.btnChangePsw').unbind('click').on('click', function () {
            checkPassword(oldz, newz, cfmz);
            if (check == true) {
                let dataObj = {
                    "OldPassword": oldz.val(),
                    "Password": newz.val()
                };
                if (confirm("再次確認您要修改密碼嗎？")) {
                    let xhr = new XMLHttpRequest();
                    xhr.onload = function () {
                        if (xhr.status == 200 || xhr.status == 204) {
                            let callBackData = JSON.parse(xhr.responseText);
                            if (callBackData !== "") {
                                alert('修改密碼成功！');
                                getLogout();
                            };
                        } else {
                            alert("錯誤訊息 " + xhr.status + "：您的連線已逾期，請重新登入！");
                            getLogout();
                        };
                    };
                    xhr.open('PATCH', `${URL}MemberUser/ChangePassword`, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
                    xhr.send($.param(dataObj));
                }
            } else {
                alert(errorText);
            };
        })
        // Cancel
        trz.find('.btnCancel, .close').unbind('click').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            let trz = $(this).parents('.modal-content');
            if (confirm("尚未儲存內容，確定要取消嗎？")) {
                // 清空欄位資料
                trz.find('input[type="password"]').val('');

                $('.closez').trigger('click');
            };
        });
    });
});