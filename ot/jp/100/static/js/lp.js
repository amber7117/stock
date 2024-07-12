
var __params = new Object;
var __pair = location.search.substring(1).split('&');
for (var i = 0; __pair[i]; i++) {
    var kv = __pair[i].split('=');
    __params[kv[0]] = kv[1];
}

var __target_elements = document.getElementsByClassName('href-add-friend');
if (__target_elements.length > 0) {
    for (var i = 0; i < __target_elements.length; i++) {
        var element = __target_elements[i];
        var href = element.href;
        if(href !== undefined){
            var aid = __params['aid'] !== undefined ? __params['aid'] : null;
            if(__params['rid'] !== undefined){
                aid = 'rid:' + __params['rid'];
            }
            href = href.replace(/---AID---/, aid);
            element.href = href;
        }
    }
}

var __target_elements = document.getElementsByClassName('action-optin');
if (__target_elements.length > 0) {
    for (var i = 0; i < __target_elements.length; i++) {
        var element = __target_elements[i];
        var action = element.action;
        if(action !== undefined){
            action = action.replace(/---AID---/, __params['aid']);
            element.action = action;
        }
    }
}
