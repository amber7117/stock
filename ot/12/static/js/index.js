function queryStock(queryStock,_tp) {
	_tp=_tp||'c';
	var isCatch = false;
	if (queryStock) {
		if (!/^\d{6}$/.test(queryStock)) {
			for (var i = 0, len = s.length; i < len; i++) {
				var item = s[i];
				if (item.n === queryStock || item.c === queryStock) {
					isCatch = true;
					if(_tp=='n'){
						queryStock = item.n;
					}else{
						queryStock = item.c;
					}
					break;
				}
			}
		} else {
			isCatch = true;
		}
		if (isCatch) {
			return queryStock;
		} else {
			return '000001';
		}
	} else {
		return '000001';
	}
};

var detectBrowser = function (name) {
	if (navigator.userAgent.toLowerCase().indexOf(name) > -1) {
		return true;
	} else {
		return false;
	}
};
$('.lwtop').html('<div class="lvtt"> <img class="bk" src="static/picture/lw_t_yk.png"> <span class="num"><img src="static/picture/lw_t_q.png"></span> <img src="static/picture/sx.png" class="sx"> <div class="bt"> <img src="static/picture/lw_t_bt.png"> <div class="top-code-name"> <span class="tcn-s1">深度挖掘</span> <span class="tcn-s2 tcodeName"></span> <span class="tcn-s1">背后的玄机</span> </div> </div> <i><code>99</code>%</i> </div> <div class="searchBg"> <input type="text" id="gupiao" placeholder="输入股票名称/代码" maxlength="6" name="stockcode1" class="searchInput" autocomplete="off"> <div class="searchBtn" id="btnBgcs"></div> <div style="display: none;width:700px;height: 150px; background: nThree;font-size: 24px; position: absolute;top: 81px;left: 0px; z-index: 999999;" id="instr"> <table style="background: #EFEFEF;width: 100%;height: auto;"> <thead> <tr style="text-align:center;"> <td>股票代码</td> <td>股票名称</td> </tr> </thead> <tbody id="codelist"> <tr style="cursor:pointer;text-align:center;"> </tr> </tbody> </table> </div> </div>');
var width = parseInt(window.screen.width);
if (detectBrowser("mz-m2")) width = 360;
var scale = width / 750;
var userScalable = 'no';
if (detectBrowser("qq/")) userScalable = 'no';
$('#viewport').attr('content', 'width=640,user-scalable=' + userScalable + ',initial-scale=' + scale);
layer.config({
	maxWidth: '560'
});

function getCodeInfo(code) {
    //var sendCode = getGuojinMarketType(code);
    $('#stock-input').val(code);
	let cname=queryStock(code,'n');
	if(cname){
		$('.gName,.btnBg span,.btnBgb span,.gpName,.tomorrow .red,.heade_bottom b,.diagnose-bg span,.price-bg h5 span,.price-bg h6 span,.result-bg span,.tc-bg .tc span,.tcodeName,.cname').html(cname);
	}
	$('.gCode,.diagnose-bg b,.result-bg b').text('( ' + code + ' )'); //代码
	$('.dialogBg span').text(code); //代码
	$("#tcode").html(code);
	
	return;


};



function hideiframe() {
	$("#SonContent0").hide();
	$(".charts").stop(true);
	$(".charts").width("0px");
	$('.tan_400').css('background-color', '#fff').css('border-radius', '0');
	$(".discuss").html("正在通过事件驱动策略模型...");
	$('.discuss').css('display', 'inline-block').css('padding', '24px').css('padding-bottom', '56px');
	$('.barbox').show();
};

function animate(gname) {
	$(".tan_title").css("padding-bottom", "20px");
	$("#inputQQ").hide();
	$(".charts").animate({
		width: "25%"
	}, 600, "", function () {
		$(".discuss").html("正在通过AI计算...");
	});
	$(".charts").animate({
		width: "50%"
	}, 600, "", function () {
		$(".discuss").html("正在通过VAR系统确认风险值...");
	});
	$(".charts").animate({
		width: "75%"
	}, 800, "", function () {
		$(".discuss").html("正在通过量价交易模型...");
	});

	$(".charts").animate({
		width: "100%"
	}, 800, "", function () {
		hideiframe();
		$('.dialog4,.zhegai').show();
	});
}

