if(!navigator.userAgentData) {
  var ua = navigator.userAgent.toLowerCase();
  if(ua.indexOf("msie") != -1 || ua.indexOf("trident") != -1) location.href = '/utility/mente/requirements.html';
}