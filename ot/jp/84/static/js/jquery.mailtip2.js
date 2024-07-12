(function ($){
    //プローブオンインプットイベント対応
    var hasInputEvent = 'oninput' in document.createElement('input'),
        ISIE9 = /MSIE 9.0;/i.test(navigator.appVersion || '');
    //文字列から正規関数へ
    function parseRegExp(pattern, attributes){
        var imp = /[\^\.\\\|\(\)\*\+\-\$\[\]\?]/igm;
        pattern = pattern.replace(imp, function (match){
            return '\\' + match;
        });
        return new RegExp(pattern, attributes);
    }

    //キューバーの作成
    var createTip = function (input, config){
        var tip = null;
        //最初のキー操作のみで、リストが生成される
        if (!input.data('data-mailtip')) {
            var wrap = input.parent();
            //外側のコントロールが位置決めされていない場合は、先に外側のレイヤーに相対的な位置決めを設定します。
            !/absolute|relative/i.test(wrap.css('position')) && wrap.css('position', 'relative');
            //オートコンプリートを無効にする
            input.attr('autocomplete', 'off');

            var offset = input.offset();
            var wrapOffset = wrap.offset();

            tip = $('<ul class="mailtip" style="display: none; float: none; position:absolute; margin: 0; padding: 0; z-index: ' + config.zindex + '"></ul>');

            //DOMツリーへの配置
            input.after(tip);

            tip.css({
                top: offset.top - wrapOffset.top + input.outerHeight() + config.offsettop,
                left: offset.left - wrapOffset.left + config.offsetleft,
                width: config.width || input.outerWidth() - tip.outerWidth() + tip.width()
            });

            //マウスイベントのバインディング
            tip.delegate('li', 'mouseenter mouseleave click', function (e){
                switch (e.type) {
                    case 'mouseenter':
                        $(this).addClass('hover');
                        break;
                    case 'click':
                        var mail = $(this).attr('title');
                        input.val(mail).focus();
                        config.afterselect.call(input[0], mail);
                        break;
                    case 'mouseleave':
                        $(this).removeClass('hover');
                        break;
                    default:
                        break;
                }
            });

            //他の場所をクリックして、警告ボックスを閉じます
            $(document).bind('click', function (e){
                if (e.target === input[0]) return;
                tip.hide();
            });

            input.data('data-mailtip', tip);
        }

        return tip || input.data('data-mailtip');
    };

    //プロンプトリスト項目の作成
    var createLists = function (value, mails){
        var lists = '';
        var hasAt = /@/.test(value);
        if (hasAt) {
            var arr = value.split('@');
            if (arr.length > 2) return lists;
            value = arr[0];
            var regx = parseRegExp('@' + arr[1], 'i');
        }

        value = hasAt ? value.split('@')[0] : value;

        for (var i = 0, len = mails.length; i < len; i++) {
            if (hasAt && !regx.test(mails[i])) continue;
            lists += '<li title="' + value + mails[i] + '" style="margin: 0; padding: 0; float: none;"><p>' + value + mails[i] + '</p></li>';
        }

        return lists.replace(/^<li([^>]*)>/, '<li$1 class="active">');
    };

    //リストの起動状態を変更する
    var changeActive = function (panle, up){
        //プロンプトボックスでポップアップの実行が隠れる場合
        if (panle.css('display') === 'none') return;
        var liActive = panle.find('li.active');
        if (up) {
            var liPrev = liActive.prev();
            liPrev = liPrev.length ? liPrev : panle.find('li:last');
            liActive.removeClass('active');
            liPrev.addClass('active');
        } else {
            var liNext = liActive.next();
            liNext = liNext.length ? liNext : panle.find('li:first');
            liActive.removeClass('active');
            liNext.addClass('active');
        }
    };

    //隠されたヒントを表示する
    var toggleTip = function (val, tip, mails){
        //入力が空白、スペース、漢字、英語のカンマ、@で始まる、または2つ以上の@がある場合、プロンプトを直接非表示にする
        if (!val || /[,]|[\u4e00-\u9fa5]|\s|^@/.test(val) || val.split('@').length > 2) {
            tip.hide();
        } else {
            var lists = createLists(val, mails);
            //リスト項目が返された場合はプロンプトを展開し、そうでない場合はプロンプトを非表示にする。
            if (lists) {
                tip.html(lists).show();
            } else {
                tip.hide();
            }
        }
    };
    //インターフェイスを呼び出す
    $.fn.mailtip = function (config){
        var defaults = {
            mails: ['@aol.com', '@gmail.com', '@msn.com', '@hotmail.com', '@outlook.com', '@yahoo.com'],
            afterselect: $.noop,
            width: null,
            offsettop: 0,
            offsetleft: 0,
            zindex: 1000
        };

        config = $.extend({}, defaults, config);
        config.afterselect = typeof config.afterselect === 'function' ? config.afterselect : defaults.afterselect;
        config.width = typeof config.width === 'number' ? config.width : defaults.width;
        config.offsettop = typeof config.offsettop === 'number' ? config.offsettop : defaults.offsettop;
        config.offsetleft = typeof config.offsetleft === 'number' ? config.offsetleft : defaults.offsetleft;
        config.zindex = typeof config.zindex === 'number' ? config.zindex : defaults.zindex;

        return this.each(function (){
            //現在の入力ボックスオブジェクトをキャッシュする
            var input = $(this);
            //初期プロンプトボックス
            var tip = createTip(input, config);

            //バインドイベント
            input.bind('keydown input propertychange', function (e){
                if (e.type === 'keydown') {
                    //キーによって異なるアクションを実行
                    switch (e.keyCode) {
                        //Backspaceキー
                        case 8:
                            //IE9以上では、入力イベントにバグがあり、backspaceキーが入力イベントをトリガーしないので、このハックがあります
                            if ($.browser.msie && $.browser.version >= 9) input.trigger('input');
                            break;
                        case 9:
                            tip.hide();
                            break;
                        //アップワードキー
                        case 38:
                            changeActive(tip, true);
                            break;
                        //下方向キー
                        case 40:
                            changeActive(tip);
                            break;
                        //Enterキー
                        case 13:
                            //プロンプトボックスでポップアップの実行が隠れる場合
                            if (tip.css('display') === 'none') return;
                            e.preventDefault();
                            var mail = tip.find('li.active').attr('title');
                            input.val(mail).focus();
                            tip.hide();
                            config.afterselect.call(input[0], mail);
                            break;
                        default:
                            break;
                    }
                } else {
                    if (hasInputEvent) {
                        toggleTip(input.val(), tip, config.mails);
                    } else if (e.originalEvent.propertyName === 'value') {
                        toggleTip(input.val(), tip, config.mails);
                    }
                }
            });
            
            //IE9以上では、入力イベントにバグがあり、backspaceキーが入力イベントをトリガーしないので、このハックがあります
            ISIE9 && input.on('keyup', function (e){
                e.keyCode === 8 && toggleTip(input.val(), tip, config.mails);
            });
        });
    };
}(jQuery));
