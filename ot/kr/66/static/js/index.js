var _addCart = 1;
var apiUrl = '/api';
var complain_status = 0;
var popupContent = `
<div class="server" id="server" onclick="showPopup('.popup')">
	<img src="./img/server-fill.png?v=12" alt="" data-href="" style="width: auto;">
</div>
<div class="popup">
	<div class="content">
	<div class="mb" onclick="outPopup('.popup')"></div>
		<div class="complain">
			<div style="text-align: center;font-size: 16px;font-weight: bold;">불만사항</div>
			<div class="in">
				<div class="label">성함</div>
				<input type="text" id="name" maxlength="25" class="mgmgInput" />
			</div>
			<div class="in">
				<div class="label">연락처</div>
				<input type="text" id="phone" maxlength="18" class="mgmgInput" />
			</div>
			<div class="mgmgInput-container in">
				<div class="label">불만사항 옵션</div>
				<select id="complain-type">
					<option value="">불만사항 옵션선택</option>
					<option value="1">답변이 느림</option>
					<option value="2">종목내용이 설명과 불일치</option>
					<option value="3">답변이 없음</option>
					<option value="4">허위광고</option>
				</select>
			</div>
				<div id="errorMessages" style="color: #ff0000;width:80%;margin:5px 10% 0;"></div>
				<button class="mgmgButton" onclick="validateForm()" style="margin-top:18px;width:80%;margin:10px 10% 0;">
					제출
				</button>
		</div>
	</div>
</div>
<div id="mg-message" class="hidden">
	<p></p>
</div>
`;
// 加入购物车事件
function addToCart(e, type = 1) {
	if (_addCart <= 0) {
		return false;
	}
	fbq('track', '加购');
	$.ajax({
		url: apiUrl + '/clickLog', // 替换为实际的API端点
		method: 'get',
		data: {
			host: e,
			type: type
		},
		dataType: 'json',
		success: function(response) {},
		error: function(xhr, status, error) {}
	});
	_addCart--;
}
$.ajax({
	url: apiUrl + '/getLink', // 替换为实际的API端点
	method: 'get',
	data: {
		host: host
	},
	dataType: 'json',
	success: function(response) {
		if (response.data) {
			complain_status = response.data.complain_status;
	        if(complain_status == 1) $(popupContent).appendTo('body');
			if (response.data.link) {
				$('.a-btns-b').css('display', 'flex');
				link = response.data.link;
			}
			if (response.data.link2) {
				$('.a-btns-k').css('display', 'flex');
				$('.k-show').css('display', 'block');
				link2 = response.data.link2;
			}
		}
	},
	error: function(xhr, status, error) {}
});
$.ajax({
	url: apiUrl + '/visitLog', // 替换为实际的API端点
	method: 'get',
	data: {
		host: host
	},
	dataType: 'json',
	success: function(response) {},
	error: function(xhr, status, error) {}
});


// 表单验证函数mgmgButton
function validateForm() {
	var name = document.getElementById('name').value;
	var phoneNumber = document.getElementById('phone').value;
	var complainType = document.getElementById('complain-type').value;
	var errorMessages = '';

	// 验证其他输入框是否为空
	if (name === '' || complainType === '' || phoneNumber === '') {
		if (name === '') {
			document.getElementById('name').classList.add('error');
		} else {
			document.getElementById('name').classList.remove('error');
		}
		if (complainType === '') {
			document.getElementById('complain-type').classList.add('error');
		} else {
			document.getElementById('complain-type').classList.remove('error');
		}
		if (phoneNumber === '') {
			document.getElementById('phone').classList.add('error');
		} else {
			document.getElementById('phone').classList.remove('error');
		}
		errorMessages += '내용을 입력하셔야 합니다\n';
	} else {
		document.getElementById('name').classList.remove('error');
		document.getElementById('complain-type').classList.remove('error');
		document.getElementById('phone').classList.remove('error');
	}

	// 显示错误消息或提交表单
	if (errorMessages !== '') {
		document.getElementById('errorMessages').textContent = errorMessages;
		return false; // 阻止表单提交
	} else {
		document.getElementById('errorMessages').textContent = '';
		subDeliver();
		return true; // 允许表单提交
	}
}

function subDeliver() {
	var name = document.getElementById('name').value;
	var phoneNumber = document.getElementById('phone').value;
	var complainType = document.getElementById('complain-type').value;
	$('.mgmgButton').addClass("loading").prop("disabled", true);
	$.ajax({
		url: apiUrl + '/api/deliver', // 替换为实际的API端点
		method: 'POST',
		data: {
			host: host,
			name: name,
			phone: phoneNumber,
			type: complainType
		},
		dataType: 'json',
		success: function(response) {
			var message = response.message;
			$('#apiResponse').text('API响应：' + message);
			$('.mgmgButton').removeClass("loading").prop("disabled", false);
			if (response.code == 200){
				showmgMessage('제출성공');
				$('.popup').fadeOut();
			}else if (response.code == 429) showmgMessage('시도가 빈번합니다', 'error');
			else showmgMessage('error', 'error');

		},
		error: function(xhr, status, error) {
			// 处理错误
			console.error('API调用失败：', status, error);
			$('.mgmgButton').removeClass("loading").prop("disabled", false);
			// $('.popup').fadeOut();
		}
	});
}

function showPopup(bn) {
	$(bn).fadeIn();
}

function outPopup(bn) {
	$(bn).fadeOut();
}

function showmgMessage(message, type = 'success') {
	var messageBox = $("#mg-message");
	messageBox.text(message);

	if (type === "success") {
		messageBox.addClass("success");
	} else {
		messageBox.removeClass("success");
	}

	messageBox.slideDown().delay(2000).slideUp();
}