function getIEVersion1() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 이하 버전일 경우
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie), 10));
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 이하 버전일 경우
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv), 10));
    }

    // IE가 아닌 경우
    return -1;
}

function checkIE1() {
    var ieVersion = getIEVersion1();
    if (ieVersion === -1) {
        //console.log("이 브라우저는 Internet Explorer가 아닙니다.");
    } else {
        //console.log("이 브라우저는 Internet Explorer " + ieVersion + " 버전입니다.");
        var currentURL = window.location.href;
        if (ieVersion === 11 && currentURL.indexOf('10.200.93.141') !== -1) {
            ;
        }
        else {
            

        }
        var langPath = null;
        if(document.documentElement.lang === 'ko') langPath = 'kor';
        else if(document.documentElement.lang === 'en') langPath = 'eng';
        else if(document.documentElement.lang === 'id') langPath = 'idn';
        else if(document.documentElement.lang === 'zh') langPath = 'chn';
        else if(document.documentElement.lang === 'jp') langPath = 'jpn';

        window.location.href = '/' + langPath + '/explorer-end.html';
        //window.location.href = '/explorer-end.html';


    }
}
checkIE1(); 