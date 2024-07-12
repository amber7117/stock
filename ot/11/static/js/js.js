url_param = window.location.search
var gtag_id = ''
var gtag_conversion = '';

var app_id = '';
//号码区域
var number_id = '';
var number = '';
var app_prefix = '';
var web_prefix = '';
var platform_pkg_name = '';
var min_age = '';
if (isEmpty(min_age)) min_age = 0;
var max_age = '';
//默认号码区域
var default_number_id = '';
var default_number = '';
var default_app_prefix = '';
var default_web_prefix = '';
var default_platform_pkg_name = '';
var default_min_age = '';
if (isEmpty(default_min_age)) default_min_age = 0;
var default_max_age = '';
var is_with = '';
var tag = '';
var link_id = '';

var automatically = '';

//点击按钮
function btnClick() {
    if (min_age <= 0) { //不限制年龄
        toGo();
    } else { //弹出年龄选项
        setDomVisible("ageBgDiv", "flex");
    }
}

//dom显示状态控制
function setDomVisible(id, visible) {
    console.log(id);
    document.getElementById(id).style.display = visible;
}



function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}


setTimeout(function() {
    $('.mask').css('display', 'flex')
}, 8000)

function down() {
    $('.mask').css('display', 'none')
}