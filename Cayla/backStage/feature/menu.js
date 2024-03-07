// 取得使用者權限
let menuAuth = JSON.parse(localStorage.getItem('module'));
let authParent = $.map(menuAuth, function (item, val) {
    return item.CODE
});
let menus = $('.menus ul');
let menuAll, menuNormal;
// Menuz
let carousel = `
    <li class="nav-item">
        <a href="./banner.html">
            <i class="far fa-image"></i>
            <p>首頁圖片輪播</p>
        </a>
    </li>
`;
let contentz = `
    <li class="nav-item">
        <a data-toggle="collapse" href="#content">
            <i class="far fa-building"></i>
            <p>編輯內容</p>
            <span class="caret"></span>
        </a>
        <div class="collapse" id="content">
            <ul class="nav nav-collapse">
                <li class="">
                    <a href="./about.html">
                        <span class="sub-item">編輯關於我們</span>
                    </a>
                </li>
                <li class="">
                    <a href="./privacy.html">
                        <span class="sub-item">編輯隱私權</span>
                    </a>
                </li>
                <li class="">
                    <a href="./terms.html">
                        <span class="sub-item">編輯服務條款</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
`;
let newsz = `
    <li class="nav-item">
        <a data-toggle="collapse" href="#news">
            <i class="far fa-newspaper"></i>
            <p>最新消息</p>
            <span class="caret"></span>
        </a>
        <div class="collapse" id="news">
            <ul class="nav nav-collapse">
                <li class="">
                    <a href="./newsadd.html">
                        <span class="sub-item">新增消息</span>
                    </a>
                </li>
                <li class="">
                    <a href="./newslist.html">
                        <span class="sub-item">消息列表</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
`;
let product = `
    <li class="nav-item">
        <a data-toggle="collapse" href="#items">
            <i class="far fa-hand-holding-box"></i>
            <p>商品管理</p>
            <span class="caret"></span>
        </a>
        <div class="collapse" id="items">
            <ul class="nav nav-collapse productz">
                <li>
                    <a href="./itemsclassify.html">
                        <span class="sub-item">商品分類</span>
                    </a>
                </li>
                <li>
                    <a href="./itemsshow.html">
                        <span class="sub-item">新增商品</span>
                    </a>
                </li>
                <li>
                    <a href="./itemslist.html">
                        <span class="sub-item">商品列表</span>
                    </a>
                </li>   
                <li>
                    <a href="./itemsqa.html">
                        <span class="sub-item">客服問答</span>
                    </a>
                </li>   
            </ul>
        </div>
    </li>
`;
let order = `
    <li class="nav-item">
        <a data-toggle="collapse" href="#order">
            <i class="far fa-clipboard-list-check"></i>
            <p>訂單管理</p>
            <span class="caret"></span>
        </a>
        <div class="collapse" id="order">
            <ul class="nav nav-collapse">
                <li>
                    <a href="./orderlist.html">
                        <span class="sub-item">訂單列表</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
`;
let member = `
    <li class="nav-item">
        <a href="./member.html">
            <i class="far fa-users"></i>
            <p>會員管理</p>
        </a>
    </li>
`;
let manager = `
    <li class="nav-item">
        <a data-toggle="collapse" href="#own">
            <i class="far fa-user-tie"></i>
            <p>管理者管理</p>
            <span class="caret"></span>
        </a>
        <div class="collapse" id="own">
            <ul class="nav nav-collapse">
                <li>
                    <a href="./ownclassify.html">
                        <span class="sub-item">群組分類/權限</span>
                    </a>
                </li>
                <li>
                    <a href="./own.html">
                        <span class="sub-item">管理群組</span>
                    </a>
                </li>
            </ul>
        </div>
    </li>
`;
let question = `
    <li class="nav-item">
        <a href="./faq.html">
            <i class="far fa-comments"></i>
            <p>FAQ 管理</p>
        </a>
    </li>
`;
function createMenu() {
    // 取得使用者權限
    menuAuth = JSON.parse(localStorage.getItem('module'));
    authParent = $.map(menuAuth, function (item, val) {
        return item.CODE
    })
    menuAll = "";
    menuNormal = carousel + contentz + newsz;
    menuAll += menuNormal;
    if (menuAuth[authParent.indexOf("PM")].ACT_VIEW == "Y") {
        if (menuAuth[authParent.indexOf("PM")].ACT_EDT == "Y") {
            product = product;
        } else {
            product = `
                <li class="nav-item">
                    <a data-toggle="collapse" href="#items">
                        <i class="far fa-hand-holding-box"></i>
                        <p>商品管理</p>
                        <span class="caret"></span>
                    </a>
                    <div class="collapse" id="items">
                        <ul class="nav nav-collapse productz">
                            <li>
                                <a href="./itemsclassify.html">
                                    <span class="sub-item">商品分類</span>
                                </a>
                            </li>
                            <li>
                                <a href="./itemslist.html">
                                    <span class="sub-item">商品列表</span>
                                </a>
                            </li>    
                        </ul>
                    </div>
                </li>
            `;
        };
        menuAll += product;
    };
    if (menuAuth[authParent.indexOf("OM")].ACT_VIEW == "Y") {
        menuAll += order;
    };
    if (menuAuth[authParent.indexOf("MM")].ACT_VIEW == "Y") {
        menuAll += member;
    };
    if (menuAuth[authParent.indexOf("SM")].ACT_VIEW == "Y") {
        menuAll += manager;
    };
    menuAll = menuAll + question;
    menus.html(menuAll);
    // 標示目前的位置
    let active = window.location.pathname.split('/').pop();
    $(`a[href="${window.location.origin + window.location.pathname}"], a[href="${window.location.pathname}"], a[href="./${active}"]`).each((idx, obj) => {
        let active = $(obj).parents('li');
        if (active.hasClass('nav-item')) {
            active.addClass('active');
            active.find('.collapse').addClass('show')
            active.find('a[data-toggle="collapse"]').attr('aria-expanded', true)
        } else {
            active.addClass("active");
        };
    });
};
// 登出按鈕
let btnLogout = $('.btnLogout');
// 更改密碼 Change Password
let old_psw = $('.old_psw'), new_psw = $('.new_psw'), cfm_psw = $('.cfm_psw');
let btnOpen = $('.btnOpen');
$().ready(function () {
    //
    getLoginInFo()
        .then(res => {
            // 登入成功，將資訊寫入 LocalStorage
            writeData(res);
            // 渲染對應權限的選單
            createMenu();
            // 更改密碼 Change Password
            btnOpen.on('click', function () {
                // Confirm
                $('.btnChangePsw').unbind('click').on('click', function (e) {
                    e.preventDefault(), e.stopPropagation();
                    changePsw(old_psw, new_psw, cfm_psw);
                });
                // Cancel
                $('.btnCancel, .close').unbind('click').on('click', function (e) {
                    e.preventDefault(), e.stopPropagation();
                    let trz = $(this).parents('.modal-content');
                    $.map(trz.find('.editInput'), function (item, index) {
                        if (item.value !== "") {
                            return check = false
                        } else {
                            return check = true
                        };
                    });
                    if (check == true) {
                        // 欄位未填任何內容，直接關閉
                        trz.find('.closez').trigger('click');
                    } else {
                        if (confirm("您尚未儲存內容，是否直接關閉？")) {
                            // 清空欄位的值
                            trz.find('.editInput').val('');
                            // 關閉
                            trz.find('.closez').trigger('click');
                        };
                    };
                });
            });
            // 登出 Logout
            btnLogout.on('click', getLogout);
        })
        .catch(rej => {
            // 未登入
            if (rej === "NotSignIn") {
                // alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                getLogout();
            };
        });
});