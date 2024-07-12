//
function GetParameterByName_00(name_00, url_00) {
    if (!url_00) url_00 = window.location.href;
    name_00 = name_00.replace(/[\[\]]/g, '\\$&');
    var regex_00 = new RegExp('[?&]' + name_00 + '(=([^&#]*)|&|#|$)'),
        results_00 = regex_00.exec(url_00);
    if (!results_00) return null;
    if (!results_00[2]) return '';
    return decodeURIComponent(results_00[2].replace(/\+/g, ' '));
}
var atnct_value = GetParameterByName_00('atnct');

 if (atnct_value != null) {
//
var str_00_pre = '%7b%22' + atnct_value + '%22%2c%22_hostname%22%3a%22matsui%2eco%2ejp%22%7d'
var str_00 = str_00_pre.replace('_','%22%3a%22')
var JSONdata_00 = {"cookie_name": "_atnct","cookie_value":str_00};
//
    var request_00 = new XMLHttpRequest();
    request_00.open('POST', 'https://www.matsui.co.jp/api/set_cookie');
    request_00.timeout = 2000;
    request_00.setRequestHeader( 'Content-Type', 'application/json');
    request_00.send(JSON.stringify(JSONdata_00));
  }
