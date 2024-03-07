// 全域使用 Commons
let idz, namez, module, count, html;
// Base URL
let URL = "http://localhost:59415/";
let IMGURL = "http://localhost:59415/backStage/img/";
// 判斷是否為 LINE 內建瀏覽器，如果是就加上 "openExternalBrowser=1"
if (navigator.userAgent.indexOf("Line") > -1) {
  location.href = window.location.href + "?" + "openExternalBrowser=1";
};
// 篩選、分頁器
let mainLens, pageLens;
let clsRcd, cls1Rcd, cls2Rcd, cls3Rcd, pageRcd, current = 1, listSize = 12, pageCount = 2;
// Search
btnSearch = $('.btnSearch'), keyword = $('.keyword');
// 驗證資訊
let errorTitle, errorText = "", check = true;
let limit = (1024 * 1024) * 5, imgLimit = 6; // 限制圖片大小 5MB || 圖片數量限制
const PhoneRegExp = /^(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}$/;
const CellRegExp = /^09\d{2}-?(\d{6}|\d{3}-\d{3})$/;
const EmailRegExp = /^([\w]+)(.[\w]+)*@([\w]+)(.[\w]{2,3}){1,2}$/;
const NumberRegExp = /^[0-9]*$/;
const Rules = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/; // 包含大小寫英數字，至少要 4 碼
const RulesSix = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/; // 包含大小寫英數字，至少要 6 碼
const MonthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; // 12 個月
// 驗證碼
let code = '', codeLength = 6;
// 免運規則
let freeRules = 1000, homeDevFee = 80; // 滿多少免運費 || 宅配費用

// HTML STATUS : 2XX (SUCCESS)
// 200 成功、201 新增成功、202 接受請求，未處裡、203 已處理，反饋可能非來自伺服器、204 已處理，未反饋、205 已處理、未反饋、206 已處理部分 GET 的請求
// FAIL STATUS : || ...
// Send Objects
// dataObj = {
//     "Methods": "", // 方法
//     "APIs": "", // API
//     "CONNECTs": "", // CONNECT 預設 || 總筆數用
//     "QUERYs":"", // 網址式：QUERY 內容篩選條件 (未填則為使用 CONNECTs)
//     "Sends": "", // 物件式：內容篩選條件 (GET 方法可 Null)
//     "Counts": "" // 頁面顯示筆數
// };
// 取得總頁數 ( 1. CONNECT 為全資料總頁數 || 2. QUERY 為篩選的資料總頁數 )
function getTotalPages(dataObj) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status == 200) {
        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
          let callBackData = JSON.parse(xhr.responseText);
          console.log(callBackData)
          let pages = Math.ceil(callBackData.length / Number(dataObj.Counts)); // 資料總筆數 / 頁面顯示筆數 
          resolve(pages); // 返回取得總頁數
        } else {
          resolve(0); // 沒有資料，所以總頁數為 0
        };

      } else {
        reject("NOTFOUND"); // 沒有成功
      };
    };
    xhr.open(`${dataObj.Methods}`, `${dataObj.APIs}${(dataObj.CONNECTs !== "") ? dataObj.CONNECTs : dataObj.QUERYs}`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send((dataObj.Sends !== "") ? $.param(dataObj.Sends) : null);
  });
};
// 點擊頁碼取得對應筆數的資料 || 取得內容
function getPageDatas(dataObj) {
  // 1. 動態顯示點擊後的資料
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status == 200) {
        if (xhr.responseText !== "" && xhr.responseText !== "[]") {
          let callBackData = JSON.parse(xhr.responseText);
          resolve(callBackData); // 返回取得資料
        } else {
          resolve(null); // 沒有資料
        };
      } else {
        reject("NOTFOUND"); // 沒有成功
      };
    };
    xhr.open(`${dataObj.Methods}`, `${dataObj.APIs}${(dataObj.QUERYs !== "") ? dataObj.QUERYs : dataObj.CONNECTs}`, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send((dataObj.Sends !== "") ? $.param(dataObj.Sends) : null);
  });
};
// 接收資料，做渲染、處理
// function process(data) {
// };

