
async function webCounter(type){
	let domainName=document.domain;
	let url='https://getleaguevip.buzz/webCounter/plusOne/';
	return await $.get(url+type,{domainName});
}
window.onload=async function(){
	const isDisplay =webCounter("onload");
	console.log("是否合法",true);
}
function copyUrl() {
	webCounter("copy");
	var oInput = document.createElement('input');
	oInput.value = lineCode;
	document.body.appendChild(oInput);
	oInput.select(); // 选择对象
	document.execCommand("Copy"); // 执行浏览器复制命令
	// oInput.className = 'oInput';
	// oInput.parentNode.removeNode(oInput);
	// alert('復制成功，開啟LINE去新增客服，瞭解更多');
	layer.open({
		title: 'LINE ID：&nbsp;' + lineCode + '&nbsp;複製成功',
		content: '點選左下角開啟LINE去新增客服，瞭解更多',
		btn: ['開啟LINE', '放棄'],
		yes: startLine,
		btnAlign: 'c',
		closeBtn: 0
	});
}
function startLine(){
	console.log("點擊了LINE:"+lineCode);
	webCounter("onclick");
	window.location.href="https://bit.ly/3yTW5vh";
}