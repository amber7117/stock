/**
 * 2014 사이버이메지네이션
 *
 * webponent press 코어라이브러리
 *
 * 페이지를 구동시키기 위한 라이브러리
 *
 * @author 오상원 (ohsangwon@cyber-i.com)
 * @author 정태승 (jungts@cyber-i.com)
 *
 */


(function ($) {
	"use strict";

	var self = {};

	if (!window.webponent){
		window.webponent = {};
	}

	if (!window.webponent.press) {
		window.webponent.press = {};
	}

	if (!window.webponent.press.event) {
		window.webponent.press.event = $({});
	}

	/**
	 * 프레스 버전정보.
	 * Version up 될 때마다 변경해야 한다!
	 * @type {string}
	 */
	webponent.press.version = '1.0.0';

	webponent.press.buildVersion = '1.0.0';

	var badBrowser = false;
	if(navigator.appName.indexOf("Internet Explorer") !== -1){

		badBrowser=(
			navigator.appVersion.indexOf("MSIE 9") === -1 &&
			navigator.appVersion.indexOf("MSIE 1") === -1
		);
	}

	// phantomJS여부 PDF 용으로 runtime.js를 불러왔을때 true 로 변경함.
	var isPhantom = false;
	if(navigator.userAgent.indexOf("PhantomJS") !== -1) {
		isPhantom = true;
	}

	var	PRESS_HOME = '/WEB-APP/webponent-press1.0';

	var pageMarkup = null;
	var pageSetting = null;
	var pageScript = null;

	var dataEventList = {};

	/**
	 * 페이지나 표에서 사용하는 데이터 맵
	 * 데이터를 수납하고 있다.
	 *
	 * @type {Object}
	 * @example
	 * {
	 *   page:https://dl.dropboxusercontent.com/u/361521190/data/amount-map.json : Array[20],
	 *   form:https://dl.dropboxusercontent.com/u/361521190/data/amount-map.json : Object
	 * }
	 */
	var registeredData = {};

	var FORM_SUBMIT_EVENT_NAME = 'formSubmit';

	//var ORIGINAL_MARKUP = 'original-markup';

	self.FORMSUBMIT = FORM_SUBMIT_EVENT_NAME;

	//var forms = {};

	/**
	 * 런타임상에서 사용하는 변수 매핑
	 * @type {Object}
	 */
	var variables = {};

	variables.$today = function () {

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1;

		var yyyy = today.getFullYear() + '';

		if (dd < 10) {

			dd = '0' + dd;
		}

		if (mm < 10) {

			mm = '0' + mm;
		}

		var todayString = yyyy + mm + dd;

		return todayString;
	};

	/**
	 * 런타임 상에서 사용되는 유틸 함수
	 * @type {Object}
	 */
	var functions = {};

	functions.renderPrice = {

		name : '현재가 렌더링',

		parameters : ['현재가', '등락율'],

		run : function (price, rate) {

			var floatedRate = parseFloat(rate);

			var span = $('<span class="press-updown-icon-container">');
			var icon = $('<img class="press-updown-icon">');

			if (floatedRate > 0) {

				span.addClass('press-up-color');
				icon.attr('src', PRESS_HOME + '/img/runtime/icon_up.png');

			} else if (floatedRate < 0) {

				span.addClass('press-down-color');
				icon.attr('src', PRESS_HOME + '/img/runtime/icon_down.png');
			}

			span.text(price);
			span.prepend(icon);

			return span;
		}
	};

	functions.renderRate = {

		name : '등락율 렌더링',

		parameters : ['등락율'],

		run : function (rate) {

			var floatedRate = parseFloat(rate);

			var span = $('<span class="press-updown-icon-container">');

			if (floatedRate > 0) {

				span.addClass('press-up-color');

			} else if (floatedRate < 0) {

				span.addClass('press-down-color');
			}

			span.text(rate);

			return span;
		}
	};

	functions.renderDate = {

		name : '날짜형식 (YYYY/MM/DD)',

		parameters : ['날자'],

		run : function (date) {
			var year = date.substring(0, 4);
			var month = date.substring(4, 6);
			var day = date.substring(6, 8);

			return year + '/' + month + '/' + day;
		}
	};

	functions.closeLayerPopup = function (url) {

		var fileName = url.substring(url.lastIndexOf('/') + 1).split('.')[0];
		var $target = $('#layer_'+fileName);
		$target.removeClass('shadow_on on');

	};

	functions.openLayerPopup = function (url, title, size) {

		if(event) {
			event.preventDefault ? event.preventDefault() : (event.returnValue = false);
		}


		var fileName = url.substring(url.lastIndexOf('/') + 1).split('.')[0];
		fileName = fileName.replace(/\(/,'').replace(/\)/,'');
		var $target = $('#layer_'+fileName);

		if($target.size() == 0) {

			var $modalMarkup = '';

			$modalMarkup += '<div id="layer_' + fileName + '" class="layerPopup">';
			$modalMarkup += '<div class="lp_top_line"></div>';
			$modalMarkup += '<div class="layerPopup_wrap">';
			$modalMarkup += '<h1 class="lp_title">' + title + '</h1>';
			$modalMarkup += '<div class="lp_contents">';
			//$modalMarkup += body;
			$modalMarkup += '</div>';
			$modalMarkup += '<button class="lp_btnClose" type="button"></button>';
			$modalMarkup += '</div>';
			$modalMarkup += '</div>';

			$modalMarkup = $($modalMarkup);

			size && $modalMarkup.addClass(size);

			$modalMarkup.find('.lp_btnClose').on('click', function(){
				$modalMarkup.removeClass('shadow_on on');
			});

			$modalMarkup.addClass('on shadow_on').appendTo('.press-content:eq(0)');

			$.ajax({
				url : url,
				type : 'GET',
				dataType: 'text',
				success : function(resp) {
					resp = resp.replace(/(\r\n|\n|\r)/gm,"");

					var bodyPattern = /<body>(.*?)<\/body>/;
					var stylePattern = /<style>(.*?)<\/style>/;
					var matches = resp.match(bodyPattern);
					var body = matches[1];

					matches = resp.match(stylePattern);

					var style = matches && matches[1], $style = null;

					if (style) {
						$style = $('<style>' + style + '</style>');
						$style.attr('id', 'style-' + fileName);
					}


					body = body.replace('webponent.press.runtime.run();', 'webponent.press.runtime.run(false,{layer:true});');

					var $tempDiv = $('<div>' + body + '</div>');

					var libraryKeys = [];

					$tempDiv.find('.press-component-wrapper').each(function(){
						var $this = $(this);

						var markupWrapper = getMarkup($this);
						var settingObj = getMarkupSetting($this);

						var componentType = markupWrapper.attr('data-componentid')
							? markupWrapper.attr('data-componentid').split('-')[0]
							: settingObj.type;


						var libType = settingObj.settingName ? settingObj.settingName : settingObj.type;


						if (libType === 'videop') {
							libType = 'video';
						} else if ((libType === 'chart' || libType === 'visual' || componentType === 'chart' || componentType === 'visual')
							&& $.inArray('chart_common', libraryKeys) < 0) {

							libraryKeys.push('chart_common');
						}

						if ($.inArray(libType, libraryKeys) < 0) {
							libraryKeys.push(libType);
						}

					});



					var $currentHead = $('head');
					var $currentScripts = $currentHead.find('script');
					var $currentLinks = $currentHead.find('link');


					_.each(libraryKeys, function(libKey) {
						var needfulCss = self.libraries.css[libKey];
						var needfulJs = self.libraries.js[libKey];

						if (needfulCss) {

							_.each(needfulCss, function(e, i) {
								var $link = $(e);
								var href = $link.attr('href');
								var $matchLink = $currentLinks.filter('[href="' + href + '"]');
								if($matchLink.length == 0) {
									$currentHead.append($link);

								}
							});

						}

						if (needfulJs) {

							_.each(needfulJs, function(e, i) {
								var $script = $(e);
								var src = $script.attr('src');
								var $matchScript = $currentScripts.filter('[src="' + src + '"]');

								if($matchScript.length == 0) {
									$currentHead.append($script);
								}
							});
						}

					});

					if ($style && $('#style-' + fileName).length == 0) {
						$currentHead.append($style)
					}

					$modalMarkup.find('.lp_contents').html(body);

					$('#press-component-handler').hide();

				},
				error : function(error) {
					console.log(error);
				}
			});

			var getMarkup = function (wrapper) {
				//return wrapper.find(':first-child');
				var markup = wrapper.find('> [data-component-markup]');
				if (markup.length > 0) {
					return markup;
				} else {
					return wrapper.find('> :first-child');
				}
			};

			var getMarkupSetting = function (wrapper) {
				try {
					var settingScript = wrapper.find('> [data-component-setting]');

					var ret = $.parseJSON(settingScript.text());

					if(ret == null) {
						throw 'setting null';
					}

					return ret;
				} catch (e) {
					var nodeName = getMarkup(wrapper).find('> :first-child').get(0).nodeName.toLowerCase();
					if (nodeName.indexOf('h') != 0) { // h1,h2 etc
						nodeName = 'text';
					}
					return {
						"type": "text",
						"settingName": nodeName
					};
				}

			};


			return;
		}

		$target.find('.lp_title').text(title);
		$target.removeClass('lSize sSize').addClass(size);

		$target.addClass('on shadow_on');

		setTimeout(function(){
			$('#press-component-handler').hide();
		},100);

	};


	function getMarkup (wrapper) {
		//return wrapper.find(':first-child');
		var markup = wrapper.find('> [data-component-markup]');
		if(markup.length>0) {
			return markup;
		}else {
			wrapper.find('> :first-child').removeClass('cke_editable cke_editable_inline cke_contents_ltr cke_show_borders')
				.removeAttr('cke_instance title contenteditable');
			return wrapper.find('> :first-child');
		}
	}

	function getSetting(wrapper) {
		try {
			var settingScript = wrapper.children('[data-component-setting]');
			if(settingScript.length > 1){
				settingScript = settingScript.last();
			}

			var ret = $.parseJSON(settingScript.text());

			if(ret == null) {
				throw 'setting null';
			}

			return ret;

		}catch(e) {
			var nodeName = getMarkup(wrapper).find('> :first-child').prop('nodeName');

			if(nodeName) {
				nodeName = nodeName.toLowerCase();
			}else {
				nodeName = 'text';
			}

			if (nodeName.indexOf('h') != 0) {
				nodeName = 'text';
			}
			return {
				"type": "text",
				"settingName": nodeName
			};
		}

		/*try {
		 return $.parseJSON(scriptTxt);
		 }catch(e) {
		 scriptTxt = scriptTxt.replace(/(\r\n|\n|\r)/gm,"");
		 scriptTxt = scriptTxt.split("\\ \"").join("\\\"");
		 return $.parseJSON(scriptTxt);
		 }*/

	}

	function runComponent (componentWrapper, mode) {
		if (componentWrapper.find('.press-component-handler').length > 0) {

			return;
		}

		var markup = getMarkup(componentWrapper);
		var script = componentWrapper.children('[data-component-script]');
		var settingObj = getSetting(componentWrapper);

		if (mode) {

			var componentInfo = {};

			componentInfo.wrapper = componentWrapper;
			componentInfo.markup = markup;
			componentInfo.setting = settingObj;
			//componentInfo.handler = webponent.press.interaction.addComponentHander(componentWrapper);

			if (!_.isUndefined(markup.attr('data-need-reset-markup'))) {

				webponent.press.interaction.
				storeOriginalMarkup(markup, markup.children().clone(true));
			}

			webponent.press.interaction.bindComponentMouseEvent(componentInfo);

			// 인라인 에디터를 설정하기 위한 wrapper 가
			// 데이터 바인드가 갱신되기 이전의 마크업을 가지고 있어서
			// setTimeout 을 설정하여 데이터가 갱신되도록 설정
			//
			setTimeout(function() {
				webponent.press.interaction.addInlineEditor(markup, settingObj);
			}, 0);
		}
		if(settingObj.settingName === "bxSlider"){
			var options = {
				"pager" : settingObj.options.paging,
				"auto" : settingObj.options.auto,
				"autoControls" : settingObj.options.auto,
				"controls" : settingObj.options.button,
				"adaptiveHeight" : settingObj.options.adaptiveHeight
			};

			componentWrapper.find('.press-bxslider-wrap').children().show();
			componentWrapper.find('.press-bxslider-wrap').bxSlider(options);
		}

		if(settingObj.settingName === "tab"){
			var tabUse = settingObj.link.use;

			$(tabUse).each(function(i){
				var target = markup.find('ul.tab-selector > li > a').eq(i);
				if(tabUse[i]){
					target.attr('onClick','location.href=this.href')
				}
			});
		}

		if(settingObj.settingName === "accordion"){
			var $target = componentWrapper.find(' > [data-component-markup] > .press-accordion-wrapper:eq(0)');
			webponent.accordion.init($target);
		}

		if(settingObj.settingName === "resp_tab"){

			var theme = settingObj.theme || 'none';
			var $ul = markup.find('ul.resp-tab-list').eq(0);
			var $li =$ul.children('li');
			if($li.children('a').length == 0){
				$li.each(function(){
					var txt = $(this).text();
					$(this).text('');
					$(this).append('<a href="#" class="resp-tab-anchor">'+txt+'</a>');
				})
			}

			var $a = $li.children('a');
			var $mobileTitle = markup.find('>div>.resp-heading');

			/* eugene slider tab */
			$ul.removeAttr('class').addClass('resp-tab-list');
			$(this).removeAttr('style');
			if($ul.prev().hasClass('m-tab-left')){
				var cloneUl = $ul[0].outerHTML;
				$(this).prepend(cloneUl);
				$(this).children().eq(1).remove();

				$ul.css('z-index',5);
				$ul.parent().css('z-index',5);
			};

			if(webponent.mobileTab !== undefined){
				webponent.mobileTab.init(markup.find('.resp-tab-list'));
			}


			var $selectTab = markup.find('>div>ul>li.resp-tab-item, >div>.resp-heading');
			var $tabActive = $selectTab.filter('.tab-active');
			var $panel =markup.find('>div>.resp-tab-panel');

			$li.removeClass("tab-active")
				.filter(':first').addClass("tab-active");
			$mobileTitle.removeClass("tab-active")
				.filter(':first').addClass("tab-active");
			$panel.hide().eq(0).show();

			if(settingObj.mobileChk){
				markup.find('>.resp-tab-wrapper > h3').addClass('m-resp-heading');
				markup.find('>.resp-tab-wrapper > ul').addClass('m-resp-tab-list');
			}else{
				markup.find('>.resp-tab-wrapper > h3').removeClass('m-resp-heading');
				markup.find('>.resp-tab-wrapper > ul').removeClass('m-resp-tab-list');

			}
			if(theme == "none"){
				$selectTab.css(settingObj.style);
				$tabActive.css(settingObj.selected);
				$a.add($mobileTitle).css({
					'font-size':settingObj.style.fontSize,
					'font': settingObj.style.font,
					'color': settingObj.style.fontColor
				});

				$tabActive.find('a').add(markup.find('>div > h3.tab-active')).css({
					'font-size':settingObj.selected.fontSize,
					'font': settingObj.selected.font,
					'color': settingObj.selected.fontColor
				});
			}

			$selectTab.off('click').on('click', function (e) {
				e.preventDefault();

				var indexNum = $(this).index();

				if($ul.css('display') == 'none'){
					if($(this).hasClass('tab-active')){
						$(this).removeClass('tab-active');
						$panel.css("display","none").hide();
					}else{
						$(this).addClass('tab-active').siblings().removeClass("tab-active");
						indexNum = $(this).index() /2 - 0.5;
						$li.removeClass("tab-active").eq(indexNum).addClass('tab-active');
						$panel.css("display","none").eq(indexNum).show();

						var $goToHead = $(this).closest('.press-component-wrapper');
						$('html, body').animate({scrollTop : $goToHead[0].offsetTop}, 400);
					}
				}else{
					$(this).addClass('tab-active').siblings().removeClass("tab-active");
					$mobileTitle.removeClass("tab-active").eq( indexNum ).addClass('tab-active');
					indexNum = $(this).index();
					$panel.css("display","none").eq(indexNum).show();
				}

				var $selectPanel = $panel.eq(indexNum);

				/** check Chart component **/
				var checkChart = $selectPanel.find('[data-componentid]');
				if(checkChart !== undefined){
					checkChart.filter(function(){
						var $id = $(this).attr('data-componentid');
						if(
							$id.indexOf('chart') > -1 ||
							$id.indexOf('visual') > -1 ||
							$id.indexOf('grid') > -1
						){
							var $chart  =$selectPanel.find('[data-componentid = '+$id+']').closest('[data-component-wrapper]');
							var chartMarkup = getMarkup($chart);
							var chartSetting = getSetting($chart);
							webponent.press.component[chartSetting.settingName+"ComponentScript"](chartMarkup, chartSetting);
						}
					})
				}
				if(theme == "none"){
					$selectTab.css(settingObj.style);
					$selectTab.filter('.tab-active').css(settingObj.selected);
					$a.add($mobileTitle).css({
						'font-size':settingObj.style.fontSize,
						'font': settingObj.style.font,
						'color': settingObj.style.fontColor
					});
					$selectTab.filter('.tab-active').find('a').add($selectTab.filter('h3.tab-active')).css({
						'font-size':settingObj.selected.fontSize,
						'font': settingObj.selected.font,
						'color': settingObj.selected.fontColor
					});
				}
				if(webponent.mobileTab !== undefined){
					var wid = 0;
					$ul.find(' > li').each(function(i) {
						wid += $(this).outerWidth(true);
					});

					if(wid > window.innerWidth){
						$ul.css({'width': wid+1,'height': ''});
					}
				}
			});
		}

		if(settingObj.type === "button") {
			var $evt = settingObj.btnEvent;

			if($evt && $evt.use){
				markup.find('.press-button').off($evt.type).on($evt.type ,function(e){

					e.preventDefault();

					if(!$.isArray($evt.target)){
						$evt.target = [$evt.target];
						$evt.animation = [$evt.animation];
					};

					$($evt.target).each(function(i){
						var $target = $("div").filter("#" + $evt.target[i]);
						switch ($evt.animation[i]) {
							case 'toggle' :
								$target.toggle();
								break;
							case 'hide' :
								$target.hide();
								break;
							case 'show' :
								$target.show();
								break;
							default :
						}
					});
				});
			}
		}

		if(settingObj.type === "chart" || settingObj.type === "visual") {

			var wrapperName = settingObj.type === 'chart' ? '.component-chart-wrapper' : '.component-' + settingObj.themeKey + '-wrapper';

			var wrapper = $(wrapperName, markup);

			wrapper.off('drawCompleted').on('drawCompleted', function(e, element) {

				webponent.press.event.trigger('svg.complete');
			});
		}
		if(script.length) {
			var scriptFunction;

			if (!badBrowser) {
				scriptFunction = eval($.trim(script[0].innerHTML));

			} else {
				eval('var scriptFunction = ' + $.trim(script[0].innerHTML));
			}

			scriptFunction(markup, settingObj);
		} else {

			if(_.isFunction(webponent.press.component[settingObj.settingName + "ComponentScript"])) {

				webponent.press.component[settingObj.settingName + "ComponentScript"](markup, settingObj);

			}else {

				console.log(settingObj.settingName + ' component is not undefined');
			}
		}
	}

	/**
	 * 페이지 스크립트를 실행시킨다.
	 * @param  {Boolean} mode 프레스에서 실행시킬때 true, 퍼블리싱됬을때는 false
	 */
	function runPage (mode, obj) {
		//TODO: webponent.press.component.js, webponent.press.table.js 버전에 따라 재할당
		//TODO:  만약 버전이 안 맞을 시 경고 및 이전 버전 검색.
		/*if (!mode) {

		 }*/

		var config = {
			layer : false
		};

		$.extend(config, obj);

		var page = $('[data-page]');

		//배포할때 data-component-wrapper 속성을 날려서 class로 변경
		//var componentWrappers = page.find('[data-component-wrapper]');
		var componentWrappers = page.find('.press-component-wrapper');
		var pageSettingMarkup = $('[data-page-setting]');

		try {
			var pageSettingObj = $.parseJSON($.trim(pageSettingMarkup[0].innerHTML).replace(/(\r\n|\n|\r)/gm,""));
		}catch (E) {
			console.log(E);
			return;
		}

		if(!config.layer) {
			//레이어 팝업으로 실행될때는 pageSetting를 변경하지 않는다.
			pageSetting = pageSettingObj;
		}

		var repeaterflag = true;

		_.each(pageSettingObj.data, function (value, key) {

			if(value.bindType === 'server') {
				return;
			}

			var ajaxOption = {};

			if (value.serialize) {

				ajaxOption.data = value.serialize;
			}

			webponent.press.runtime.getData(value, function (data, id) {

				var repeatInfo = {
					'value' : value, 'data' : data, 'isRepeat' : true
				};

				if(repeaterflag) {

					webponent.press.component.repeatorComponentScript(null, null, repeatInfo);
				}

				var $target = $('[data-id="' + id + '"]');

				$target.each(function(){

					var key = $(this).attr('data-key');
					var value = '';

					try{
						if(key) {
							if( key.indexOf('[') == 0) {
								value = eval('data' + key);
							}else {
								value = eval('data.' + key);
							}
							$(this).html(value);
						}
					}catch(e){
						if(e.message.indexOf('undefined') > -1){
							$(this).text('');
						}
					}
				})
			}, ajaxOption);
		});
		repeaterflag = false;

		componentWrappers.each(function () {

			var componentWrapper = $(this);
			runComponent(componentWrapper, mode);
		});

		if (mode) {

			webponent.press.event.trigger('editor.componentAppended');

		}
		/* runComponent 에서 pageSetting을 못 받아와서 순서 변경 E */

		var pageScript
		if (!badBrowser) {
			pageScript = eval($.trim($('[data-page-script]')[0].innerHTML));
		} else {
			pageScript = eval('pageScript =' + $.trim($('[data-page-script]')[0].innerHTML));
		}

		pageScript(page, pageSettingObj);

		pageMarkup = page;
		pageScript = pageScript;

		if(isPhantom) {
			/* svg 갯수 파악 S */
			// PDF에서 사용하는 event trigger
			var svgCount = 0;

			componentWrappers.each(function () {

				var componentWrapper = $(this);

				var settingObj = getSetting(componentWrapper);
				if(settingObj.type === "chart" || settingObj.type === "visual") {
					svgCount ++;
				}
			});

			if(svgCount > 0) {

				webponent.press.event.off('svg.complete').on('svg.complete', function () {

					svgCount --;

					if(svgCount <= 0) {

						// webponent.press.event.trigger('svg.success');

						var event = new Event('svg.success');

						//console.log("트리거");
						document.dispatchEvent(event);
					}
				});

			} else {
				//console.log("트리거");
				var event = new Event('svg.success');

				document.dispatchEvent(event);
			}
		}

		if (mode) {
			webponent.press.common.setContentLayoutStyle();
			webponent.press.interaction.openPageSettingPanel();
		}
	}

	function getOriginalHTML () {

		var clonedPage = $('.press-preview').clone(true);

		return $.trim(clonedPage.html());
	}

	/**
	 * 문서의 HTML 마크업을 복사한다.
	 * @param deploy
	 * @returns {*}
	 */
	function getHTML (deploy) {
		var clonedPage = $('.press-preview').clone(true);
		var contentsElem = clonedPage.find('.press-content').length ? clonedPage.find('.press-content') : clonedPage;

		contentsElem.removeClass('press-data-bind-handler-view');
		clonedPage.find('[data-page]').removeClass('ui-sortable');

		clonedPage.find('.press-page-ruler-scroll-area').remove();

		clonedPage.find('.press-component-wrapper').each(function () {
			var markup = $(this);
			var setting = getSetting(markup);

			webponent.press.interaction.cleanComponentMarkup(markup);

			if (setting.type === 'table') {
				webponent.press.table.revertTableType(markup, true);
			}
		});

		clonedPage.find('[data-component-setting]').each(function() {
			// 필요없는 setting 요소 삭제
			var $this = $(this);
			var settingObj = $.parseJSON($this.html().replace(/(\r\n|\n|\r)/gm,"").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&'));

			delete settingObj.cache;

			$this.text(JSON.stringify(settingObj));
		});


		var contentStyle = {
			'width': pageSetting.desktop.width,
			'padding-top': pageSetting.desktop.padding.top,
			'padding-bottom': pageSetting.desktop.padding.bottom,
			'padding-right': pageSetting.desktop.padding.right,
			'padding-left': pageSetting.desktop.padding.left
			/*'transform': '',
			 'transform-origin': '',
			 'margin': '',
			 'zoom': ''*/
		}

		if (pageSetting.desktop.responsive) {
			contentStyle.width = '100%';
			contentStyle['max-width'] = pageSetting.desktop.width;
		}

		contentsElem.css(contentStyle);

		if (deploy) {
			contentsElem.addClass('deployed');
		}

		clonedPage.find('.ui-sortable').removeClass('ui-sortable');

		var result = $.trim(clonedPage.html());

		//&#8203; 문자제거 [ckeditor 에서 붙여주는거 같음]
		result = result.replace(/\u200B/g,'');

		return result;
	}

	/*function registerData (dataInfo, data, query) {

	 var key = dataInfo.uniqueId;

	 registeredData[key] = data;
	 }*/

	function filterDataByKey (data, key) {

		//var filteredData = null;

		if (!key) {

			return data;

		} else if (key.indexOf('[') === 0) {

			return eval('data' + key);

		} else {

			return eval('data.' + key);
		}
	}

	function loadData(dataInfo, callback, ajaxOption) {
		function registerWhenDataIsDirect(dataInfo, elseFun) {
			if (dataInfo.imported === 'direct') {
				var resp = dataInfo.directInputData;

				if (_.isString(dataInfo.directInputData)) {
					resp = $.parseJSON(dataInfo.directInputData);
				}

				registeredData[dataInfo.uniqueId] = resp;

				callback(filterDataByKey(resp, dataInfo.key));
				return;
			}

			if (elseFun) {
				elseFun();
			}
		}

		if (!ajaxOption) {
			ajaxOption = {};
		}

		if (dataInfo.data) {
			ajaxOption.data = [];
			_.each(dataInfo.data, function(item, index, list) {
				var name = item.name;
				var value = item.value;

				if (value.indexOf('$') === 0) {

					var variable = webponent.press.runtime.variables[value];

					if (variable) {

						var variableType = typeof variable;

						if (variableType === 'function') {

							value = variable();

						} else if (variableType === 'string' || variableType === 'number') {

							value = variable;
						}
					}
				}

				var obj = item.serialize;

				if (!_.has(obj, 'data')) {

					obj.data = {};
				}

				ajaxOption.data.push($.extend({
					name: name,
					value: value
				}));
			});
		}

		if (!_.isArray(ajaxOption.data)) {
			if (!_.has(ajaxOption, 'data')) {
				ajaxOption.data = {};
			}
		}

		var data = registeredData[dataInfo.uniqueId];

		if (!data || dataInfo.isSearch) {

			var url = dataInfo['url'];
			var results = /\$\{([^}]*)\}/.exec(url);
			if(results != null){
				url = url.replace(results[0],window.webponent.press.dataApi[results[1]]);
			}

			registerWhenDataIsDirect(dataInfo, function() {
				// 처음으로 데이터 로드
				registeredData[dataInfo.uniqueId] = $.ajax(_.extend(ajaxOption, {
					url: url,
					success: function(resp) {

						if(typeof resp === 'string'){
							resp = eval('('+resp+')');
						}

						registeredData[dataInfo.uniqueId] = resp;

						callback(filterDataByKey(resp, dataInfo.key), dataInfo.uniqueId);
					},
					error : function(error) {
						console.log(error);
					}
				}));
			});

		} else if (data && data.hasOwnProperty('readyState')) {
			// 현재 데이터를 로드중 이므로 기다림
			data.done(function(resp) {
				if(typeof resp === 'string'){
					resp = eval('('+resp+')');
				}
			});

		} else {
			registerWhenDataIsDirect(dataInfo, function() {
				// 캐시된 데이터를 사용함
				callback(filterDataByKey(data, dataInfo.key));
			});
		}
	}

	/**
	 * 페이지 스크립트를 실행시켜준다.
	 * @param  {Boolean} mode true일경우 에디터 모드로 실행되고
	 *                        false일 경우 deploy 모드로 실행된다.
	 */
	self.run = function (mode) {
		runPage(mode);
	};

	/**
	 * [컴퍼넌트를 실행시킨다]
	 * @param  {[node]} componentWrappers [컴퍼넌트 래퍼]
	 * @param  {[string]} mode              [edit 모드 구분파라미터]
	 */
	self.runComponent = function (componentWrappers, mode) {

		runComponent(componentWrappers, mode);
	};

	/**
	 * [페이지의 마크업 정보를 가져온다]
	 */
	self.getPageMarkup = function () {

		return pageMarkup;
	};

	/**
	 * [페이지의 세팅 값을 가져온다]
	 * @return {[object]} [페이지 세팅]
	 */
	self.getPageSetting = function () {

		return pageSetting;
	};

	/**
	 * [페이지의 스크립트를 가져온다]
	 */
	self.getPageScript = function () {

		return pageScript;
	};

	/**
	 * [페이지 html 을 가져온다]
	 * @param deploy   편집이 아닌 배포되는 문서인경우 true(default: true)
	 * @returns {*}
	 */
	self.getHTML = function (deploy) {

		if (deploy === undefined) {
			deploy = true;
		}
		var html = getHTML(deploy);

		return html;
	};

	self.getOriginalHTML = function () {
		var html = getOriginalHTML();

		return html;
	};

	/**
	 * [페이지에 불러와 저장된 데이터를 가져온다]
	 */
	self.getResiteredData = function (type, url) {

		return registeredData;
	};

	/**
	 * 페이지나 폼에 로드된 데이터는 새로 통신을 하지 않고 캐시된 데이터를
	 * 사용하게 한다.
	 * press에서는 이 메서드를 이용한 데이터 통신을 추천한다.
	 * @param  {[type]}   dataInfo   [description]
	 * @param  {Function} callback   [description]
	 * @param  {[type]}   ajaxOption [description]
	 * @return {[type]}              [description]
	 */
	self.getData = function (dataInfo, callback, ajaxOption) {

		loadData(dataInfo, callback, ajaxOption);
	};

	/**
	 * [컴퍼넌트에서 사용하는 데이터를 가져온다]
	 * @param  {[object]}   componentDataInfo [컴퍼넌트 데이터 정보]
	 * @param  {Function} callback          [callback]
	 * @param  {[object]}   ajaxOption        [ajax option]
	 * @param  {[string]}   componentId       [컴퍼넌트 아이디]
	 */
	self.getComponentData = function (componentDataInfo, callback, ajaxOption, componentId) {

		var eventName = self.FORMSUBMIT + '.' + componentDataInfo.uniqueId;

		if (componentId) {

			eventName = self.FORMSUBMIT + '.' + componentDataInfo.uniqueId + '.' + componentId;
		}

		webponent.press.runtime.getData(componentDataInfo, function (data) {

			callback(data, eventName);

		}, ajaxOption);

		if (!ajaxOption) {

			ajaxOption = {};
		}

		self.setComponentDataEventList(componentId, componentDataInfo.uniqueId);

		webponent.press.event.off(eventName).on(eventName, function (e, data) {

			componentDataInfo.isSearch = false;

			webponent.press.runtime.getData(componentDataInfo, function (data) {

				callback(data, eventName);

			}, ajaxOption);
		});
	};

	/**
	 * 컴퍼넌트에 바인드 된 데이터 이벤트를 제거한다.
	 * @param  {[srting]} dataId [data unique id]
	 */
	self.unBindDataEvent = function (dataId) {

		var selectedComponent = webponent.press.interaction.getSelectedComponent();
		var componentWrapper = selectedComponent.wrapper;
		var dataComponentMarkup = componentWrapper.find('> [data-component-markup]');
		var componentId = dataComponentMarkup.attr('data-componentId');

		componentWrapper.removeAttr('data-id');
		componentWrapper.removeAttr('data-key');
		componentWrapper.removeClass('press-data-bind-handler');

		var dataBindHandler = componentWrapper.find('.press-data-bind-handler[data-id="' + dataId + '"]');

		dataBindHandler.removeAttr('data-id');
		dataBindHandler.removeAttr('data-key');
		dataBindHandler.removeAttr('contenteditable');
		dataBindHandler.removeClass('press-data-bind-handler');
		dataBindHandler.removeClass('press-data-bind-handler-selected');

		var eventName = self.FORMSUBMIT + '.' + dataId + '.' + componentId;

		webponent.press.event.off(eventName);

		delete dataEventList[componentId];
	}

	/**
	 * [컴퍼넌트에 바인드 된 이벤트의 목록을 설정한다]
	 * @param  {[srting]} componentId [component unique id]
	 * @param  {[srting]} dataId [data unique id]
	 */
	self.setComponentDataEventList = function (componentId, dataId) {

		if (!componentId) {

			return;
		}

		var componentType = componentId.split('-')[0];

		if (!dataEventList[componentId]) {

			dataEventList[componentId] = [];
		}

		// 텍스트, 이미지, 비디오 컴퍼넌트의 경우 바인드된 데이터의 갯수가 반드시 1개여야 하므로
		// 이전에 바인드된 데이터를 제거한다.
		if (componentType !== 'text' && componentType !== 'image' && componentType !== 'video' && componentType !== 'table') {
			for (var i = 0; i < dataEventList[componentId].length; i++) {
				var eventName = self.FORMSUBMIT + '.' + dataEventList[componentId][i] + '.' + componentId;
				webponent.press.event.off(eventName);
			}

			dataEventList[componentId] = [];
		} /*else {
		 console.log('');
		 }*/

		if (dataEventList[componentId].indexOf(dataId) === -1) {

			dataEventList[componentId].push(dataId);
		}
	};

	/**
	 * [컴퍼넌트에 바인드 된 이벤트 목록을 가져온다]
	 * @param  {[srting]} componentId [component unique id]
	 */
	self.getComponentDataEventList = function (componentId) {

		var list = dataEventList;

		if (componentId) {

			list = dataEventList[componentId];
		}

		return list;
	};

	/**
	 * [복사시 컴포넌트의 불필요한 부분을 제거한다]
	 * @param  {[node]} 제거할 컴포넌트
	 */
	self.cleanComponentMarkup = function (node) {

		function removeInlineEditor (componentWrapper) {

			var wrapper = webponent.press.runtime.getMarkup(componentWrapper);
			wrapper.removeAttr('cke_instance');

			if (wrapper.length > 0) {

				//var settingScript = componentWrapper.find('> [data-component-setting]');
				//var setting = $.parseJSON(settingScript.text());
				var inlineWrapper = wrapper.find('.cke_editable');

				inlineWrapper.removeAttr('contenteditable')
					.removeAttr('tabindex')
					.removeAttr('spellcheck')
					.removeAttr('role')
					.removeAttr('aria-label')
					.removeAttr('title')
					.removeAttr('aria-describedby')
					.removeClass('cke_editable cke_editable_inline cke_contents_ltr cke_show_borders');
			}
		}
		function removeDraggableEvent (wrapper) {

			if (wrapper.hasClass('ui-sortable')) {

				wrapper.removeClass('ui-sortable');
				wrapper.removeData('uiDraggable');
			}

			if (wrapper.hasClass('ui-draggable')) {

				wrapper.removeClass('ui-draggable');
				wrapper.removeData('uiSortable');
			}

			var draggableWrappers = wrapper.find('.press-component-wrapper.ui-draggable');

			$.each(draggableWrappers, function (idx, value) {

				$(value).removeClass('ui-draggable');
				$(value).removeData('uiDraggable');
			});


			var sortableWrappers = wrapper.find('.ui-sortable');


			$.each(sortableWrappers, function (idx, value) {

				$(value).removeClass('ui-sortable');
				$(value).removeData('uiSortable');
			});
		}

		node.removeClass('press-component-wrapper-selected press-component-wrapper-hovered');
		node.find('.press-component-handler').remove();
		//componentWrapper.find('.press-page-ruler-scroll-area').remove();
		node.find('.cke_widget_drag_handler_container').remove();
		node.find('.press-data-bind-handler-selected').removeClass('press-data-bind-handler-selected');

		removeInlineEditor(node);

		removeDraggableEvent(node);

		/**
		 * 아래 소스 삭제하면
		 * Chart에서 컴퍼넌트 편집을 누르면 퍼블리셔에서
		 * SVG 자체를 복사해하여 넘김.
		 * 추가적용 (2016.01.21 평다진)
		 * 왜 뺏지????
		 */
		node.children('[data-need-reset-markup]').each(function () {

			var markup = $(this);

			if (markup.data('original-markup')) {

				markup.children().remove();

				var originalMarkup = markup.data('original-markup').clone(true);

				if (originalMarkup) {

					markup.append(originalMarkup);
				}
			}
		});
	};

	/**
	 * [복사시 컴포넌트의 html을 반환]
	 * @param  {[node]} 컴포넌트
	 */
	self.getMarkup = function (component) {

		var markup = component.find('> [data-component-markup]');
		if(markup.length>0) {
			return markup;
		}else {
			return component.find('> :first-child');
		}
	};

	self.editing  = function () {

		if (webponent.press.interaction) {

			return true;
		} else {

			return false;
		}
	};

	$.fn.serializeObject = function() {

		var o = Object.create(null),

			elementMapper = function(element) {

				element.name = $.camelCase(element.name);

				return element;
			},

			appendToResult = function(i, element) {

				var node = o[element.name];

				if ('undefined' !== typeof node && node !== null) {

					o[element.name] = node.push ? node.push(element.value) : [node, element.value];

				} else {

					o[element.name] = element.value;
				}
			};

		$.each($.map(this.serializeArray(), elementMapper), appendToResult);

		return o;
	};

	webponent.press.variables = variables;
	webponent.press.functions = functions;

	self.variables = variables;
	self.functions = functions;

	self.PRESS_HOME = PRESS_HOME;

	self.libraries = {
		css: {
			common: [
				'<link rel="stylesheet" href="/webponent-press/external/resetcss/reset.css"/>',
				'<link rel="stylesheet" href="/webponent-press/external/jquery/jquery-ui.css"/>',
				'<link rel="stylesheet" href="/webponent-press/css/webponent.press.css"/>',
				'<link rel="stylesheet" href="/webponent-press/css/webponent.press.theme.css"/>',
				'<link rel="stylesheet" href="/webponent-press/external/font-awesome/css/font-awesome.min.css"/>',
				' <!--[if lt IE 9]> <script src="/webponent-press/js/html5shiv.js">' +
				'</script><script src="/webponent-press/js/respond.min.js"></script> ' +
				'<script src="/webponent-press/js/excanvas.min.js"></script><![endif]-->'

				/*'<link rel="stylesheet" href="/WEB-APP/webponent-press1.0/css/webponent.press.template.css"/>',*/
				/*'<link rel="stylesheet" href="/WEB-APP/webponent-press1.0/css/webponent.press.runtime.css"/>',*/
			],
			bxSlider: [
				'<link rel="stylesheet" href="/webponent-press/external/bxSlider/jquery.bxslider.css"/>'
			],
			tab: [
				'<link rel="stylesheet" href="/webponent-press/external/webponent-tab/webponent.tab.css"/>'
			],
			accordion: [
				'<link rel="stylesheet" href="/webponent-press/external/webponent-accordion/webponent.accordion.css"/>'
			],
			resp_tab: [
				'<link rel="stylesheet" href="/webponent-press/external/webponent-tab/webponent.tab.css"/>'
			],
			video: [
				'<link rel="stylesheet" href="/webponent-press/external/mediaelement/mediaelementplayer.min.css"/>'
			],
			grid: [
				'<link rel="stylesheet" href="/webponent-press/grid/webponent.grid.css"/>',
				'<link rel="stylesheet" href="/webponent-press/grid/webponent.grid.flat.css"/>'
			],
			custom: []
		},

		js: {
			common: [
				'<script type="text/javascript" src="/webponent-press/external/agent/webponent.agent.js"></script>',
				'<script type="text/javascript" src="/webponent-press/external/jquery/jquery-1.11.1.min.js"></script>',
				'<script type="text/javascript" src="/webponent-press/external/jquery/jquery-ui-1.10.3.custom.min.js"></script>',
				'<script type="text/javascript" src="/webponent-press/external/underscore/underscore-min.js"></script>',
				'<script type="text/javascript" src="/webponent-press/js/webponent.press.js"></script>'
				/*'<script type="text/javascript" src="/WEB-APP/webponent-press1.0/libs/webponent.press.component.js"></script>'*/
			],
			bxSlider: [
				'<script type="text/javascript" src="/webponent-press/external/bxSlider/jquery.bxslider.js"></script>'
			],
			tab: [
				'<script type="text/javascript" src="/webponent-press/external/webponent-tab/webponent.tab.js"></script>'
			],
			accordion: [
				'<script type="text/javascript" src="/webponent-press/external/webponent-accordion/webponent.accordion.js"></script>'
			],
			resp_tab: [
				'<link rel="stylesheet" href="/webponent-press/external/jindo/jindo_mobile_component.js"/>',
				'<link rel="stylesheet" href="/webponent-press/external/jindo/jindo.all.ns.js"/>',
				'<link rel="stylesheet" href="/webponent-press/external/jindo/tab.mobile.js"/>'
			],
			table: [
				'<script type="text/javascript" src="/webponent-press/external/json2html/json2table.js"></script>',
				'<script type="text/javascript" src="/webponent-press/js/webponent.press.table.js"></script>'
			],
			video: [
				'<script type="text/javascript" src="/webponent-press/external/videolightning/videoLightning.js"></script>',
				'<script type="text/javascript" src="/webponent-press/external/mediaelement/mediaelement-and-player.js"></script>'
			],
			chart_common: [
				'<script src="/webponent.licenseKey.js"></script>',
				'<script src="/webponent-press/chart/raphael.js"></script>',
				'<script src="/webponent-press/chart/webponent.comm.common.js"></script>'
			],
			chart: [
				'<script src="/webponent-press/chart/webponent.chart.js"></script>'
			],
			pie: [
				'<script src="/webponent-press/chart/webponent.visual.pie.js"></script>'
			],
			koreamap: [
				'<script src="/webponent-press/chart/webponent.visual.korea.js"></script>'
			],
			cylinder: [
				'<script src="/webponent-press/chart/webponent.visual.shaped.js"></script>'
			],
			thermometer: [
				'<script src="/webponent-press/chart/webponent.visual.shaped.js"></script>'
			],
			angular: [
				'<script src="/webponent-press/chart/webponent.visual.angular.js"></script>'
			],
			linear: [
				'<script src="/webponent-press/chart/webponent.visual.linear.js"></script>'
			],
			scatter: [
				'<script src="/webponent-press/chart/webponent.visual.scatterplot.js"></script>'
			],
			horizon: [
				'<script src="/webponent-press/chart/webponent.visual.horizon.js"></script>'
			],
			treemap: [
				'<script src="/webponent-press/chart/webponent.visual.treemap.js"></script>'
			],
			grid: [
				'<script src="/webponent-press/grid/jquery.mousewheel.min.js"></script>',
				'<script src="/webponent-press/grid/webponent.grid.js"></script>',
				'<script src="/webponent-press/grid/webponent.grid.UIplugin.js"></script>'
			],
			custom: []
		}
	};

	window.webponent.press.runtime = self;


})(jQuery);
/**
 * 2014 사이버이메지네이션
 *
 * webponent press 코어라이브러리 component
 *
 * 컴퍼넌트 로드, 관리에 관한 로직들
 *
 * component.html 내 스크립트 저장
 *
 * @author 오상원 (ohsangwon@cyber-i.com)
 *
 */