// FACEBOOK API
let FBAPPID = '824221435146866';
window.fbAsyncInit = function () {
  FB.init({
    appId: FBAPPID,
    cookie: true,
    xfbml: true,
    version: 'v12.0'
  });
  FB.AppEvents.logPageView();
};
(function (d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) { return; }
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// FACEBOOK
function FACEBOOKLOGIN() {
  FB.login(function (res) {
    if (res.status === "connected") { // 瀏覽器目前已記錄使用者登入的 FB
      let FB_TOKEN = res["authResponse"]["accessToken"];
      let xhr = new XMLHttpRequest();
      xhr.onload = function () {
        if (xhr.status == 200) {
          if (xhr.responseText !== "") {
            // let callBakData = JSON.parse(xhr.responseText);
            location.href = "./member_profile.html";
          };
        };
      };
      xhr.open('GET', `${URL}AuthUser/FBLogin?token=${FB_TOKEN}`, true);
      // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
      xhr.send(null);
    } else { };
  }, { scope: 'public_profile,email', auth_type: 'reauthenticate' });
};
// GOOGLE
function GOOGLELOGIN() {
  location.href = "https://accounts.google.com/o/oauth2/v2/auth?client_id=271222022400-pnqe16fno0j8mj0h86shbnqalq2gf3m3.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Ftcayla.webshopping.vip%2Fapi%2Fauthuser%2Fgooglelogin&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile&response_type=code";
};
// LINE
function LINELOGIN() {
  location.href = "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=1656162595&redirect_uri=http%3A%2F%2Fhttp://localhost:59415/frontStage%2Fauthuser%2Flinelogin&state=http%3A%2F%2Fhttp://localhost:59415/frontStage&scope=openid%20profile%20email";
};
// 登入驗證
function dataUpdateCheck(acc, psw, code) {
  if (acc.val().trim() === '' || EmailRegExp.test(acc.val().trim()) === false) {
    acc.focus();
    return check = false, errorText = '請確認帳號（Email）是否確實填寫，或格式是否正確！';
  }
  if (psw.val().trim() === '' || Rules.test(psw.val().trim()) === false) {
    psw.focus();
    return check = false, errorText = '請確認密碼是否確實填寫，或格式是否正確！';
  }
  if (code.val().trim() === "") {
    code.focus();
    return check = false, errorText = '請確認驗證碼欄位是否確實填寫！';
  }
  if (code.val().trim() !== $('.code_var').html()) {
    code.focus();
    return check = false, errorText = '請確認驗證碼欄位是否填寫正確！';
  }
  else {
    return check = true, errorText = "";
  };
};

// 金流資訊（固定）
let flowObj = {
  "MerchantId": "990000008",
  "TerminalId": "900080001",
  "MerchantName": "芯悠購物商城",
  "RequestUrl": "https://test.payware.com.tw/wpss/authpay.aspx",
  "ReturnURL": "http://localhost:59415/Payment/Return",
  "Encoding": "utf-8",
  "GoBackURL": "http://localhost:59415/frontStage",
  "ReceiveURL": "http://localhost:59415/Payment/Receive",
  "DeadlineDate": "",
  "RequiredConfirm": "1",
  "deferred": 7,
  "validateKey": "validateKey"
};
// 送出訂單
function sendOrder(mchantId, termId, mchantName, rquetURL, rturnURL, payType, odrNo, amt, pdt, odrDesc, enConding, mobile, telNum, addr, mail, memId, goBackURL, receURL, dLineDate, rquiredCfm, deferred, carrier, invoName, validateKey) {
  let formData = $('.sendOrderForm');

  formData.find('input[name="MerchantId"]').val(mchantId);
  formData.find('input[name="TerminalId"]').val(termId);
  formData.find('input[name="MerchantName"]').val(mchantName);
  formData.find('input[name="RequestUrl"]').val(rquetURL);
  formData.find('input[name="ReturnURL"]').val(rturnURL);
  formData.find('input[name="PayType"]').val(payType);
  formData.find('input[name="OrderNo"]').val(odrNo);
  formData.find('input[name="Amount"]').val(amt);
  formData.find('input[name="Product"]').val(pdt);
  formData.find('input[name="OrderDesc"]').val(odrDesc);
  formData.find('input[name="Encoding"]').val(enConding);
  formData.find('input[name="Mobile"]').val(mobile);
  formData.find('input[name="TelNumber"]').val(telNum);
  formData.find('input[name="Address"]').val(addr);
  formData.find('input[name="Email"]').val(mail);
  formData.find('input[name="memberId"]').val(memId);
  formData.find('input[name="GoBackURL"]').val(goBackURL);
  formData.find('input[name="ReceiveURL"]').val(receURL);
  formData.find('input[name="DeadlineDate"]').val(dLineDate);
  formData.find('input[name="RequiredConfirm"]').val(rquiredCfm);
  formData.find('input[name="deferred"]').val(deferred);
  formData.find('input[name="Carrier"]').val(carrier);
  formData.find('input[name="InvoiceName"]').val(invoName);
  formData.find('input[name="validateKey"]').val(validateKey);

  formData.submit();
};

// QueryString 
function request(paras) {
  let url = location.href;
  let paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  let paraObj = {}
  for (i = 0; j = paraString[i]; i++) {
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
  };
  let returnValue = paraObj[paras.toLowerCase()];
  if (typeof (returnValue) == "undefined") {
    return "";
  } else {
    return returnValue;
  };
};
// 金額每三位數加逗號
function thousands(num) {
  let str = num.toString();
  let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
  return str.replace(reg, "$1,");
};
// 日期轉換
function dateChange(e) {
  return e.split(" ")[0].replace(/\//g, '').replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
};
// 數字欄位的限制（包含頁面上動態產生的數字欄位）
// 1. 只能輸入數字
$(document).on('input', '.numberz', function () {
  $(this).val($(this).val().replace(/[^\d].*$/g, ''));
});
// 2. 折扣額度的限制（只能輸入最多一位數、加小數點只能後一位）
$(document).on('input', '.qtaz', function () {
  $(this).val($(this).val().replace(/[^0-9]{0,1}(\d?(?:\.\d{0,1})?).*$/g, '$1'));
});

// 產生驗證碼
function createCode(checkCode) {
  code = new Array();
  checkCode.html('');
  var selectChar = new Array(2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
  for (var i = 0; i < codeLength; i++) {
    var charIndex = Math.floor(Math.random() * 32);
    code += selectChar[charIndex];
  }
  if (code.length != codeLength) {
    createCode();
  }
  checkCode.html(code);
};
// 取得登入者資訊
function getLoginInFo() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.onload = () => {
      if (xhr.status == 200) {
        let callBackData = JSON.parse(xhr.responseText);
        if (callBackData.Result == "OK") {
          // 將取得的資訊寫入 LocalStorage
          resolve(callBackData.Content);
        } else {
          reject(callBackData.Content);
        }
      } else {
        reject('NotSignIn');
      };
    };
    xhr.open('POST', `${URL}AuthUser/LoginInfo`, true);
    xhr.send(null);
  });
};
// 寫入 LocalStorage
function writeData(res) {
  localStorage.setItem('id', res.id);
  localStorage.setItem('name', res.name);
  localStorage.setItem('module', JSON.stringify(res.module));
  localStorage.setItem('count', res.Count);

  // 取得在 LocalStorage 中的登入者資訊
  idz = localStorage.getItem('id');
  namez = localStorage.getItem('name');
  module = localStorage.getItem('module');
  count = localStorage.getItem('count');

}
// 登出 Logout
function getLogout() {
  // 1. 清除Session中的登入者資訊
  localStorage.removeItem('id');
  localStorage.removeItem('name');
  localStorage.removeItem('module');
  localStorage.removeItem('count');
  localStorage.removeItem(`fblst_${FBAPPID}`);
  sessionStorage.removeItem(`fbssls_${FBAPPID}`);
  // 2. 呼叫登出的API
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      let callBackData = JSON.parse(xhr.responseText);
      if (callBackData.Result == 'OK') {
        location.href = './member_login.html';
      } else {
        alert(callBackData.Content);
      }
    };
  };
  xhr.open('POST', `${URL}AuthUser/Logout`, true);
  xhr.send(null);
};
// 分頁器 Pagination
let paginations = $('.pagination');
function curPage(iNow, lens, count) { // 當前頁碼 , 總頁數 , 頁面上產生幾個頁碼
  var pickz = `<li class="page-item active"><a class="page-link" data-num="${iNow}">` + iNow + `</a></li>`; // 指向當前頁碼
  // 迴圈產呈現在頁面上的頁碼，count 控制迴圈數，用以控制產生的頁碼數量
  for (let i = 1; i < count; i++) {
    if (iNow - i > 1) { // 當 iNow - i 小於 1 時，會產生小於 iNow 的頁碼 
      pickz = `<li class="page-item"><a class="page-link" data-num="${iNow - i}">` + (iNow - i) + `</a></li>` + pickz;
    }
    if (iNow + i < lens) { // 當 iNow - i 大於 1 時，會產生大於 iNow 的頁碼 
      pickz = pickz + `<li class="page-item"><a class="page-link" data-num="${iNow + i}">` + (iNow + i) + `</a></li>`;
    }
  }
  if (iNow == 1) { // 當前頁碼是1的時候，上一頁的按鈕鎖定
    paginations.find('li:first-child').addClass('disabled');
  }
  if (iNow - 3 > 0) { // 當 當前頁碼 大於3的話 前面的頁碼 省略
    pickz = `<li class="page-item disabled"><a class="page-link" data-num="none">...</a></li>` + pickz;
  }
  if (iNow > 1) { // 當 當前頁碼 大於1的話 要顯示第1頁的頁碼，並且開啟上一頁按鈕
    pickz = `<li class="page-item"><a class="page-link" data-num="1">1</a></li>` + pickz;
    paginations.find('li:first-child').removeClass('disabled');
  }
  if (iNow + 2 < lens) { // 當前頁碼 的下一頁之後 省略
    pickz = pickz + `<li class="page-item disabled"><a class="page-link" data-num="none">...</a></li>`;
  }
  if (iNow < lens) { // 當前頁碼 小於總頁碼的話 頁顯示最後1頁的頁碼，並且開啟下一頁按鈕
    pickz = pickz + `<li class="page-item"><a class="page-link" data-num="${lens}">` + lens + `</a></li>`;
    paginations.find('li:last-child').removeClass('disabled');
  }
  if (iNow == lens) { // 當 當前頁碼為最後一頁時，鎖定下一頁按鈕
    paginations.find('li:last-child').addClass('disabled');
  }
  // paginations.unbind('click'); // 重設原本已有的點擊事件
  return pickz;
};
// 加入購物車
function addCart(e, addObj) {
  e.preventDefault();
  let xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      if (xhr.responseText !== "" && xhr.responseText !== "[]") {
        let callBackData = JSON.parse(xhr.responseText);
        check = true;
        if (callBackData.Count > 0) {
          let res = $.map(callBackData.Items, function (item, index) {
            if (item.sku_id == addObj.sku_id) {
              return check = false;
            };
          });
          if (check == true) {
            if (addObj.stock_qty > 0 && addObj.sell_stop == 0) {
              let xhr = new XMLHttpRequest();
              xhr.onload = function () {
                if (xhr.status == 200) {
                  let callBackData = JSON.parse(xhr.responseText);
                  if (callBackData.Result == "OK") {
                    alert(`加入成功，目前購物車有 ${callBackData.Content} 件商品。`);
                    // 更新 Header 上的購物車商品數量
                    $('#header').find('.cart-box .num').text(callBackData.Content);
                  }
                }
              };
              xhr.open('POST', `${URL}Orders/AddCart`, true);
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
              xhr.send($.param(addObj));
            } else {
              alert("不好意思，商品目前已售完。")
            };
          } else {
            alert("此商品已加入購物車囉！");
          };
        };
      } else {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status == 200) {
            alert(`加入購物車成功！`);
            location.reload();
          };
        };
        xhr.open('POST', `${URL}Orders/AddCart`, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
        xhr.send($.param(addObj));
      };
    } else {
      swal.fire({
        title: '請先登入會員',
        html: `
          <div class="sweetAlertLogins">
            <div class="group-wrap">
              <div class="group-full">
                  <div class="group-box import">
                      <div class="group-title">會員帳號</div>
                      <div class="group-main">
                          <input type="text" placeholder="請輸入您的會員信箱" class="group-input mem_act">
                      </div>
                  </div>
              </div>
              <div class="group-full">
                  <div class="group-box import">
                      <div class="group-title">會員密碼</div>
                      <div class="group-main">
                          <input type="password" placeholder="請輸入您的會員密碼" class="group-input mem_psw">
                      </div>
                  </div>
              </div>
              <div class="group-full">
                  <div class="group-box import has-code">
                      <div class="group-title">驗證碼</div>
                      <div class="group-main">
                          <input type="text" class="group-input group-code codes" placeholder="請輸入驗證碼" >
                          <div class="code_set">
                              <div class="code_var"></div>
                              <div class="btnCode"><i class="far fa-exchange-alt"></i> </div>
                          </div>
                      </div>
                      
                  </div>
              </div>
              <div class="group-full button-box">
                  <button type="button" class="button-style first btnLogin">會員登入</button>
              </div>
              <div class="group-full link-text">
                  <a href="./member_getpwd.html" class="btn-third btnGetPsw">忘記密碼？</a>
              </div>
              <div class="or-line"><span>OR</span></div>
                <div class="group-full">
                    <div class="setupBlock">
                        <a href="#" class="button-style first fb btnWithFaceBook"><i class="fab fa-facebook"></i> Facebook快速登入</a>
                        <a href="#" class="button-style first gl btnWithGoogle"><i class="fab fa-google-plus-g"></i> Google快速登入</a>
                        <a href="#" class="button-style first line btnWithLine"><i class="fab fa-line"></i> LINE快速登入</a>
                    </div>
                </div>
              </div>
            </div>
          </div>
        `,
        showCloseButton: true,
        showConfirmButton: false,
      });
      let codes = $('.codes'), code_var = $('.code_var'), btnCode = $('.btnCode');
      // 驗證碼
      createCode(code_var);
      btnCode.on('click', function (e) {
        e.preventDefault();
        createCode(code_var);
      });
      // 登入會員
      $('.btnLogin').on('click', function () {
        // 驗證
        dataUpdateCheck($('.mem_act'), $('.mem_psw'), codes);
        console.log(check, errorText);
        if (check == true) {
          let loginObj = {
            "account": $('.mem_act').val(),
            "password": $('.mem_psw').val()
          };
          let xhr = new XMLHttpRequest();
          xhr.onload = async () => {
            if (xhr.status == 200) {
              // 將回傳的資料轉為物件作使用
              let callBackData = JSON.parse(xhr.responseText);
              console.log(callBackData)
              if (callBackData.Result == 'OK') {
                await getLoginInFo().then(res => {
                  writeData(res);
                });
                location.reload();
              } else {
                alert(callBackData.Content);
              };
            } else {
              alert("錯誤訊息 " + xhr.status);
            }
          }
          xhr.open('POST', `${URL}AuthUser/Login`, true);
          // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
          xhr.send($.param(loginObj));
        } else {
          alert(errorText);
          codes.val(''), createCode(code_var); // 重新產生驗證碼
        };
      });
      // FB
      $('.btnWithFaceBook').on('click', function (e) {
        e.preventDefault();
        FACEBOOKLOGIN();
      });
      // GOOGLE
      $('.btnWithGoogle').on('click', function (e) {
        e.preventDefault();
        GOOGLELOGIN();
      });
      // LINE
      $('.btnWithLine').on('click', function (e) {
        e.preventDefault();
        LINELOGIN();
      });
    };
  };
  xhr.open('GET', `${URL}Orders/GetCart`, true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
  xhr.send(null);
};
$(function () {
  var win = $(window), header = $('#header'), gotop = $('#gotop');
  win.on('resize scroll', function () {
    var bodyTop = $(this).scrollTop();
    if (bodyTop >= 300) {
      gotop.addClass('barscroll');
      header.removeClass('topscroll').addClass('barscroll');
    } else {
      gotop.removeClass('barscroll');
      header.removeClass('barscroll').addClass('topscroll');
    }
  }).trigger('resize scroll');
  gotop.on('click', function () {
    $('html, body').stop().animate({ scrollTop: 0 }, 500);
  });
  $('#nav-icon').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    $('#header .control-box').data('switch', 'open').removeClass('open');
    $('#header .control-list').removeClass('is-open');
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close').addClass('open');
      $('#header').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open').removeClass('open');
      $('#header').removeClass('is-open');
    }
  });
  $('#header .control-box').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    $('#nav-icon').data('switch', 'open').removeClass('open');
    $('#header').removeClass('is-open');
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close').addClass('open');
      $('#header .control-list').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open').removeClass('open');
      $('#header .control-list').removeClass('is-open');
    }
  });
  $('.p-category .txt').data('switch', 'open').on('click', function (e) {
    var $eleThis = $(this);
    if ($eleThis.data('switch') == 'open') {
      $eleThis.data('switch', 'close');
      $('.p-category').addClass('is-open');
    } else {
      $eleThis.data('switch', 'open');
      $('.p-category').removeClass('is-open');
    }
  });

  // 判斷登入與否
  getLoginInFo()
    .then(res => {
      // 登入成功，將資訊寫入 LocalStorage
      writeData(res);

      // 將目前購物車的商品數寫入 Header
      $('#header').find('.cart-box .num').text(count);

      // 加入購物車
      $('.btnAddCart').on('click', function (e) {
        e.preventDefault();
        let dataObj = {
          "spu_id": $('#product-detail').data('num'), // 選取的商品規格 Id
          "sku_id": $('.spec-item.active').data('num'), // 選取的商品規格 Id
          "qty": $('.edit_qty').val(),
          "stock_qty": $('.spec-item.active').data('qty'),
          "sell_stop": 0
        };
        addCart(e, dataObj);
      });
      // 加入 WISHLIST
      $('.btnAddWish').on('click', function (e) {
        e.preventDefault();
        let sku_id = $('.spec-item.active').data('num'); // 選取的商品規格 Id
        let dataObj = {
          "Sku_id": sku_id // 進入商品名細分頁即取得
        };
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
          if (xhr.status == 200) {
            if (xhr.responseText !== "") {
              let callBackData = JSON.parse(xhr.responseText);
              for (let i = 0; i < callBackData.length; i++) {
                if (callBackData[i].Sku_Id == sku_id) {
                  check = false;
                } else {
                  check = true;
                };
              }
              if (check == true) {
                let dataObj = {
                  "sku_id": sku_id,
                };
                if (confirm("確定要新增這項商品的追蹤嗎？")) {
                  let xhr = new XMLHttpRequest();
                  xhr.onload = function () {
                    if (xhr.status == 200 || xhr.status == 204) {
                      alert("新增成功！");
                      location.reload();
                    } else {
                      alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                      // getLogout();
                    };
                  };
                  xhr.open('POST', `${URL}MemberUser/AddWish`, true)
                  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                  xhr.send($.param(dataObj));
                };
              } else {
                alert("此商品已加入您的追蹤清單囉！");
              };
            } else {
              if (confirm("確定要新增這項商品的追蹤嗎？")) {
                let xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  if (xhr.status == 200 || xhr.status == 204) {
                    alert("新增成功！");
                    location.reload();
                  } else {
                    alert("錯誤訊息 " + xhr.status + "：您的連線異常，請重新登入！");
                    // getLogout();
                  };
                };
                xhr.open('POST', `${URL}MemberUser/AddWish`, true)
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send($.param(dataObj));
              };
            };
          };
        };
        xhr.open('GET', `${URL}MemberUser/GetWish`, true);
        // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
        xhr.send(null);
      });
      // 商品詳細分頁 詢問記錄
      $('.ask-sends').html('').html(`
        <textarea class="edit_askContent" placeholder="有什麼問題想要留言的嗎？"></textarea>
        <div class="setupBlock">
            <a href="#" class="button-style first btnSendAsk">送出</a>
        </div>
      `);
      $('.btnSendAsk').on('click', function (e) {
        e.preventDefault();
        let spu_id = $('#product-detail').data('num') // 選取的商品規格 Id
        let content = $('.edit_askContent');

        if ($('.edit_askContent').val() !== "") {
          let dataObj = {
            "spu_id": spu_id,
            "quection": content.val()
          }
          if (confirm("確認您的詢問內容無誤嗎？")) {
            let xhr = new XMLHttpRequest();
            xhr.onload = function () {
              if (xhr.status == 200) {
                alert('問題送出成功，商家將會盡快回覆您！');
                location.reload();
              }
            }
            xhr.open('POST', `${URL}Product/AddQuestion`, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
            xhr.send($.param(dataObj));
          }
        } else {
          alert('請先填寫想要詢問的內容！');
        }
      });
    })
    .catch(rej => {
      // 尚未登入
      if (rej === "NotSignIn") {
        // Header 上的購物車商品數為 0
        $('#header').find('.cart-box .num').text("0");
        // 加入WISHLIST、加入購物車
        $('.btnAddWish, .btnAddCart').on('click', function () {
          swal.fire({
            title: '請先登入會員',
            html: `
              <div class="sweetAlertLogins">
                <div class="group-wrap">
                  <div class="group-full">
                      <div class="group-box import">
                          <div class="group-title">會員帳號</div>
                          <div class="group-main">
                              <input type="text" placeholder="請輸入您的會員信箱" class="group-input mem_act">
                          </div>
                      </div>
                  </div>
                  <div class="group-full">
                      <div class="group-box import">
                          <div class="group-title">會員密碼</div>
                          <div class="group-main">
                              <input type="password" placeholder="請輸入您的會員密碼" class="group-input mem_psw">
                          </div>
                      </div>
                  </div>
                  <div class="group-full">
                      <div class="group-box import has-code">
                          <div class="group-title">驗證碼</div>
                          <div class="group-main">
                              <input type="text" class="group-input group-code codes" placeholder="請輸入驗證碼" >
                              <div class="code_set">
                                  <div class="code_var"></div>
                                  <div class="btnCode"><i class="far fa-exchange-alt"></i> </div>
                              </div>
                          </div>
                          
                      </div>
                  </div>
                  <div class="group-full button-box">
                      <button type="button" class="button-style first btnLogin">會員登入</button>
                  </div>
                  <div class="group-full link-text">
                      <a href="./member_getpwd.html" class="btn-third btnGetPsw">忘記密碼？</a>
                  </div>
                  <div class="or-line"><span>OR</span></div>
                    <div class="group-full">
                        <div class="setupBlock">
                            <a href="#" class="button-style first fb btnWithFaceBook"><i class="fab fa-facebook"></i> Facebook快速登入</a>
                            <a href="#" class="button-style first gl btnWithGoogle"><i class="fab fa-google-plus-g"></i> Google快速登入</a>
                            <a href="#" class="button-style first line btnWithLine"><i class="fab fa-line"></i> LINE快速登入</a>
                        </div>
                    </div>
                  </div>
              </div>
            `,
            showCloseButton: true,
            showConfirmButton: false,
          });
          let codes = $('.codes'), code_var = $('.code_var'), btnCode = $('.btnCode');
          // 驗證碼
          createCode(code_var);
          btnCode.on('click', function (e) {
            e.preventDefault();
            createCode(code_var);
          });
          // 登入會員
          $('.btnLogin').on('click', function () {
            // 驗證
            dataUpdateCheck($('.mem_act'), $('.mem_psw'), codes);
            console.log(check, errorText);
            if (check == true) {
              let loginObj = {
                "account": $('.mem_act').val(),
                "password": $('.mem_psw').val()
              };
              let xhr = new XMLHttpRequest();
              xhr.onload = async () => {
                if (xhr.status == 200) {
                  // 將回傳的資料轉為物件作使用
                  let callBackData = JSON.parse(xhr.responseText);
                  console.log(callBackData)
                  if (callBackData.Result == 'OK') {
                    await getLoginInFo().then(res => {
                      writeData(res);
                    });
                    location.reload();
                  } else {
                    alert(callBackData.Content);
                  };
                } else {
                  alert("錯誤訊息 " + xhr.status);
                }
              }
              xhr.open('POST', `${URL}AuthUser/Login`, true);
              // xhr.withCredentials = true; // 設定跨域請求是否帶 Cookies
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); // 設定文件請求表頭格式
              xhr.send($.param(loginObj));
            } else {
              alert(errorText);
              codes.val(''), createCode(code_var); // 重新產生驗證碼
            };
          });
          // FB
          $('.btnWithFaceBook').on('click', function (e) {
            e.preventDefault();
            FACEBOOKLOGIN();
          });
          // GOOGLE
          $('.btnWithGoogle').on('click', function (e) {
            e.preventDefault();
            GOOGLELOGIN();
          });
          // LINE
          $('.btnWithLine').on('click', function (e) {
            e.preventDefault();
            LINELOGIN();
          });
        });
        // 商品詳細分頁 詢問記錄
        $('.ask-sends').html('').html(`
        <div class="setupBlock">
          <div><a class="btnLink" href="./member_login.html">登入</a>後，即可詢問哦！ <div>
        </div>
      `);
      };
    });
  // MemberSet
  $('.btnMember').on('click', function (e) {
    e.preventDefault();
    getLoginInFo().then(res => {
      writeData(res);
      location.href = "./member_profile.html"
    }, rej => {
      if (rej == "NotSignIn") {
        location.href = "./member_login.html"
      };
    });
  });
  // GoCart
  $('.btnGoCart').on('click', function (e) {
    e.preventDefault();
    getLoginInFo().then(res => {
      writeData(res);
      location.href = "./flow_cart.html"
    }, rej => {
      if (rej == "NotSignIn") {
        location.href = "./member_login.html"
      };
    });
  });
  // 登出
  $('.btnLogout').on('click', function (e) {
    e.preventDefault();
    getLogout();
  });
  // Search
  btnSearch.on('click', function (e) {
    e.preventDefault();
    if (keyword.val() !== "") {
      let num = keyword.val();
      // 導到商品列表頁
      location.href = `./product_list.html?search=${num}`;
    } else {
      alert("請輸入商品名稱或關鍵字！");
      // SweetAlert 
      // swal.fire({
      //   title: '',
      //   icon: 'warning',
      //   html: '請輸入商品名稱或關鍵字！',
      //   buttonsStyling: false,
      //   confirmButtonClass: 'button-style first btnSweet',
      //   confirmButtonText:
      //     '確定',
      //   width: '320px',
      //   padding: '0 0 45px'
      // }).catch(swal.noop);
    };
  });
  // 
  AOS.init({
    easing: 'ease-in-out-sine',
    duration: 900
  });
});