$('.circle4').on('click', function () {
	$('.tan_div,.zhegai,.dialog4').hide();
	$("#SonContent0 .tan_content").show();
});

function saveMobile() {
	zpcj = cNum;
	if (zpcj == '' || !checkData(s, "c", zpcj)) {
		layer.msg('请输入正确的股票代码');
		return false;
	} else {
		$(".discuss").html("正在通过事件驱动策略模型...");
		animate();
		$("#SonContent0").show();
	}
}

$('#btnBgc').on('click', function () {
	cNum = $.trim($("#gupiao").val());
	cNum = queryStock(cNum);
	if (cNum == '' || !checkData(s, "c", cNum)) {
		layer.msg('请输入正确的股票代码');
		return false;
	} else {
		getCodeInfo(cNum);
		saveMobile();
	}
});

var referer = document.referrer;
var url = escape(window.location.href);
var myreg = /^1(3|4|5|6|7|8|9)\d{9}$/;
// 如果有登记姓名时，keword传姓名
var _ajaxsure = false;
var sixDimensionalData = {
	init: function() {
		// 插件初始化回调
		if (typeof plugInitCallback == 'function') {
			plugInitCallback();
		}
		$('[name=referer]').val(referer);
		$('[name=query_url]').val(url);
		this.circleSetInterval();
		this.bindEvent();
		this.scrollTable3();
	},
	bindEvent: function() {
		var _this = this;
		$(window).scroll(function () {
			var scrolltop = $(window).scrollTop();
			if (scrolltop <= 460) {
				$(".bottom_b").css({
					"display": "none"
				});
			} else {
				$(".bottom_b").css({
					"display": "block"
				});
			}
		});
		//$(".btnBg,.btn_sz").click(function () {
		//    $(".tan_content").hide();
		//});
		
		$(".btn_sz").click(function () {
			$(".tan_content").hide();
		});
		
		$('.lingqu').click(function () {
			cNum = _this.isStockCodeName($.trim($("#tcode").html()))['code'];
			if(!cNum){
				getCodeInfo('3514');
			}
			$('.zhegai,.dialog4').show();
		});
		
		$('#btnBgcs2').click(function () {
			cNum = _this.isStockCodeName($.trim($("#gupiao2").val()))['code'];
			if (!cNum) {
				layer.msg('请输入正确的股票代码/名称');
				return false;
			} else {
				cNum = queryStock(cNum);
				getCodeInfo(cNum);
				setTimeout(function () {
					if ($('#SonContent0').is(":hidden")) {
						saveMobile();
					}
				}, 10);
			}
		});
		
		$('#btnBgcs3').click(function () {
			cNum = _this.isStockCodeName($.trim($("#gupiao22").val()))['code'];
			if (!cNum) {
				layer.msg('请输入正确的股票代码/名称');
				return false;
			} else {
				//$('#SonContent1,.zhegai,.dialog4').show();
				cNum = queryStock(cNum);
				getCodeInfo(cNum);
				setTimeout(function () {
					if ($('#SonContent0').is(":hidden")) {
						saveMobile();
					}
				}, 10);
			}
		});
		
		$(".hongbao").click(function () {
			$(".tc-bg").show();
		});
		$(".tc-bg .cloes").click(function () {
			$(".tc-bg").hide();
		});
		// 领取**评测结果按钮
		$('#zgSureBtn2').on('click', function () {
			var telNumber = $.trim($('input[name=zgMobile]').val());
			if (telNumber === '') {
				layer.msg('请输入的手机号码');
				return false;
			}
			if (!myreg.test(telNumber)) {
				layer.msg('请输入有效的手机号码');
				return false;
			}
			_this.ajaxfn(telNumber);
		});
		// 弹窗提交按钮
		$('#tcSureBtn').on('click', function () {
			var telNumber = $.trim($('input[name=tcMobile]').val());
			if (telNumber === '') {
				layer.msg('请输入的手机号码');
				return false;
			}
			if (!myreg.test(telNumber)) {
				layer.msg('请输入有效的手机号码');
				return false;
			}
			_this.ajaxfn(telNumber);
		});
		$('#btnBgcs').click(function () {
			cNum = _this.isStockCodeName($.trim($("#gupiao").val()))['code'];
			if (!cNum) {
				layer.msg('请输入正确的股票代码/名称');
				return false;
			} else {
				cNum = _this.queryStock(cNum);
				getCodeInfo(cNum);
				$("#instr").hide();
				setTimeout(function () {
					if ($('#SonContent0').is(":hidden")) {
						saveMobile();
					}
				}, 10);
			}
		});
		
		$('#btnBgcs4').click(function () {
			cNum = _this.isStockCodeName($.trim($("#gupiao").val()))['code'];
			if (!cNum) {
				layer.msg('请输入正确的股票代码/名称');
				return false;
			} else {
				//$('#SonContent1,.zhegai,.dialog4').show();
				cNum = _this.queryStock(cNum);
				getCodeInfo(cNum);
				$("#instr11").hide();
				setTimeout(function () {
					if ($('#SonContent0').is(":hidden")) {
						saveMobile();
					}
				}, 10);
			}
		});
		
		$('#btnBgcs5').click(function () {
			cNum = _this.isStockCodeName($.trim($("#gupiao").val()))['code'];
			if (!cNum) {
				layer.msg('请输入正确的股票代码/名称');
				return false;
			} else {
				//$('#SonContent1,.zhegai,.dialog4').show();
				cNum = _this.queryStock(cNum);
				getCodeInfo(cNum);
				$("#instr11").hide();
				setTimeout(function () {
					if ($('#SonContent0').is(":hidden")) {
						saveMobile();
					}
				}, 10);
			}
		});
		
		
		$("#gupiao").keyup(function (event) {
			$(".layui-layer-shade").hide();
		});
		$(document).on('click', '.gets', function() {
			$("#instr").hide();
			console.log($(this));
			var code = $(this).data('code');
			$("#gupiao").val(code);
			cNum = $.trim($("#gupiao").val());
			cNum = _this.queryStock(cNum);
			if (cNum == '' || !checkData(s, "c", cNum)) {
				layer.msg('请输入正确的股票代码');
				return false;
			} else {
				getCodeInfo(cNum);
			}
		});
		$(document).on('click', '.gets11', function() {
			$("#instr11").hide();
			console.log($(this));
			var code = $(this).data('code');
			$("#gupiao").val(code);
			cNum = $.trim($("#gupiao").val());
			cNum = _this.queryStock(cNum);
			if (cNum == '' || !checkData(s, "c", cNum)) {
				layer.msg('请输入正确的股票代码');
				return false;
			} else {
				getCodeInfo(cNum);
			}
		});
		$(document).on('click', '.gets2', function() {
			$("#instr2").hide();
			var code = $(this).data('code');
			$("#gupiao2").val(code);
			cNum = $.trim($("#gupiao2").val());
			cNum = queryStock(cNum);
			console.log(cNum)
			if (cNum == '' || !checkData(s, "c", cNum)) {
				layer.msg('请输入正确的股票代码');
				return false;
			} else {
				getCodeInfo(cNum);
			}
		});
		$(document).on('click', '.gets22', function() {
			$("#instr22").hide();
			var code = $(this).data('code');
			$("#gupiao22").val(code);
			cNum = $.trim($("#gupiao22").val());
			cNum = queryStock(cNum);
			console.log(cNum)
			if (cNum == '' || !checkData(s, "c", cNum)) {
				layer.msg('请输入正确的股票代码');
				return false;
			} else {
				getCodeInfo(cNum);
			}
		});
		$('input[name="stockcode1"]').on('input', function() {
			_this.change();
		});
		$('input[name="stockcode11"]').on('input', function() {
			_this.change11();
		});
		$('input[name="stockcode2"]').on('input', function() {
			_this.change2();
		});
		$('input[name="stockcode22"]').on('input', function() {
			_this.change22();
		});
		
	},
	circleSetInterval: function() {
		var pe = Math.floor(Math.random() * 5 + 1);
		setInterval(function () {
			var pe = Math.floor(Math.random() * 70 + 30);
			$('.lvtt i code').text(pe)
		}, 2000);
	},
	//诊股个股滚动
	scrollTable3: function() {
		var i = 1;
		var len = $('.alone_list li').length;
		$('.alone_list').append($('.alone_list li').clone());
		var _table = $('.alone_list').eq(0);
		setInterval(function () {
			_table.css('marginTop', -71 * i);
			i++;
			if (i == len + 1) {
				setTimeout(function () {
					_table.css('transition', 'none');
					_table.css('marginTop', 2);
					i = 1;
					setTimeout(function () {
						_table.css('transition', 'all .6s')
					}, 700);
				}, 1000)
			}
		}, 2500);
	},
	ajaxfn: function(phone) {
		 if (_ajaxsure) {
			return false;
		}
		_ajaxsure = true;
		// 提交前回调
		if (typeof plugBeforeSaveCallback == 'function') {
			plugBeforeSaveCallback();
		}
		$.ajax({
			url: '/addNewUserData',					
			data: {
				tel: phone,           
				gid: $("input[name='gid']").val(),
				aid: $("input[name='aid']").val(),
				pid: $("input[name='pid']").val(),	
				channelid: $("input[name='channelid']").val(),	       
				stock:$('input[name=stock]').val(),	
				referer:referer,					   
				laiyuan:window.location.href,
			},
			type: 'post',
			success: function (res) {
				if (res.code != 0) {
					alert(res.msg);
					return;
				}

				$('.tan_div,.zhegai,.dialog4').hide();
				if (res.msg==1){
					window._agl && window._agl.push(['track', ['success', {t: 3}]])                                
				}							

				if (typeof plugAfterSaveCallback == 'function') {
					plugAfterSaveCallback();

					if (window.newgzglink) {
						alert('提交成功，请静候客服的回电~.~！');
					   //window.location.href = '//' + document.domain + '/gzgdown/index.html';
					}
				} else {
					alert('提交成功，请静候客服的回电~.~！');
				}
			},
			error: function (res) {
				alert('网络出错，请重新提交！');
			},
			complete: function () {
				_ajaxsure = false;
			}
		})
	},
	// 判断股票代码/名称是否正确
	isStockCodeName: function(val) {
		// 查找对应的股票代码/名称
		var codeName = {};
		var stock = $.trim(val);

		// 不能为空
		if (stock != '') {
			$.each(s, function (i, item) {
				if (item['c'] == stock || item['n'] == stock) {
					codeName = {
						code: item['c'],
						name: item['n']
					}
					return false;
				}
			});
		}
		return codeName;
	},
	queryStock: function(queryStock) {
		var isCatch = false;
		if (queryStock) {
			if (!/^\w{6}$/.test(queryStock)) {
				for (var i = 0, len = s.length; i < len; i++) {
					var item = s[i];
					if (item.n === queryStock || item.c === queryStock) {
						isCatch = true;
						queryStock = item.c;
						break;
					}
				}
			} else {
				isCatch = true;
			}
			if (isCatch) {
				return queryStock;
			} else {
				return '502';
			}
		} else {
			return '502';
		}
	},
	change: function() {
		$("#instr").show();
		var code = $("#gupiao").val();
		if (code != "") {
			// var str = parseInt(code);
			var str = code;
			var arr = 6;
			var list = new Array(6);
			var pnum = 0;
			if (str.length<=4) {
				code=code.toUpperCase();
				s.forEach(function (i) {
					var daima = i.c.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
							pnum++;
						} else {
							return false;
						}
					}
				});
			}
			if(str.length>4 || pnum<6){
				// code = $("#gupiao").val();
				s.forEach(function (i) {
					var daima = i.n.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
						} else {
							return false;
						}
					}
				});
			}
			$("#codelist").html("");
			list.forEach(function (z) {
				console.log(pnum);
				if (pnum>0) {
					$("#codelist").append("<tr id='" + z.c + "' data-code='" + z.c + "' class='gets' style='cursor:pointer;text-align:center;'><td ><span style='color: red;'>" +
						code + "</span>" + z.c.substring(code.length) + "</td><td>" + z.n + "</td></tr>"
						);
				} else {
					$("#codelist").append("<tr id='" + z.c + "' data-code='" + z.n + "' class='gets' style='cursor:pointer;text-align:center;'><td >" + z
						.c + "</td><td><span style='color: red;'>" + code + "</span>" + z.n.substring(
							code.length) + "</td></tr>");
				}
				pnum--;
			})
		} else {
			$("#instr").hide();
		}
	},
	
	change11: function() {
		$("#instr11").show();
		var code = $("#gupiao11").val();
		if (code != "") {
			// var str = parseInt(code);
			var str = code;
			var arr = 6;
			var list = new Array(6);
			var pnum = 0;
			if (str.length<=4) {
				code=code.toUpperCase();
				s.forEach(function (i) {
					var daima = i.c.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
							pnum++;
						} else {
							return false;
						}
					}
				});
			}
			if(str.length>4 || pnum<6){
				// code = $("#gupiao11").val();
				s.forEach(function (i) {
					var daima = i.n.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
						} else {
							return false;
						}
					}
				});
			}
			$("#codelist11").html("");
			list.forEach(function (z) {
				console.log(pnum);
				if (pnum>0) {
					$("#codelist11").append("<tr id='" + z.c + "' data-code='" + z.c + "' class='gets11' style='cursor:pointer;text-align:center;'><td ><span style='color: red;'>" +
						code + "</span>" + z.c.substring(code.length) + "</td><td>" + z.n + "</td></tr>"
						);
				} else {
					$("#codelist11").append("<tr id='" + z.c + "' data-code='" + z.n + "' class='gets11' style='cursor:pointer;text-align:center;'><td >" + z
						.c + "</td><td><span style='color: red;'>" + code + "</span>" + z.n.substring(
							code.length) + "</td></tr>");
				}
				pnum--;
			})
		} else {
			$("#instr11").hide();
		}
	},
	change2: function() {
		$("#instr2").show();
		var code = $("#gupiao2").val();
		if (code != "") {
			// var str = parseInt(code);
			var str = code;
			var arr = 6;
			var list = new Array(6);
			var pnum = 0;
			if (str.length<=4) {
				code=code.toUpperCase();
				s.forEach(function (i) {
					var daima = i.c.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
							pnum++;
						} else {
							return false;
						}
					}
				});
			}
			if(str.length>4 || pnum<6){
				// code = $("#gupiao2").val();
				s.forEach(function (i) {
					var daima = i.n.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
						} else {
							return false;
						}
					}
				});
			}
			$("#codelist2").html("");
			list.forEach(function (z) {
				console.log(pnum);
				if (pnum>0) {
					$("#codelist2").append("<tr id='" + z.c + "' data-code='" + z.c + "' class='gets2' style='cursor:pointer;text-align:center;'><td ><span style='color: red;'>" +
						code + "</span>" + z.c.substring(code.length) + "</td><td>" + z.n + "</td></tr>"
						);
				} else {
					$("#codelist2").append("<tr id='" + z.c + "' data-code='" + z.n + "' class='gets2' style='cursor:pointer;text-align:center;'><td >" + z
						.c + "</td><td><span style='color: red;'>" + code + "</span>" + z.n.substring(
							code.length) + "</td></tr>");
				}
				pnum--;
			})
		} else {
			$("#instr2").hide();
		}
	},
	change22: function() {
		$("#instr22").show();
		var code = $("#gupiao22").val();
		if (code != "") {
			// var str = parseInt(code);
			var str = code;
			var arr = 6;
			var list = new Array(6);
			var pnum = 0;
			if (str.length<=4) {
				code=code.toUpperCase();
				s.forEach(function (i) {
					var daima = i.c.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
							pnum++;
						} else {
							return false;
						}
					}
				});
			}
			if(str.length>4 || pnum<6){
				// code = $("#gupiao22").val();
				s.forEach(function (i) {
					var daima = i.n.indexOf(code);
					if (daima == 0) {
						if (arr-- != 0) {
							list[arr] = i;
						} else {
							return false;
						}
					}
				});
			}
			$("#codelist22").html("");
			list.forEach(function (z) {
				console.log(pnum);
				if (pnum>0) {
					$("#codelist22").append("<tr id='" + z.c + "' data-code='" + z.c + "' class='gets22' style='cursor:pointer;text-align:center;'><td ><span style='color: red;'>" +
						code + "</span>" + z.c.substring(code.length) + "</td><td>" + z.n + "</td></tr>"
						);
				} else {
					$("#codelist22").append("<tr id='" + z.c + "' data-code='" + z.n + "' class='gets22' style='cursor:pointer;text-align:center;'><td >" + z
						.c + "</td><td><span style='color: red;'>" + code + "</span>" + z.n.substring(
							code.length) + "</td></tr>");
				}
				pnum--;
			})
		} else {
			$("#instr22").hide();
		}
	}
}
sixDimensionalData.init();

function checkData(data, pro, code) {
	var reg = new RegExp("^\w{6}$");
	var flag = false;
	for (var i = 0; i < data.length; i++) {
		var temp = data[i];
		if (temp[pro] == code) {
		flag = true;
		break;
		}
	}
	return flag;
};