(function ($) {
	"use strict";

	var self = {};

	var isDeployed = webponent.press.setting === undefined;


	/**
	 * 페이징 콤포넌트
	 * @param markup
	 * @param setting
	 */
	self.board_pageComponentScript = function (markup, setting) {
		markup.find('.press-board-page > li > a').off('click').on('click', function (e) {
			e.preventDefault();
			var page = $(this).attr('data-pagenum');
			if (!page) {
				return;
			}

			var $f = $(this).closest('FORM');

			var paramName = setting.pageParamName || 'curPage';

			markup.find('.page-num-value').attr('name', paramName).val(page);

			if ($f.length == 0) {
				return;
			}

			if(location.href.indexOf('/WEB-APP/webponent-press') > -1) {
				console.log('서버데이터 적용이 되지 않아 페이지 이동이 불가합니다.');
				return;
			}

			$f.submit();

		});
	};

	self.bannerComponentScript = function (markup, setting) {

	};

	/**
	 * iframe 컴퍼넌트
	 */
	self.iframeComponentScript = function(markup, setting){
		//empty
	};

	/**
	 * 탭 컴퍼넌트
	 */
	self.tabComponentScript = function(markup, setting){
		var tabMarkup = markup.find(".ci-tab:eq(0)");

		var option = {

			panelOpen : function (e, s, p) {

				p.find('.press-component-wrapper').each(function () {

					var componentWrapper = $(this);

					webponent.press.runtime.runComponent(componentWrapper, webponent.press.runtime.editing());
				});
			}
		};

		webponent.tab.init(tabMarkup, option);
	};

	self.resp_tabComponentScript = function(markup, setting){

	};


	/**
	 * 리스트 컴퍼넌트
	 */
	self.listComponentScript = function(markup, setting){
		//empty
	};

	/**
	 * 1단 레이아웃 컴퍼넌트
	 */
	self.layout_1ComponentScript = function(markup, setting){

	};

	/**
	 * 2단 레이아웃 컴퍼넌트
	 */
	self.layout_2ComponentScript = function(markup, setting){

	};

	/**
	 * 3단 레이아웃 컴퍼넌트
	 */
	self.layout_3ComponentScript = function(markup, setting){

	};

	/**
	 * 4단 레이아웃 컴퍼넌트
	 */
	self.layout_4ComponentScript = function(markup, setting){

	};


	/**
	 * bx_slider 컴포넌트
	 */
	self.bxSliderComponentScript = function(markup, setting){

	};

	/**
	 * accordion 컴포넌트
	 */
	self.accordionComponentScript = function(markup, setting){

	};

	/**
	 * repeator 컴포넌트
	 */

	self.repeatorComponentScript = function(markup, setting, repeatInfo){

		if(repeatInfo) {

			var totalRepeator = $('.press-repeator-component').parent().parent();

			_.each(totalRepeator, function (eachRepeator) {

				eachRepeator = $(eachRepeator);

				var repeatorSetting = eachRepeator.find('> [data-component-setting]');

				try {

					var setting = $.parseJSON($.trim(repeatorSetting[0].innerHTML).replace(/(\r\n|\n|\r)/gm,""));

				} catch ( E ) {

					console.log(E);
					return;
				}

				if(repeatInfo.value.uniqueId !== setting.setDataId) {

					return true;
				}

				var dataPath = setting.selectedDataPath;
				var selectedData = null;

				var data = repeatInfo.data;
				var dataString = 'data';

				if(dataPath.indexOf('[') !== 0) {

					dataString += '.';
				}

				try {

					selectedData = eval(dataString + dataPath);

				} catch (E) {

					console.log(E);
					return;
				}

				var repeatorArea = eachRepeator.children().children()
					.find('> .press-layout-section.press-flex-section');

				var pressComponentWrappers = repeatorArea.find('> .press-component-wrapper');

				_.each(selectedData, function (each_data, idx_data) { // 데이터 구조

					if(setting.maxValue === '' || Number(setting.maxValue) > idx_data) {

						_.each(pressComponentWrappers, function (pressComponentWrapper) {

							pressComponentWrapper = $(pressComponentWrapper);

							var firstClonedComponent = pressComponentWrapper.clone(true, true);

							copyForRepeator(firstClonedComponent);

							pressComponentWrapper.parent().append(firstClonedComponent);

							var allComponentPerDataIndex = firstClonedComponent.find('.press-component-wrapper');

							if (allComponentPerDataIndex.length === 0) {

								allComponentPerDataIndex = firstClonedComponent;
							}

							_.each(allComponentPerDataIndex, function (eachComponent) {

								eachComponent = $(eachComponent);

								var dataPathValue = replacementPathOfComponent(eachComponent);

								var extractedData = null;

								if (dataPathValue) {

									extractedData = doJsonPathArray(dataPathValue);
								}

								var isRepeatArrayLength = eachComponent.attr('repeat-array-length');

								if (isRepeatArrayLength === 'true') { //배열크기만큼 반복인가 아닌가

									_.each(extractedData[idx_data], function (orderedData) {

										var clonedComponent = eachComponent.clone(true, true);

										copyForRepeator(clonedComponent);
										eachComponent.parent().append(clonedComponent);

										//배열만큼 반복이어서 데이터 정리해서 보냄
										bindDataToComponent(clonedComponent, orderedData, idx_data);
									});

									eachComponent.addClass('display-none');

								} else {

									if (extractedData) {

										bindDataToComponent(eachComponent, extractedData[idx_data], idx_data);

									} else {

										bindDataToComponent(eachComponent, idx_data);//sorry
									}
								}
							})
						});
					}
				});

				pressComponentWrappers.addClass('display-none');

				var resultComponents = repeatorArea.find('> .press-component-wrapper');

				if(setting.viewFormat === 'grid') {

					resultComponents.css({
						'display' : 'inline-block',
						'overflow' : 'hidden',
						'vertical-align' : 'top'
					});

				} else if(setting.viewFormat === 'list'){

					resultComponents.css({
						'display' : 'block',
						'vertical-align' : 'initial'
					});

				} else {

					console.log('없음');
				}

				function copyForRepeator(_clonedComponent) {

					webponent.press.runtime.cleanComponentMarkup(_clonedComponent);
					var setUniqId = webponent.press.runtime.getMarkup(_clonedComponent);
					setUniqId = setUniqId.add(_clonedComponent.find('[data-componentId]'));

					_.each(setUniqId, function (value) {
						function getUniqueId(prefix) {

							return prefix + Math.random().toString(36).substr(2, 9);
						}
						var prevId = $(value).attr('data-componentId');
						var componentId = getUniqueId(prevId.split('-')[0] + '-');
						$(value).attr('data-componentId', componentId);
					});
				}

				function domSearching(node, finalData) {

					var list = node.children();

					if(list.length > 0 ) {

						domSearching($(list), finalData);

					} else {

						if(node[0].tagName !== 'A') {

							node.text(finalData);
						}
					}
				}

				function doJsonPathArray (pathInfo) {

					try {

						var extractedData = JSONPath({json: data, path: pathInfo});

					} catch (e) {

						console.log(e);
					}

					if (extractedData) {

						return extractedData;

					} else {

						return [];
					}
				}

				function replacementPathOfComponent(findInComponent) {

					var dataPath = findInComponent.attr('data-key-value');

					if (dataPath && dataPath !== '') {

						//dataPath = dataPath.replace(/[0-9]/g,"").split('[').join('[*');
						//dataPath = dataPath.replace(/[[0-9]]/g, "").replace("[", "[]").split('[').join('[*');
						return dataPath;
					}
				}

				function applyUserFunc(component, nomalData) {

					var userFunc = component.attr('user-func');

					if (userFunc && userFunc !== '') {

						try {

							var adder = new Function('val', userFunc);

						} catch (e) {

							console.log(e);
							return true;
						}

						return adder(nomalData);
					}
				}

				function judgeComponent(whatIsComponent, receivedData) {

					var applyedValue = applyUserFunc(whatIsComponent, receivedData);

					if(applyedValue) {

						receivedData = applyedValue;
					}

					var componentType = whatIsComponent.find('div[class$="-component"]').attr('class');

					if(componentType) {

						componentType = componentType.split(' ')[0];
					}

					switch (componentType) {

						case 'press-h1-component' :

						case 'press-h2-component' :

						case 'press-h3-component' :

						case 'press-h4-component' :

						case 'press-h5-component' :

						case 'press-text-component' :

							if(whatIsComponent.find('span.press-data-bind-handler').length > 0) {

								domSearching(whatIsComponent, receivedData);
							}

							break;

						case 'press-image-component' :

							if(receivedData === '') {

								whatIsComponent.remove();

							} else {

								if(typeof(receivedData) !== 'number') {

									whatIsComponent.find('img').attr('src', receivedData);
								}
							}

							break;

						case 'press-video-component' :

							whatIsComponent.find('video').attr('src', receivedData);
							break;

						case 'press-videop-component' :

							whatIsComponent.find('video').attr('src', receivedData);
							break;

						case 'press-buttton-component' :

							break;

						case 'press-form-component' :

							break;

						case 'press-input-component' :

							//text와 select, checkbox , 라디오, 서브밋 구별
							break;

						case 'press-table-component' :

							break;

						case 'press-grid-component' :

							break;

						case 'press-chrat-component' :

							break;

						case 'press-sns-button-component' :

							break;

						default    :  console.log('컴포넌트 등록안되어있음');

							break;
					}
				}

				function bindDataToComponent(comp, dataForCompo, idxForImageLink) { //component, array

					if(comp.hasClass('press-layout-component-wrapper')) {

						return true;
					}
					/*
					 var templateSettings = {
					 interpolate : /\{\{(.+?)\}\}/g
					 };

					 var bracecedData = {};

					 var deBraces = [];
					 var re = /\{\{(.+?)\}\}/g;
					 var xArray;
					 while (xArray = re.exec(comp.html())) {
					 deBraces.push(xArray[1]);
					 }
					 deBraces = _.unique(deBraces);

					 _.each(deBraces, function (eDeBraces) {

					 var aaaa =
					 bracecedData['"' + eDeBraces + '"'] =
					 '<span class="press-data-bind-handler hull-green" ' +
					 'contenteditable="false" data-key-value="' + eDeBraces +
					 '">' + eDeBraces + '</span>';
					 })
					 debugger;
					 var bracecedComp = _.template(_.unescape(comp.html()), bracecedData, templateSettings);
					 */

					/*		var bracecedData = {
					 'data[0].productName' : '<span class="press-data-bind-handler hull-green" ' +
					 'contenteditable="false" data-key-value="' + 'data[0].productName' +
					 '">' + 'data[0].productName' + '</span>',
					 'data[0].textLink' : '<span class="press-data-bind-handler hull-green" ' +
					 'contenteditable="false" data-key-value="' + 'data[0].textLink' +
					 '">' + 'data[0].textLink' + '</span>'
					 }
					 */

					_.each(comp.find('a'), function (eachAtag) {

						eachAtag = $(eachAtag);
						var newADataKey = eachAtag.attr('data-cke-saved-href');

						if (typeof(newADataKey) !== 'undefined' && newADataKey.length > 0) {

							var deBraces = [];
							var re = /\{\{(.+?)\}\}/g;
							var xArray;
							while (xArray = re.exec(newADataKey)) {
								deBraces.push(xArray[1]);
							}

							_.each(deBraces, function (eDebraces) {

								var dDebracesOrg = eDebraces;
								//eDebraces = eDebraces.replace(/[0-9]/g,"").split('[').join('[*');
								//eDebraces = eDebraces.replace(/[[0-9]]/g, "").replace("[", "[]").split('[').join('[*');
								var extractedDataForATag = doJsonPathArray(eDebraces);

								if(extractedDataForATag && extractedDataForATag[dataForCompo]) {

									newADataKey = newADataKey.replace('{{' + dDebracesOrg + '}}',
										extractedDataForATag[dataForCompo]
									);

									eachAtag.attr('href', newADataKey);

								} else {

									eachAtag.attr('href', '');
								}
							});
							eachAtag.removeAttr('data-cke-saved-href');
						}
					});

					_.each(comp.find('.press-text-component'), function (eachTexttag) {

						eachTexttag = $(eachTexttag);
						if (eachTexttag.text().length > 0) {

							var deBraces = [];
							var re = /\{\{(.+?)\}\}/g;
							var xArray;
							while (xArray = re.exec(eachTexttag.html())) {
								deBraces.push(xArray[1]);
							}

							_.each(deBraces, function (eDebraces) {

								var replaced = eachTexttag.html().replace('{{' + eDebraces + '}}',
									'<span class="press-data-bind-handler hull-green" ' +
									'contenteditable="false" data-key-value="' + eDebraces +
									'">' + eDebraces + '</span>'
								);
								eachTexttag.empty();
								eachTexttag.append(replaced);
							});
						}
					});


					//이미지에 링크태그 찾음
					var isImageLink = comp.attr('repeat-image-link');

					if(isImageLink) {

						isImageLink = isImageLink.replace(/[0-9]/g,"").split('[').join('[*');

						var extractedDataForImageLink = doJsonPathArray(isImageLink);

						if(!extractedDataForImageLink) {

							return true;
						}

						if (extractedDataForImageLink[dataForCompo] === '') {

							return true;
						}

						comp.find('img').wrapAll('<a href="http://' +
							extractedDataForImageLink[idxForImageLink] + '" target="_blank"></a>');
					}

					//이미지에 팝업데이터 찾음
					var isImagePopupData = comp.attr('repeat-image-popupdata');

					if(isImagePopupData) {

						isImagePopupData = isImagePopupData.replace(/[0-9]/g,"").split('[').join('[*');

						var extractedDataForImagePopupData = doJsonPathArray(isImagePopupData);

						if(!extractedDataForImagePopupData) {

							return true;
						}

						if (extractedDataForImagePopupData[idxForImageLink] === '') {

							return true;
						}

						comp.attr('repeat-image-popupdata', extractedDataForImagePopupData[idxForImageLink])
					}

					var isSpantag = comp.find('span.press-data-bind-handler');

					if(isSpantag.length > 0) {

						_.each(isSpantag, function (eachSpan) {

							eachSpan = $(eachSpan);
							var newSpanDataKey = replacementPathOfComponent(eachSpan);
							var extractedDataForSpanTag = doJsonPathArray(newSpanDataKey);

							if(!extractedDataForSpanTag) {

								return true;
							}

							if (extractedDataForSpanTag[dataForCompo] === '') {

								return true;
							}

							var applyedValue = applyUserFunc(eachSpan, extractedDataForSpanTag[dataForCompo]);

							if(applyedValue) {

								eachSpan.text(applyedValue);

							} else {

								eachSpan.text(extractedDataForSpanTag[dataForCompo]);
							}
						});

					} else {

						judgeComponent(comp, dataForCompo);
					}
				}
			});
		}
	};

	/**
	 * PDF 레이아웃 컴퍼넌트
	 */
	self.layout_pdfComponentScript = function(markup, setting) {
		markup.parent().css('margin', '0');
		markup.find('.press-layout-component-pdf-header').css('padding', '1px');
		markup.find('.press-layout-component-pdf-footer').css('padding', '1px');
	};

	/**
	 * 텍스트 컴퍼넌트
	 */
	self.textComponentScript = function(markup, setting){

		var componentId = markup.attr('data-componentId');

		if(isDeployed) {
			markup.find('> .press-text-component').removeClass('placeholder');
		}

		if (setting.data) {

			_.each(setting.data, function (dataInfo, key) {

				dataInfo.isSearch = false;

				webponent.press.runtime.getComponentData(dataInfo, function (data) {

					var bindSpan = markup.find('.press-data-bind-handler[data-id="' + dataInfo.uniqueId + '"]');

					_.each(bindSpan, function (value, key) {

						var dataKey = $(value).attr('data-key');
						var resetData = null;

						if (dataKey[0] === '[') {

							resetData = eval('data' + dataKey);

						} else {

							resetData = eval('data.' + dataKey);
						}

						$(value).html(resetData);
					});
				}, null, componentId);
			});
		}

		var textComponent = null;

		if(markup.hasClass('press-text-component')) {
			textComponent = markup;
		}else {
			textComponent = markup.find('.press-text-component');
		}

		if (window.RespText && RespText.isResponsive(textComponent)) {
			RespText.adjustSize(textComponent);
		}

		// ck-editor 인식, 관련 태그 제거
		markup.removeAttr('tabindex role spellcheck aria-label aria-describedby');
	};

	/**
	 * H1 컴퍼넌트
	 */
	self.h1ComponentScript = function(markup, setting){
		self.textComponentScript(markup, setting);
	};

	/**
	 * H2 컴퍼넌트
	 */
	self.h2ComponentScript = function(markup, setting){
		self.textComponentScript(markup, setting);
	};

	/**
	 * H3 컴퍼넌트
	 */
	self.h3ComponentScript = function(markup, setting){
		self.textComponentScript(markup, setting);
	};

	/**
	 * H4 컴퍼넌트
	 */
	self.h4ComponentScript = function(markup, setting){
		self.textComponentScript(markup, setting);	};

	/**
	 * H5 컴퍼넌트
	 */
	self.h5ComponentScript = function(markup, setting){
		self.textComponentScript(markup, setting);
	};

	/**
	 * 코딩 컴퍼넌트
	 */
	self.codingComponentScript = function(markup, setting){
	};

	/**
	 * 이미지 컴퍼넌트
	 */
	self.imageComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');

		markup.find('img[src="#"]').attr('src', markup.prevObject.isImageTabAdress);
		if (setting.data) {

			_.each(setting.data, function (dataInfo, key) {

				dataInfo.isSearch = false;

				webponent.press.runtime.getComponentData(dataInfo, function (data) {

					var bindSpan = markup.find('.press-data-bind-handler[data-id="' + dataInfo.uniqueId + '"]');

					_.each(bindSpan, function (value, key) {

						var dataKey = $(value).attr('data-key');

						var resetData = null;

						if (dataKey[0] === '[') {

							resetData = eval('data' + dataKey);

						} else {

							resetData = eval('data.' + dataKey);
						}

						$(value).html(resetData);
					});
				}, null, componentId);
			});
		}
	};

	/**
	 * 비디오 컴퍼넌트
	 */
	self.videoComponentScript = function(markup, setting){
		var player = markup.find('.press-video-comp');
		var divIfrm = markup.find('.press-video-ifrm');

		if (setting.video.useDirect) {
			divIfrm.show();
			player.hide();

			divIfrm.html(setting.video.directSource);

			var ifrm = divIfrm.find('iframe');

			divIfrm.attr({
				width: ifrm.attr('width'),
				height: ifrm.attr('height')
			});

			$( window ).resize(function() {
				if( divIfrm.css('display') == 'none'){
					return;
				}
				var parentWidth =markup.find('.press-video-component').width();

				if(parentWidth  <=  setting.video.width  ){
					divIfrm.css({
						width: parentWidth});
				}else{
					divIfrm.css({
						width: setting.video.width,
						height: '100%'});
				};
			});


			player.find('.mejs-volume-current').css('height', 0);

		} else {

			divIfrm.hide();
			player.show();

			var html = '<video width="' +setting.video.width+ '" height="'+setting.video.height+'" style="width: 100%; height: 100%;" preload="none">'
				+'	<source type="'+setting.video.mimeType+'" src="'+setting.video.videoURL+'" />'
				+'	<object style="width:100%;height:100%;" type="application/x-shockwave-flash" data="/WEB-APP/webponent-press1.0/external/mediaelement/flashmediaelement.swf">'
				+'		<param name="movie" value="/WEB-APP/webponent-press1.0/external/mediaelement/flashmediaelement.swf" />'
				+'		<param name="flashvars" value="controls=true&amp;file='+setting.video.videoURL+'" />'
				+'	</object>'
				+'</video>';
			player.html(html);


			player.closest('.press-video-comp').css('width',setting.video.width);
			player.find('video').mediaelementplayer({});
			player.find('.mejs-container').css({
				'width': setting.video.width,
				'height': setting.video.height
			});
			player.find('video').removeAttr('poster').attr('poster', setting.video.poster);
			player.find('.mejs-volume-current').css('height', 0);

			$( window ).resize(function() {
				var videoComp = markup.find('.press-video-component');
				var videoObj =  player.find('.mejs-container');
				if( videoComp.css('display') == 'none'){
					return;
				}

				var parentWidth = videoComp.width();

				if(parentWidth  <=  setting.video.width  ){
					var newHeight = setting.video.height / setting.video.width * videoObj.width()+ 'px';
					videoObj.css('height',newHeight);
					videoObj.parent().css('height',newHeight);
					videoComp.addClass('resizable');
					player.find('mejs-overlay-play').css('height',newHeight);
				}else{
					videoObj.css('height', setting.video.height);
					videoObj.parent().css('height', setting.video.height);
					videoComp.css(setting.video.height);
					videoComp.removeClass('resizable').css(setting.video.height);
					player.find('mejs-overlay-play').css('height', setting.video.height);
				};
			});
		}

		var componentId = markup.attr('data-componentId');

		if (setting.data) {

			_.each(setting.data, function (dataInfo, key) {

				dataInfo.isSearch = false;

				webponent.press.runtime.getComponentData(dataInfo, function (data) {

					var bindSpan = markup.find('.press-data-bind-handler[data-id="' + dataInfo.uniqueId + '"]');

					_.each(bindSpan, function (value, key) {

						var dataKey = $(value).attr('data-key');

						var resetData = null;

						if (dataKey[0] === '[') {

							resetData = eval('data' + dataKey);

						} else {

							resetData = eval('data.' + dataKey);
						}

						$(value).html(resetData);
					});
				}, null, componentId);
			});
		}
	};

	/**
	 * 비디오팝업 컴퍼넌트
	 */
	self.videopComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');

		var thumbLink = markup.find('.press-video-thumbnail');

		//var player = markup.find('.press-video-comp');

		var videoWidth = setting.video.width;
		var videoHeight = setting.video.height;

		try {
			if(WEBPONENT_PRESS_DEVICE_TYPE === 'mobile') {
				videoWidth = $(window).width();
			}
		} catch(e) { }

		thumbLink.on('click', function(e) {

			e.preventDefault();

			if(!isDeployed) {
				return;
			}

			var videoWrapper = $('<div>');
			videoWrapper.addClass('video-wrapper');


			if(setting.setting.type === 'none') {
				$(this).removeAttr('data-video-id');
				var html = '<div class="video-container"><video width="'+videoWidth+'" height="'+videoHeight+'" preload="none">'
					+'	<source type="'+setting.video.mimeType+'" src="'+setting.video.videoURL+'" />'
					+'	<object width="'+videoWidth+'" height="'+videoHeight+'" type="application/x-shockwave-flash" data="external/mediaelement/flashmediaelement.swf">'
					+'		<param name="movie" value="external/mediaelement/flashmediaelement.swf" />'
					+'		<param name="flashvars" value="controls=true&amp;file='+setting.video.videoURL+'" />'
					+'	</object>'
					+'</video></div>';
				videoWrapper.html(html);

				videoWrapper.find('audio, video').mediaelementplayer({});

				markup.find('.press-videop-component').append(videoWrapper);

				videoWrapper.off('click').on('click', function(e) {
					if(e.target.className === 'video-wrapper'){
						$('.press-videop-component').find('video')[0].pause();
						$(this).hide();
					}
				});


			} else {

				$(this).attr('data-video-id', setting.video.videoURL);

			}

		});

		if(setting.setting.type === 'youtube') {
			thumbLink.jqueryVideoLightning({
				id: setting.video.videoURL,
				autoplay: 1,
				backdrop_color: "#fff",
				backdrop_opacity: 0.7,
				glow: 20,
				glow_color: "#000",
				width: videoWidth,
				height: videoHeight
			});
		}

		if (setting.data) {

			_.each(setting.data, function (dataInfo, key) {

				dataInfo.isSearch = false;

				webponent.press.runtime.getComponentData(dataInfo, function (data) {

					var bindSpan = markup.find('.press-data-bind-handler[data-id="' + dataInfo.uniqueId + '"]');

					_.each(bindSpan, function (value, key) {

						var dataKey = $(value).attr('data-key');

						var resetData = null;

						if (dataKey[0] === '[') {

							resetData = eval('data' + dataKey);

						} else {

							resetData = eval('data.' + dataKey);
						}

						$(value).html(resetData);
					});
				}, null, componentId);
			});
		}
	};

	/**
	 * 버튼 컴퍼넌트
	 */
	self.buttonComponentScript = function(markup, setting){


		$('.press-preview-theme-kbfg_web div.press-button-component.kbBtn9').on('click', 'a', function (e) {
			e.preventDefault();

			var headerHtml='<html><head>';
			headerHtml+='<title>print</title>';
			headerHtml+='<link rel=\"shortcut icon\" type=\"image/x-icon\" href=\"/kor/common/images/common/favicon.ico\">';
			headerHtml+='<link rel=\"stylesheet\" type=\"text/css\" href=\"/kor/common/css/common.css\">';

			headerHtml+='<link rel=\"stylesheet\" type=\"text/css\" href=\"/webponent-press/external/resetcss/reset.css">';

			headerHtml+='<link rel=\"stylesheet\" type=\"text/css\" href=\"/webponent-press/css/webponent.press.css\">';
			headerHtml+='<link rel=\"stylesheet\" type=\"text/css\" href=\"/document/theme/kbfg_web.css">';

			headerHtml+='<script type=\"text/javascript\" src=\"/kor/common/js/jquery-1.4.2.min.js\"></script>';
			headerHtml+='<script type=\"text/javascript\">$(window).load(function(){window.focus();window.print();window.close();});</script>';
			headerHtml+='</head><body style="width: 900px;">';
			var contHtml=$('.press-content').html();
			var closeHtml='</body></html>';

			var win = window.open('', 'print', '');
			win.document.write(headerHtml+contHtml+closeHtml);
			win.document.close();
			return true;
		})

	};

	/**
	 * 이미지 버튼 컴퍼넌트
	 */
	self.img_buttonComponentScript = function(markup, setting){

	};

	/**
	 * 폼 컴퍼넌트
	 */
	self.formComponentScript = function(markup, setting){
		var form = markup.find('.press-form');
		//var submitButton = markup.find('.submit-button');

		form.off('submit');
		form.on('submit', function (e) {


			if (setting.data) {
				e.preventDefault();
				var ajaxOption = {};

				ajaxOption.data = form.serializeObject();

				setting.data.isSearch = true;
				setting.data.serialize = ajaxOption.data;

				var eventName = webponent.press.runtime.FORMSUBMIT + '.' + setting.data.uniqueId;

				webponent.press.runtime.getData(setting.data, function (data) {

					var pageSetting = webponent.press.runtime.getPageSetting();

					pageSetting.data[setting.data.uniqueId] = setting.data;

					if (webponent.press.interaction) {

						webponent.press.interaction.storeSetting($('.press-preview'), pageSetting);

						webponent.press.interaction.searchDataPanelTableJson(setting.data);
					}

					webponent.press.event.trigger(eventName, [data]);

				}, ajaxOption);
			}
		});
	};

	/**
	 * 텍스트(폼) 컴퍼넌트
	 */
	self.input_textComponentScript = function(markup, setting){

	};

	/**
	 * 셀렉트(폼) 컴퍼넌트
	 */
	self.selectboxComponentScript = function(markup, setting){

	};

	/**
	 * 체크박스(폼) 컴퍼넌트
	 */
	self.checkboxComponentScript = function(markup, setting){

	};

	/**
	 * 라디오(폼) 컴퍼넌트
	 */
	self.radioComponentScript = function(markup, setting){

	};

	/**
	 * Submit(폼) 컴퍼넌트
	 */
	self.submit_btnComponentScript = function(markup, setting){

	};

	/**
	 * 테이블 컴퍼넌트
	 */
	self.tableComponentScript = function(markup, setting){

		var componentId = markup.attr('data-componentId');

		var tableComponentWrapper = markup.children('.press-table-component');
		var tableComponent = tableComponentWrapper.children('.press-table-comp');

		if (setting.data) {

			_.each(setting.data, function (dataInfo, key) {

				webponent.press.runtime.getComponentData(dataInfo, function (data, eventName) {

					var isInitialize = tableComponent.attr('isInitialize') === 'true' ? true : false;

					// tr 갯수가 달라지는 테이블
					if(setting.isDynamicTr){
						if(isInitialize === true) {
							tableComponent.attr('isInitialize', false);
							return;
						}

						var dataKey = _.has(dataInfo, 'dataKey') ? data[dataInfo.dataKey] : data;
						var tableNode = $(buildTable(dataKey, undefined, dataInfo));
						var prevColgroup = tableComponent.children('colgroup').html();

						tableComponent = webponent.press.table.createTableOpen('component', tableComponentWrapper, tableNode, {info: dataInfo}, null, setting);

						var tableComponentFind = tableComponent.children('colgroup');
						tableComponentFind.children().remove();
						tableComponentFind.append(prevColgroup);
						tableComponent.addClass('press-table-comp');

						tableComponentWrapper.children().remove();
						tableComponentWrapper.append(tableComponent);

					} else {
						// 데이터만 변경되는 테이블
						// tr의 갯수는 변함없음.
						var bindSpan = markup.find('.press-data-bind-handler[data-id="' + dataInfo.uniqueId + '"]').filter(function(index, element) {

							return !$(this).closest('th').hasClass('td_head');
						});
						_.each(bindSpan, function (value, key) {

							var dataKey = $(value).attr('data-key');

							var resetData = null;

							if (dataKey[0] === '[' && !_.has(dataInfo, 'dataKey')) {

								resetData = eval('data' + dataKey);

							} else {
								if(dataKey[0] === '[' && _.has(dataInfo, 'dataKey')) {
									dataKey = dataInfo.dataKey + dataKey;
								}
								resetData = eval('data.' + dataKey);

								if(dataKey.indexOf('.') > -1){
									resetData = eval('data.' + dataKey.replace(".","['") +"']" );
								}else{
									resetData = eval('data.' + dataKey);
								}
							}

							$(value).html(resetData);
						});
					}

				}, null, componentId);
			})
		}


		// mobile
		if(markup.closest('[data-page]').width() < 416){
			if(setting.mobile.type !== '#typeNone') {
				if(setting.origincol.replace(/[^0-9]/g,"") !== tableComponent.children('colgroup').html().replace(/[^0-9]/g,"")) {
					webponent.press.table.revertTableType(markup.parent(), true);
				}
				webponent.press.table.init(markup.parent(), setting);
				tableComponent.children('colgroup').html(setting.mobileColWidth);
			}else{
				if(setting.origincol !== tableComponent.children('colgroup').html()) {
					webponent.press.table.init(markup, setting);
					tableComponent.children('colgroup').html(setting.origincol);
				}
			}

		}else{
			if(!setting.origincol){
				setting.origincol = tableComponent.children('colgroup').html().replace(/(\r\n|\n|\r| )/gm,"").replace(/col/g, 'col ');
			}

			if(setting.origincol.replace(/[^0-9]/g,"") !== tableComponent.children('colgroup').html().replace(/[^0-9]/g,"")) {
				webponent.press.table.revertTableType(markup.parent(), true);
			}
			tableComponent.children('colgroup').html(setting.origincol);

		}
	};

	/**
	 * 그리드 컴퍼넌트
	 */
	self.gridComponentScript = function(markup, setting){
		var table = markup.find('.grid-table');
		var template = markup.find('.grid-template');

		var option = {
			sortable : setting.sortable,
			resizable : setting.resizable,
			boostLoad : setting.boostLoad
		};

		if (setting.paging) {

			option.paging = {

				countPerPage : 10,
				paginationCount : 5,
				freezeScrollerY : 'hide'
			}
		}

		var grid = webponent.grid.init(table, template, option);

		if (setting.paging) {

			grid.makePageList();
		}

		if (setting.columnSettingPlugin ||
			setting.columnFilteringPlugin ||
			setting.columnGroupInfo.length > 0) {

			var uiPluginOption =  {

				settingUI : setting.columnSettingPlugin,
				filteringUI : setting.columnFilteringPlugin
			};

			if (setting.columnGroupPluginMobileOnly) {

				if (window.innerWidth <= 500) {

					if (setting.columnGroupInfo.length > 0) {

						var group = setting.columnGroupInfo;

						grid.groupColumns(group);

						uiPluginOption.groupingUI = true;
					}
				}
			} else {

				if (setting.columnGroupInfo.length > 0) {

					var group = setting.columnGroupInfo;

					grid.groupColumns(group);

					uiPluginOption.groupingUI = true;
				}
			}

			webponent.grid.UIplugin.init(grid, uiPluginOption);
		}

		grid.on('rowAppended', function () {

			if (setting.releaseScroll) {

				grid.releaseScroll();
			}
		});

		var hasFormatColumn = _.filter(setting.columnInfo, function (column) {

			return column.format;
		});

		if (hasFormatColumn.length > 0) {

			grid.on('rowRendered', function (e, row, data, index) {

				_.each(hasFormatColumn, function (column) {

					var columnName = column.columnName;
					var functionName = column.format.functionName;
					var parameterNames = column.format.parameters;

					var parameters = [];

					_.each(parameterNames, function (parameter) {

						parameters.push(data[parameter]);
					});

					var td = $(row).find('[data-name="' + columnName + '"]');

					var formatted = webponent.press.functions[functionName].run.apply(null, parameters);

					td.html(formatted);
				});
			});
		}

		var componentId = markup.attr('data-componentId');

		if (!setting.data) {

			grid.appendRow(setting.sampleData);

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				grid.removeRow();

				grid.appendRow(data);

			}, null, componentId);
		}
	};

	/**
	 * 차트 컴퍼넌트
	 */
	self.chartComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');

		function createChart(data, type){

			setTimeout(function(){

				var wrapper = markup.find('.component-chart-wrapper');

				wrapper.css('width', '100%');
				wrapper.css('height', setting.style.height + 'px');

				var options = {
					data: {
						data: data
					},
					use : {
						reSize: true
					}
				};

				options = $.extend(true, options, setting.option);

				var styles = $.extend(true, {}, setting.style);

				var series = $.extend(true, {}, setting.series);

				wrapper.children().remove();

				wrapper.chart = webponent.chart.init(wrapper, options, styles, series);
			}, 0);
		}

		if(!setting.style.main.hasOwnProperty('series')) {
			// 첫 로딩시 시리즈 없을때 강제로 추가.
			var series = {};
			$.each(setting.series.main, function(key, value){
				series[key] = $.extend(true, {}, setting.style.series);
			});
			setting.style.main.series = series;
		}

		if (!setting.data) {

			createChart(setting.sampleData);

			return;
		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				if (setting.data.mode === 'form') {

					createChart(data[setting.data.key]);

				} else {

					createChart(data);
				}
			}, null, componentId);
			webponent.press.runtime.getData(setting.data, function (data) {


				createChart(data, 'none');
			});
		}
	};

	/**
	 * Pie 컴퍼넌트
	 */
	self.pieComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function initPie () {
			// Number 1,000
			function format_num1 (value) {

				if (value === 0) {
					return 0;
				}

				var reg = /(^[+-]?\d+)(\d{3})/;
				var n = (value + '');

				while (reg.test(n)) {
					n = n.replace(reg, '$1' + ',' + '$2');
				}

				return n;
			}

			function getOptions () {

				var formatValue = null;

				if (setting.option.legend.format.use) {

					formatValue = setting.option.legend.format.value.split(",");

					var formatValueArr = [];

					for (var i = 0; i < formatValue.length; i++) {

						formatValue[i] = formatValue[i].replace(/(^\s*)|(\s*$)/gi, "");

						formatValueArr.push(formatValue[i]);
					}

				} else {

					formatValue = null;
				}

				var setTooltipFormat = {

					percent: function (pie, data, tipElement) {

						var dataTotalValue = pie.settings.data.dataTotalValue;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var span = '<span>' + average + '%</span>';

						tipElement.html(span);
					},

					data: function (pie, data, tipElement) {

						var value = data[setting.option.data.use];
						var span = '<span>' + format_num1(value) + '</span>';

						tipElement.html(span);
					},

					legend_data: function (pie, data, tipElement) {

						var value = data[setting.option.data.use];
						var legend = data[setting.option.legend.use];
						var span = '<span>' + legend + ' : ' + format_num1(value) + '</span>';

						tipElement.html(span);
					},

					legend_percent: function (pie, data, tipElement) {

						var dataTotalValue = pie.settings.data.dataTotalValue;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var legend = data[setting.option.legend.use];
						var span = '<span>' + legend + ' : ' + average + '%</span>';

						tipElement.html(span);
					},

					legend_data_percent: function (pie, data, tipElement) {

						var dataTotalValue = pie.settings.data.dataTotalValue;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var legend = data[setting.option.legend.use];
						var span = '<span>' + legend + ' : ' + format_num1(value) + ' (' + average + '%)</span>';

						tipElement.html(span);
					}
				}

				var options = {
					data: {
						data : settingData,
						use : setting.option.data.use,
						reverse : setting.option.data.reverse
					},
					legend : {
						use : setting.option.legend.use,
						format : formatValue
					},
					toolTip : {
						use : setting.option.toolTip.use,
						func : function (pie, data, tipElement) {

							var key = setting.option.toolTip.func;

							setTooltipFormat[key](pie, data, tipElement);
						}
					},
					resize : {
						use : setting.option.resize.use
					}
				};

				return options;
			}

			function setStyles () {

				if (setting.style.layout.area.color === "Not Specified") {

					setting.style.layout.area.opacity = 0;

				} else {

					setting.style.layout.area.opacity = 1;
				}

				setting.style.legend.pin = {
					color : setting.style.legend.form.color,
					length : setting.style.legend.form.size
				};

				setting.style.legend.pinHead = {
					size : setting.style.legend.form.size / 4,
					area : {
						color : setting.style.legend.form.color
					},
					line : {
						color : setting.style.legend.form.color
					},
					length : setting.style.legend.form.size,
					color : setting.style.legend.form.color
				};
			}

			var options = getOptions();

			setStyles();

			var wrapper = $('.component-pie-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.pie = webponent.visual.pie.init(wrapper, setting.style, options);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initPie();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data, eventName) {

				settingData = data;

				initPie();

			}, null, componentId);
		}
	};

	/**
	 * Scatter 컴퍼넌트
	 */
	self.scatterComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function initScatterPlot () {
			function getOptions () {

				var options = $.extend(true, {}, setting.option);

				options.data.data = settingData;

				if (options.toolTip.use) {

					options.toolTip.func = function (data, tipElement) {

						var infoText = '';

						_.each(setting.option.toolTip.dataArray, function (infoObj, i) {

							infoText += "<span class='info-label'>" + infoObj.label + "</span>";
							infoText += "<span class='info-data'>" + data[infoObj.data] + "</span>";

							if (i < setting.option.toolTip.dataArray.length - 1) {

								infoText += "<br />";
							}
						});

						tipElement.html(infoText);
					}
				}

				return options;
			}

			function getStyles () {

				var styles = $.extend(true, {}, setting.style);

				if (styles.layout.area.color === "Not Specified") {

					styles.layout.area.opacity = 0;

				} else {

					styles.layout.area.opacity = 1;
				}

				return styles;
			}

			var options = getOptions();
			var styles = getStyles();

			var wrapper = $('.component-scatter-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.scatter = webponent.visual.scatterPlot.init(wrapper, styles, options);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initScatterPlot();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initScatterPlot();

			}, null, componentId);
		}
	};

	/**
	 * Horizon 컴퍼넌트
	 */
	self.horizonComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function initHorizonChart () {
			function getOptions () {

				var options = $.extend(true, {}, setting.option);

				options.data.data = settingData;

				if (options.toolTip.use) {

					options.toolTip.func = function (data, tipElement) {

						var infoText = '';

						_.each(setting.option.toolTip.dataArray, function (infoObj, i) {

							infoText += "<span class='info-label'>" + infoObj.label + "</span>";
							infoText += "<span class='info-data'>" + data[infoObj.data] + "</span>";

							if (i < setting.option.toolTip.dataArray.length - 1) {

								infoText += "<br />";
							}
						});

						tipElement.html(infoText);
					}
				}

				return options;
			}

			function getStyles () {

				var styles = $.extend(true, {}, setting.style);

				if (styles.layout.area.color === "Not Specified") {

					styles.layout.area.opacity = 0;

				} else {

					styles.layout.area.opacity = 1;
				}

				return styles;
			}

			var options = getOptions();
			var styles = getStyles();

			var wrapper = $('.component-horizon-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.horizon = webponent.visual.horizon.init(wrapper, styles, options);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initHorizonChart();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initHorizonChart();

			}, null, componentId);
		}
	};

	/**
	 * Treemap 컴퍼넌트
	 */
	self.treemapComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');

		markup.find(".press-treemap-component").addClass(setting.theme);

		var settingData = null;

		function initTreeMap () {
			function getOptions () {

				var options = $.extend(true, {}, setting.option);

				options.data.data = settingData;

				var informationWrapper = markup.find(".component-treemap-information");

				if (setting.option.information.use) {

					informationWrapper.show();

					options.mousemove = function (data) {

						var infoText = '';

						_.each(setting.option.information.dataArray, function (infoObj, i) {

							infoText += "<span class='info-label'>" + infoObj.label + "</span>";
							infoText += "<span class='info-data'>" + data[infoObj.data] + "</span>";

							if (i < setting.option.information.dataArray.length - 1) {

								infoText += "|";
							}
						});

						informationWrapper.html(infoText);
					}

				} else {

					informationWrapper.hide();
				}

				return options;
			}

			function getStyles () {

				var styles = $.extend(true, {}, setting.style);

				if (styles.layout.area.color === "Not Specified") {

					styles.layout.area.opacity = 0;

				} else {

					styles.layout.area.opacity = 1;
				}

				if (styles.group.line.color === "Not Specified") {

					styles.group.line.opacity = 0;

				} else {

					styles.group.line.opacity = 1;
				}

				if (styles.label.area.color === "Not Specified") {

					styles.label.area.opacity = 0;

				} else {

					styles.label.area.opacity = 1;
				}

				styles.item.hover.line.width = Number(setting.style.item.line.width) + 1;

				return styles;
			}

			function dataCheck (options) {

				var check = true;

				var data = options.data.data;

				for (var i = 0; i < data.length; i++) {

					var use = data[i][options.data.use].replace(/[^\d]+/g, '');
					var flag = data[i][options.data.flag].replace(/[^\d]+/g, '');

					if (isNaN(use)) {

						check = false;

						alert('아이템 크기의 데이터가 올바르지 않습니다.');

						break;
					}

					if (isNaN(flag)) {

						check = false;

						alert('아이템 색상 값의 데이터가 올바르지 않습니다.');

						break;

					} else {

						if (flag > 20) {

							check = false;

							alert('아이템 색상 값의 범위가 너무 큽니다.');

							break;
						}
					}
				}

				return check;
			}

			var options = getOptions();
			var styles = getStyles();

			var wrapper = $('.component-treemap-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			var checkData = dataCheck(options);

			if (!checkData) {

				return;
			}

			wrapper.treemap = webponent.visual.treemap.init(wrapper, styles, options);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initTreeMap();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initTreeMap();

			}, null, componentId);
		}
	};

	/**
	 * KoreaMap 컴퍼넌트
	 */
	self.koreamapComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');

		var settingData = null;

		// Number 1,000
		function format_num1 (value) {

			if (value === 0) {
				return 0;
			}

			var reg = /(^[+-]?\d+)(\d{3})/;
			var n = (value + '');

			while (reg.test(n)) {
				n = n.replace(reg, '$1' + ',' + '$2');
			}

			return n;
		}

		function initKoreaMap () {
			function getOptions () {

				var options = $.extend(true, {}, setting.option);

				var formatValue = null;

				if (setting.option.colorStep.use) {

					formatValue = setting.option.colorStep.value.split(",");

					var formatValueArr = [];

					for (var i = 0; i < formatValue.length; i++) {

						formatValue[i] = formatValue[i].replace(/(^\s*)|(\s*$)/gi, "");

						formatValueArr.push(formatValue[i]);
					}

				} else {

					formatValue = null;
				}

				options.data.data = settingData;

				options.local = {
					step : formatValue
				};

				var setTooltipFormat = {

					percent: function (data, tipElement) {

						var dataTotalValue = data.dataTotal;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var span = '<span>' + average + '%</span>';

						tipElement.html(span);
					},

					data: function (data, tipElement) {

						var value = data[setting.option.data.use];
						var span = '<span>' + format_num1(value) + '</span>';

						tipElement.html(span);
					},

					local_data: function (data, tipElement) {

						var value = data[setting.option.data.use];
						var local = data[setting.option.data.localOption];
						var span = '<span>' + local + ' : ' + format_num1(value) + '</span>';

						tipElement.html(span);
					},

					local_percent: function (data, tipElement) {

						var dataTotalValue = data.dataTotal;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var local = data[setting.option.data.localOption];
						var span = '<span>' + local + ' : ' + average + '%</span>';

						tipElement.html(span);
					},

					local_data_percent: function (data, tipElement) {

						var dataTotalValue = data.dataTotal;
						var value = data[setting.option.data.use];
						var average = Math.round(100 / dataTotalValue * value);
						var local = data[setting.option.data.localOption];
						var span = '<span>' + local + ' : ' + format_num1(value) + ' (' + average + '%)</span>';

						tipElement.html(span);
					}
				}

				options.toolTip = {
					use : {
						local : setting.option.toolTip.use
					},
					func : function (data, tipElement) {

						var key = setting.option.toolTip.func;

						if (!data[setting.option.data.localOption]) {

							tipElement.hide();
						}

						setTooltipFormat[key](data, tipElement);
					},
					position : {
						x : setting.option.toolTip.position.x,
						y : setting.option.toolTip.position.y
					}
				}

				return options;
			}

			function getStyles () {

				var styles = $.extend(true, {}, setting.style);

				if (styles.layout.area.color === "Not Specified") {

					styles.layout.area.opacity = 0;

				} else {

					styles.layout.area.opacity = 1;
				}

				var koreaAreaColor = [];
				var colorStepLength = 7;

				if (setting.option.colorStep.use) {

					var formatValue = setting.option.colorStep.value.split(",");

					colorStepLength = formatValue.length;
				}

				for (var i = 0; i < colorStepLength; i++) {

					koreaAreaColor.push(styles.korea.area.color[i]);
				}

				styles.korea.area.color = koreaAreaColor;

				var sea = setting.style.sea;

				styles.sea = {
					east : {
						text : {
							value : sea.label.east,
							family : sea.text.family,
							size : sea.text.size,
							color : sea.text.color,
							weight : sea.text.weight
						}
					},
					west : {
						text : {
							value : sea.label.west,
							family : sea.text.family,
							size : sea.text.size,
							color : sea.text.color,
							weight : sea.text.weight
						}
					},
					south : {
						text : {
							value : sea.label.south,
							family : sea.text.family,
							size : sea.text.size,
							color : sea.text.color,
							weight : sea.text.weight
						}
					}
				}

				return styles;
			}

			var options = getOptions();
			var styles = getStyles();

			var wrapper = $('.component-koreamap-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.korea = webponent.visual.korea.init(wrapper, styles, options);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initKoreaMap();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initKoreaMap();

			}, null, componentId);
		}
	};

	/**
	 * Cylinder 컴퍼넌트
	 */
	self.cylinderComponentScript = function(markup, setting){
		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function getOptions () {
			var options = $.extend(true, {}, setting.option);
			options.data.data = settingData;
			return options;

		}
		function setStyles () {
			if (setting.style.layout.area.color === "Not Specified") {

				setting.style.layout.area.opacity = 0;

			} else {

				setting.style.layout.area.opacity = 1;
			}
		}

		function initCylinder () {

			var options = getOptions();

			setStyles();

			var wrapper = $('.component-cylinder-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.cylinder = webponent.visual.shaped.init(wrapper, setting.style, options, 'cylinder');
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initCylinder();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initCylinder();

			}, null, componentId);
		}
	};

	/**
	 * Thermometer 컴퍼넌트
	 */
	self.thermometerComponentScript = function(markup, setting){

		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function getOptions () {
			var options = $.extend(true, {}, setting.option);
			options.data.data = settingData;
			return options;

		}
		function setStyles () {
			if (setting.style.layout.area.color === "Not Specified") {

				setting.style.layout.area.opacity = 0;

			} else {

				setting.style.layout.area.opacity = 1;
			}
		}

		function initThermometer() {

			var options = getOptions();

			setStyles();

			var wrapper = $('.component-thermometer-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.thermometer = webponent.visual.shaped.init(wrapper, setting.style, options, 'thermometer');
		}

		if (!setting.data) {

			settingData = setting.sampleData;
			initThermometer();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initThermometer();

			}, null, componentId);
		}
	};

	/**
	 * Angular 컴퍼넌트
	 */
	self.angularComponentScript = function(markup, setting){

		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function getOptions () {
			var options = $.extend(true, {}, setting.option);
			options.data.data = settingData;
			return options;

		}
		function setStyles () {
			if (setting.style.layout.area.color === "Not Specified") {

				setting.style.layout.area.opacity = 0;

			} else {

				setting.style.layout.area.opacity = 1;
			}
		}

		function initAngular() {

			var options = getOptions();

			setStyles();

			var wrapper = $('.component-angular-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.angular = webponent.visual.angular.init(wrapper, setting.style, options, setting.gaugeType);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initAngular();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initAngular();

			}, null, componentId);
		}
	};

	/**
	 * Linear gauge 컴퍼넌트
	 */
	self.linearComponentScript = function(markup, setting){

		var componentId = markup.attr('data-componentId');
		var settingData = null;

		function getOptions () {
			var options = $.extend(true, {}, setting.option);
			options.data.data = settingData;
			return options;

		}

		function setStyles () {
			if (setting.style.layout.area.color === "Not Specified") {

				setting.style.layout.area.opacity = 0;

			} else {

				setting.style.layout.area.opacity = 1;
			}
		}

		function initLinear() {

			var options = getOptions();

			setStyles();

			var wrapper = $('.component-linear-wrapper', markup);

			wrapper.css("width", setting.style.wrapper.width);
			wrapper.css("height", setting.style.wrapper.height);

			wrapper.children().remove();

			wrapper.linear = webponent.visual.linear.init(wrapper, setting.style, options, setting.gaugeType);
		}

		if (!setting.data) {

			settingData = setting.sampleData;

			initLinear();

		} else {

			webponent.press.runtime.getComponentData(setting.data, function (data) {

				settingData = data;

				initLinear();

			}, null, componentId);
		}
	};

	/**
	 * 범례 컴퍼넌트
	 */
	self.legendComponentScript = function(markup, setting){

	};

	/**
	 * SNS 공유하기 버튼 컴퍼넌트
	 */
	self.share_btnComponentScript = function(markup, setting) {

		function kakaoEvent (url, title) {

			if (Kakao.Auth === undefined) {
				Kakao.init(setting.option.kakao.appKey);
			}
			Kakao.Link.sendTalkLink({
				label: title,
				image: {
					src: setting.option.kakao.image,
					width: "380px",
					height: "280px"
				},
				webLink: {
					text: '바로가기',
					url: url
				}
			});
		}

		if (setting.option.snsType == "kakao") {
			var url = markup.find('a').attr('data-url');
			var title = markup.find('a').attr('data-title');

			markup.find('a').off('click').on('click', function(e){
				kakaoEvent(url,title);
			});

		}else{
			return false;
		}

	};

	/**
	 * 캘린더 컴퍼넌트
	 */
	self.calendarComponentScript = function(markup, setting) {

		markup.find('.date-picker').attr('id', '').removeClass('hasDatepicker').datepicker({
			dateFormat: 'yy-mm-dd'
		});

		var value1 = setting.value1;
		var value2 = setting.value2;

		var $input1 = markup.find('.calendar-input1').attr('name', setting.name1);
		var $input2 = markup.find('.calendar-input2').attr('name', setting.name2);

		var today = new Date();

		if (!value1 || value1 === '{{today}}') {
			$input1.datepicker('setDate', today);
		} else if (value1 === '{{y1}}') {

			var _today = new Date();
			_today.setYear(_today.getFullYear() - 1);

			$input1.datepicker('setDate', _today);
		} else if (value1 === '{{m1}}') {

			var _today = new Date();
			_today.setMonth(_today.getMonth() - 1);

			$input1.datepicker('setDate', _today);
		} else {
			$input1.val(value1);
		}

		if (!value2 || value2 === '{{today}}') {
			$input2.datepicker('setDate', today);
		} else if (value2 === '{{y1}}') {

			var _today = new Date();
			_today.setYear(_today.getFullYear() - 1);

			$input2.datepicker('setDate', _today);
		} else if (value2 === '{{m1}}') {

			var _today = new Date();
			_today.setMonth(_today.getMonth() - 1);

			$input2.datepicker('setDate', _today);
		} else {
			$input2.val(value2);
		}

		markup.find('.calendar-label1').text(setting.label1);
		markup.find('.calendar-label2').text(setting.label2);


		markup.find('.calendar-this-year').off('click').on('click', function () {
			var _today = new Date();
			$input2.datepicker('setDate', _today);
			_today.setDate(1);
			_today.setMonth(0);
			$input1.datepicker('setDate', _today);
		});

		markup.find('.calendar-this-month').off('click').on('click', function () {
			var _today = new Date();
			$input2.datepicker('setDate', _today);
			_today.setDate(1);
			$input1.datepicker('setDate', _today);
		});

		markup.find('.calendar-today').off('click').on('click', function () {
			var _today = new Date();
			$input2.datepicker('setDate', _today);
			$input1.datepicker('setDate', _today);
		});

	}

	self.setThemes = function(componentThemeList,textTheme,setting, component){

		textTheme.children().remove();

		var componentName = 'outline';
		try {
			componentName = setting.settingName;
		}catch(e){}

		_.each(componentThemeList, function (value) {
			var option = null;

			if(typeof value.filter !='undefined') {
				if(value.filter.indexOf(componentName)>=0) {
					option = "<option value=" + value.value + ">" + value.text + "</option>";
				}
			}else {
				option = "<option value=" + value.value + ">" + value.text + "</option>";
			}



			textTheme.append(option);
			if(typeof component !='undefined') {
				if(component.hasClass(value.value)) {
					textTheme.find('option[value="' + value.value + '"]').attr("selected", "selected");
					return;
				}
			}
		});
	};


	if (!window.webponent){
		window.webponent = {};
	}

	if (!window.webponent.press) {
		window.webponent.press = {};
	}

	if (!window.webponent.press.event) {

		window.webponent.press.event = $({});
	}

	window.webponent.press.component = self;

})(jQuery);

