'use strict';

checkStatus();
var userAgent = window.navigator.userAgent.toLowerCase();

function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function checkStatus() {
    $('form').submit(function (e) {
        if($('#Userfree').val())
        {
            // 正社員(非上場)でsubmitされた値は「正社員」に直す
            if($('#Userfree').val().match(/正社員.+?非上場.+?/g))
            {
                var status = '正社員';
                $('#Userfree').val('正社員');
            }
            else if($('#Userfree').val())
            {
                var status = $('#Userfree').val();
            }
            else
            {
                var status = '';
            }
        }

        // 全角・半角スペースを削除
        if($('#Usermail').val()){
            let val = $('#Usermail').val().replace(/\s+/g, '');
            $('#Usermail').val(val);
        }


        var actionUrl = $('form').attr('action');
        var actionUrlObj = new URL(actionUrl)
        var actionUrlParam = actionUrlObj.search
        var group_webinar = $('#group-flg').data('flg') ? $('#group-flg').data('flg') : ''; //仮置きの判定 多地域展開運用時見直し
        var status_text = $('#Userfree option:selected').text() ? $('#Userfree option:selected').text() : '';
        var salary = $('#Userfree2').val() ? $('#Userfree2').val() : '';
        var age = $('#Userage').val() ? $('#Userage').val() : '';
        var age_cond = ['20〜24歳', '25〜29歳', '30〜34歳', '35〜39歳', '40〜44歳', '45〜49歳'];
        var tomany_age_cond = ['20〜24歳', '25〜29歳', '30〜34歳', '35〜39歳', '40〜44歳', '45〜49歳', '50〜54歳'];
        var tomany_flg;
        if(tomany_age_cond.includes(age) && salary == '500万円～600万円' && status_text == '正社員(非上場)') {
            tomany_flg = 1;
        } else {
            tomany_flg = 0;
        }
        $("button[type=submit]").css({
            'pointer-events': 'none',
            'opacity': '0.7'
        });
        if ((['正社員', '公務員', '教職員'].includes(status) && !['400万円未満', '400万円～500万円'].includes(salary) && age_cond.includes(age) || group_webinar == 'group_webinar')
            || (['医師・看護師'].includes(status) && !['400万円未満', '400万円～500万円'].includes(salary) && tomany_age_cond.includes(age) || group_webinar == 'group_webinar')
            || (location.pathname.indexOf('priority-webinar') != -1)
            || (location.pathname.indexOf('change-webinar') != -1)
            || (location.pathname.indexOf('change-mkeo-normal') != -1))
        {
            $('form').off('submit');
            reduceVacantSeat(tomany_flg);
        } else {

            $('form').off('submit');
            if(actionUrlParam) {
                $(this).attr('action', actionUrl + '&aff=ads');
            }else{
                $(this).attr('action', actionUrl + '?aff=ads');
            }

            $('form').submit();
            if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1 && userAgent.indexOf('edge') === -1) {
                $('body').append('<div id="loading"><div class="inner"><p class="loding-text">ただいま処理中です...<br>完了ページが表示されるまでお待ちください。</p></div></div>');
            } else {
                $('body').append('<div id="loading"><div class="inner"><div class="dot-spin"></div><p class="loding-text">ただいま処理中です...<br>完了ページが表示されるまでお待ちください。</p></div></div>');
            }
        };
        return false;
    });
};

function reduceVacantSeat(tomany_flg=0) {
    var sauce_param = getParam('sauce') ? getParam('sauce') : '';
    var seminarId = $("#Userseminar option:selected").data('id') ? $("#Userseminar option:selected").data('id') : $("#Userseminar").data('id'); // form-separateのみ日程の取り方が違うため
    var region = $("#Userseminar option:selected").data('region');
    var lp_type = $('#lp_type').val();
    //for output log
    var seminarName = $("#Userseminar").val();
    var name1 = $('#Username1').val();
    var name2 = $('#Username2').val();
    var email = $('#Usermail').val();
    var tel = $('#Usertel').val();
    var category = $('input[name="category"]').val();
    // ajax
    $.ajax({
        type: 'POST',
        url: ajaxUrl,
        dataType: "json",
        data: {
            'action': 'webinarSeat',
            'seminarId': seminarId,
            'sauce_param': sauce_param,
            'tomany_flg': tomany_flg,
            'lp_type': lp_type,
            'name1': name1,
            'name2': name2,
            'email': email,
            'tel': tel,
            'category': category,
        },
        success: function (data) {
            if (data.seat > 0) {
                $('form').append('<input type="hidden" name="data[User][zoom_room_number]" value="' + data.zoomnumber + '">');
                $('form').append('<input type="hidden" name="data[User][zoom_webinar_url]" value="' + data.zoomurl + '">');
                $('form').append('<input type="hidden" name="data[User][zoom_mailadress]" value="' + data.user_mail + '">');
                $('form').append('<input type="hidden" name="data[User][tomanywebinar]" value="' + data.tomany_flg + '">');
                $('form').append('<input type="hidden" name="data[User][ics_url]" value="' + encodeURI(data.ics) + '">');
                $('form').append('<input type="hidden" name="data[User][g_calendar_url]" value="' + encodeURI(data.g_calendar) + '">');
                $('form').append('<input type="hidden" name="data[User][y_calendar_url]" value="' + encodeURI(data.y_calendar) + '">');
                $('form').append('<input type="hidden" name="data[User][calendar_start_date]" value="' + data.calendar_start_date + '">');
                $('form').append('<input type="hidden" name="data[User][calendar_end_date]" value="' + data.calendar_end_date + '">');
                $('form').submit();

                if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1 && userAgent.indexOf('edge') === -1) {
                    $('body').append('<div id="loading"><div class="inner"><p class="loding-text">ただいま処理中です...<br>完了ページが表示されるまでお待ちください。</p></div></div>');
                } else {
                    $('body').append('<div id="loading"><div class="inner"><div class="dot-spin"></div><p class="loding-text">ただいま処理中です...<br>完了ページが表示されるまでお待ちください。</p></div></div>');
                }
                return false;
            } else {
                $('#submit-error').text('お申し込みいただいた日程は満席の可能性があります。画面をリロードしていただき再度お申し込みください。');
                $('#submit-error').show();
                $("button[type=submit]").css({
                    'pointer-events': 'auto',
                    'opacity': '1'
                });
                $('#loading').remove();
                checkStatus();
            }
        },
        error: function () {
            $('#submit-error').text('申し込みに失敗しました。時間をおいて再度お試しください。');
            $('#submit-error').show();
            $("button[type=submit]").css({
                'pointer-events': 'auto',
                'opacity': '1'
            });
            $('#loading').remove();
            checkStatus();
        }
    })

}