(function($) {
	if(!window.RespText) {
		window.RespText = {};
	}

	var self = window.RespText;

	var RESP_ELEM_CLASS = 'respText';
	var RESP_SELECTOR = '.' + RESP_ELEM_CLASS;
	var DEFAULT_FONT_SIZE = 14;

	function adjustFont(element) {
		if (element.length) {
			element = element[0];
		}

		var $elem = $(element);

		var curWidth = $elem.width();
		var stdWidth = parseInt($(element).attr('data-std_width'));
		var stdFontSize = parseInt($(element).attr('data-std_font_size'));
		var ratio = curWidth / stdWidth;
		var curFont = stdFontSize * ratio;

		$elem.css({
			fontSize: curFont + 'px'
		});
	}

	function adjustTableLayout() {
		var table = webponent.press.runtime.getPageMarkup().find('.press-table-component');
		table.each(function(){
			webponent.press.runtime.runComponent($(this).closest('.press-component-wrapper'),false);
		});
	}

	function init() {
		$(document).ready(function() {
			$(window).on('resize', function() {
				if(webponent.press.runtime.getPageMarkup().find('.press-table-component').length > -1){
					adjustTableLayout();
				}

				//반응형탭 관련
				if(webponent.press.runtime.getPageMarkup().find('.press-tab-flex-component').length > -1){
					if($('.resp-tab-list').css('display') !== 'none' && $('.resp-heading.tab-active').length == 0 ){
						var idx = $('.resp-tab-item.tab-active').index();
						$('.resp-tab-panel').eq(idx).show();
					}
				}

				$(RESP_SELECTOR).trigger('response.resize');
			});

			$(document).on('response.resize', RESP_SELECTOR, function() {
				adjustFont(this);
			});
		});
	}

	function changeUnit(src, dest) {
		function change(elem, base) {
			if (!$(elem).hasClass('press-text-component')) {
				elem = elem.length ? elem[0] : elem;

				var fontSize = elem.style.fontSize;
				if ('' !== fontSize) {
					var parent = $(elem).parent();
					var pFontSize = parseFloat(parent.css('fontSize'));

					var result;
					if (src === 'px') {
						var intSize = parseInt(fontSize);
						if (pFontSize !== base) {
							result = intSize / pFontSize;
						} else {
							result = intSize / base;
						}

					} else {
						var floatSize = parseFloat(fontSize);
						if (pFontSize !== base) {
							result = Math.round(floatSize * pFontSize);
						} else {
							result = Math.round(floatSize * base);
						}
					}

					$(elem).css('fontSize', result + dest);
				}
			}

			_.each($(elem).children(), function(attr, idx) {
				change(attr, base);
			})
		}

		return change;
	}

	if (webponent.press.interaction) {
		self.init = function(element) {
			if(!element) {
				return;
			}

			if(element.length) {
				element = element[0];
			}

			var $element = $(element);

			$element.addClass(RESP_ELEM_CLASS);

			var stdFontSize = parseInt($element.css('font-size'));
			stdFontSize = _.isNaN(stdFontSize) ? DEFAULT_FONT_SIZE : stdFontSize;

			$element.attr('data-std_font_size', stdFontSize);
			$element.attr('data-std_width', $element.width());

			self.changePxToEm($element, stdFontSize);

			return element
		}

		self.setBaseFontSize = function(element, size) {
			if (!element) {
				return false;
			}

			var $element = $(element);

			$element.attr('data-std_font_size', size);
		}

		self.destroy = function(element) {
			if(!element) {
				return;
			}

			if(element.length) {
				element = element[0];
			}

			var $element = $(element);
			$element.css({
				fontSize: ''
			});

			var baseFontSize = $element.attr('data-std_font_size');

			self.changeEmToPx($element, baseFontSize);

			$element.removeClass(RESP_ELEM_CLASS);
			$element.removeAttr('data-std_font_size');
			$element.removeAttr('data-std_width');

			$element.off('response.resize');
		}
	}

	self.isResponsive = function(element) {
		if (!element) {
			return false;
		}

		var $element = $(element);

		if ($element.hasClass(RESP_ELEM_CLASS)) {
			return true;
		}

		return false;
	}

	self.adjustSize = function(element) {
		adjustFont(element);
	}

	self.changePxToEm = changeUnit('px', 'em');

	self.changeEmToPx = changeUnit('em', 'px');

	init();
})(jQuery);


