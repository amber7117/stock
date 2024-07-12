//ラストエリア
var lastSheet = $('#js-entry-lastsheet');
var entrySurvey = $('#js-entry-survey');

//フォーカス時背景黄色
$(function(){
    $(".entry__input").on('focus', function(){
        $(this).addClass('is-focus');
    }).on('blur', function(){
        $(this).removeClass('is-focus');
    });
});
/////////
// 最後の入力の条件
/////////
$("#Userseminar, #Userage, #Userfree, #Userfree2, #Userpref").on("change", function () {
    var userSeminar = $('#Userseminar').val();
    var userAge = $('#Userage').val();
    var usserFree = $('#Userfree').val();
    var usserFree2 = $('#Userfree2').val();
    var userPref = $('#Userpref').val();

    if( (userSeminar !== '') &&
        (userAge !== '') &&
        (usserFree !== '') &&
        (usserFree2 !== '') &&
        (userPref !== '')
    ){
        lastArea();
    };
});

function lastArea() {
    lastSheet.addClass('is-active');
    entrySurvey.addClass('is-active');
};



///////
// 日程sp用アコーディオン
/////////
$(".js-sp-seminarbutton").on('click', function() {

    var seminarValue = $(this).data("entry");
    $('#Userseminar').val(seminarValue).trigger('change');
    $("#js-sp-userseminar").removeClass('is-active');
    //エラー消す処理必要
    $('#Userseminar').next('span.error').remove();
    $('#Userseminar').prev().removeClass('is-error-before is-error-after');
    $('#Userseminar').prev().removeClass('is-select-error');
});
$("#js-userseminar").on('click', function() {
    var userSeminar = $('#Userseminar').val();
    //アコーディオン開く
    $("#js-sp-userseminar").addClass('is-active');
    //コメントバリデート隠す
    $('#js-userseminar-vali').removeClass("is-error");
    //エラー準備
    if ( (window.matchMedia( "(max-width: 767px)" ).matches) && (userSeminar == '') ) {
        $(this).children().addClass('is-error-before');
    };
    //他の開いてるアコーディオン閉じる
    $("#js-sp-userage, #js-sp-userfree, #js-sp-userfree2, #js-sp-userpref").removeClass('is-active');
});
/////////
// inputにフォーカスでアコーディオン閉じる
/////////
$(".entry__form input").on('click', function() {
    $(".entry-sp").removeClass('is-active');
    //エラー準備完了
    var erroSetSeminar = $('#Userseminar').prev().hasClass('is-error-before');
    if(erroSetSeminar === true){
        $("#Userseminar").prev().addClass('is-error-after');

        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
    } else {
        // console.log("ない");
    };
});

/////////
// お住まいの地域sp用アコーディオン
/////////
$(".js-userpref-button").on('click', function() {
    var userprefValue = $(this).data("pref");
    $('#Userpref').val(userprefValue).trigger('change');
    $("#js-sp-userpref").removeClass('is-active');
    //エラー消す処理必要
    $('#Userpref').next('span.error').remove();
    $('#Userpref').prev().removeClass('is-error-before is-error-after');
    $('#Userpref').prev().removeClass('is-select-error');
});

$("#js-userpref").on('click', function() {
    var userPref = $('#Userpref').val();
    var userSeminar = $('#Userseminar').val();

    //アコーディオン開く
    $("#js-sp-userpref").addClass('is-active');
     //コメントバリデート隠す
     $('#js-userpref-vali').removeClass("is-error");
    //エラー準備
    if ( (window.matchMedia( "(max-width: 767px)" ).matches) && (userPref == '') ) {
        $(this).children().addClass('is-error-before');
    };

    //エラー準備完了
    var erroSetAge = $('#Userage').prev().hasClass('is-error-before');
    var erroSetUserfree = $('#Userfree').prev().hasClass('is-error-before');
    var erroSetFree2 = $('#Userfree2').prev().hasClass('is-error-before');

    if(erroSetAge === true) {
        $('#Userage').prev().addClass('is-error-after');
        if (!$('#Userage').next('span.error').length) {
            $('#Userage').after('<span class="error">選択してください</span>');
        };
    };
    if(erroSetUserfree === true) {
       $('#Userfree').prev().addClass('is-error-after');
       if (!$('#Userfree').next('span.error').length) {
           $('#Userfree').after('<span class="error">選択してください</span>');
       };
   };
   if(erroSetFree2 === true) {
       $('#Userfree2').prev().addClass('is-error-after');
       if (!$('#Userfree2').next('span.error').length) {
           $('#Userfree2').after('<span class="error">選択してください</span>');
       };
   };
    //他の開いてるアコーディオン閉じる
    $("#js-sp-userseminar,#js-sp-userage, #js-sp-userfree, #js-sp-userfree2").removeClass('is-active');

    //前の項目飛ばしてフォーカスでエラー
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };

});

/////////
// 年代sp用アコーディオン
/////////
$(".js-age-button").on('click', function() {
    var userageValue = $(this).data("age");
    $('#Userage').val(userageValue).trigger('change');
    $("#js-sp-userage").removeClass('is-active');

    if (userageValue == '50〜54歳') {
      $('#Userage').next('span.error').text('参加条件：24歳～49歳');
    } else {
      //エラー消す処理必要
      $('#Userage').next('span.error').remove();
      $('#Userage').prev().removeClass('is-error-before is-error-after');
      $('#Userage').prev().removeClass('is-select-error');
    }
});

$("#js-userage").on('click', function() {
    var userAge = $('#Userage').val();
    var userSeminar = $('#Userseminar').val();
    var userPref = $('#Userpref').val();

    //アコーディオン開く
    $("#js-sp-userage").addClass('is-active');
     //コメントバリデート隠す
     $('#js-userage-vali').removeClass("is-error");
    //エラー準備
    if ( (window.matchMedia( "(max-width: 767px)" ).matches) && (userAge == '') ) {
        $(this).children().addClass('is-error-before');
    };
    //エラー準備完了
    var erroSetUserfree = $('#Userfree').prev().hasClass('is-error-before');
    var erroSetFree2 = $('#Userfree2').prev().hasClass('is-error-before');
    var erroSetPref = $('#Userpref').prev().hasClass('is-error-before');

    if(erroSetUserfree === true) {
       $('#Userfree').prev().addClass('is-error-after');
       if (!$('#Userfree').next('span.error').length) {
           $('#Userfree').after('<span class="error">選択してください</span>');
       };
   };
   if(erroSetFree2 === true) {
       $('#Userfree2').prev().addClass('is-error-after');
       if (!$('#Userfree2').next('span.error').length) {
           $('#Userfree2').after('<span class="error">選択してください</span>');
       };
   };
   if(erroSetPref === true) {
        $('#Userpref').prev().addClass('is-error-after');
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
    };
    //他の開いてるアコーディオン閉じる
    $("#js-sp-userseminar, #js-sp-userfree, #js-sp-userfree2, #js-sp-userpref").removeClass('is-active');

    //前の項目飛ばしてフォーカスでエラー
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userPref == ''){
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
        $('#Userpref').prev().addClass('is-select-error');
    };
});

/////////
// 年収sp用アコーディオン
/////////
$(".js-free2-button").on('click', function() {
    var userageValue = $(this).data("free2");
    $('#Userfree2').val(userageValue).trigger('change');
    $("#js-sp-userfree2").removeClass('is-active');

    if($('#Userfree2').hasClass('userfree2__800')) {
        valid = userageValue == '400万円未満' || userageValue == '400万円～500万円' || userageValue == '500万円～600万円' || userageValue == '600万円～700万円' || userageValue == '700万円～800万円';
        validText = '参加条件：年収800万円以上の方';
    } else if ($('#Userfree2').hasClass('userfree2__600')) {
        valid = userageValue == '400万円未満' || userageValue == '400万円～500万円' || userageValue == '500万円～600万円';
        validText = '参加条件：年収600万円以上の方';
    } else {
        valid = userageValue == '400万円未満' || userageValue == '400万円～500万円';
        validText = '参加条件：年収500万円以上の方';
    }

    if (valid) {
      $('#Userfree2').next('span.error').text(validText);
    } else {
      //エラー消す処理必要
      $('#Userfree2').next('span.error').remove();
      $('#Userfree2').prev().removeClass('is-error-before is-error-after');
      $('#Userfree2').prev().removeClass('is-select-error');
    }
});

$("#js-userfree2").on('click', function() {
    var userFree2 = $('#Userfree2').val();
    var userSeminar = $('#Userseminar').val();
    var userAge = $('#Userage').val();
    var userPref = $('#Userpref').val();


    //アコーディオン開く
    $("#js-sp-userfree2").addClass('is-active');
    //コメントバリデート隠す
    $('#js-userfree2-vali').removeClass("is-error");
    //エラー準備
    if ( (window.matchMedia( "(max-width: 767px)" ).matches) && (userFree2 == '') ) {
        $(this).children().addClass('is-error-before');
    };
    //エラー準備完了
    var erroSetAge = $('#Userage').prev().hasClass('is-error-before');
    var erroSetUserfree = $('#Userfree').prev().hasClass('is-error-before');
    var erroSetPref = $('#Userpref').prev().hasClass('is-error-before');

    if(erroSetAge === true) {
        $('#Userage').prev().addClass('is-error-after');
        if (!$('#Userage').next('span.error').length) {
            $('#Userage').after('<span class="error">選択してください</span>');
        };
    };
    if(erroSetUserfree === true) {
       $('#Userfree').prev().addClass('is-error-after');
       if (!$('#Userfree').next('span.error').length) {
           $('#Userfree').after('<span class="error">選択してください</span>');
       };
   };
   if(erroSetPref === true) {
        $('#Userpref').prev().addClass('is-error-after');
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
    };
    //他の開いてるアコーディオン閉じる
    $("#js-sp-userseminar,#js-sp-userage, #js-sp-userfree, #js-sp-userpref").removeClass('is-active');
    //前の項目飛ばしてフォーカスでエラー
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userPref == ''){
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
        $('#Userpref').prev().addClass('is-select-error');
    };
    if( userAge == ''){
        if (!$('#Userage').next('span.error').length) {
            $('#Userage').after('<span class="error">選択してください</span>');
        };
        $('#Userage').prev().addClass('is-select-error');
    };
});

/////////
// 雇用形態
/////////
$(".js-userfree-button").on('click', function() {
    var userfreeValue = $(this).data("userfree");
    $('#Userfree').val(userfreeValue).trigger('change');
    $("#js-sp-userfree").removeClass('is-active');
    if (userfreeValue == '派遣・契約社員' || userfreeValue == 'アルバイト・パート・主婦' || userfreeValue == '自営業・経営者') {
      $('#Userfree').next('span.error').text('参加条件：正社員・公務員・教職員・医師・看護師の方');
    } else {
      //エラー消す処理必要
      $('#Userfree').next('span.error').remove();
      $('#Userfree').prev().removeClass('is-error-before is-error-after');
      $('#Userfree').prev().removeClass('is-select-error');
    }
});
$("#js-userfree").on('click', function() {
    var userFree = $('#Userfree').val();
    var userPref = $('#Userpref').val();
    var userSeminar = $('#Userseminar').val();
    var userFree2 = $('#Userfree2').val();
    var userAge = $('#Userage').val();

    //アコーディオン開く
    $("#js-sp-userfree").addClass('is-active');
      //コメントバリデート隠す
      $('#js-userfree-vali').removeClass("is-error");
    //エラー準備
    if ( (window.matchMedia( "(max-width: 767px)" ).matches) && (userFree == '') ) {
        $(this).children().addClass('is-error-before');
    };
    //エラー準備完了
    var erroSetAge = $('#Userage').prev().hasClass('is-error-before');
    var erroSetFree2 = $('#Userfree2').prev().hasClass('is-error-before');
    var erroSetPref = $('#Userpref').prev().hasClass('is-error-before');

    if(erroSetAge === true) {
        $('#Userage').prev().addClass('is-error-after');
        if (!$('#Userage').next('span.error').length) {
            $('#Userage').after('<span class="error">選択してください</span>');
        };
    };
   if(erroSetFree2 === true) {
       $('#Userfree2').prev().addClass('is-error-after');
       if (!$('#Userfree2').next('span.error').length) {
           $('#Userfree2').after('<span class="error">選択してください</span>');
       };
   };
   if(erroSetPref === true) {
        $('#Userpref').prev().addClass('is-error-after');
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
    };

    //他の開いてるアコーディオン閉じる
    $("#js-sp-userseminar,#js-sp-userage, #js-sp-userfree2, #js-sp-userpref").removeClass('is-active');
    //前の項目飛ばしてフォーカスでエラー
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userPref == ''){
        if (!$('#Userpref').next('span.error').length) {
            $('#Userpref').after('<span class="error">選択してください</span>');
        };
        $('#Userpref').prev().addClass('is-select-error');
    };
    if( userAge == ''){
        if (!$('#Userage').next('span.error').length) {
            $('#Userage').after('<span class="error">選択してください</span>');
        };
        $('#Userage').prev().addClass('is-select-error');
    };
    if( userFree2 == ''){
        if (!$('#Userfree2').next('span.error').length) {
            $('#Userfree2').after('<span class="error">選択してください</span>');
        };
        $('#Userfree2').prev().addClass('is-select-error');
    };
});



///////
// エラー
///////

//(Userseminar)前の項目飛ばしてフォーカスでエラー
$('#Username1').on('focus', function () {
    var userSeminar = $('#Userseminar').val();
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
});
//(Username1)前の項目飛ばしてフォーカスでエラー
$('#Username2').on('focus', function () {
    var userSeminar = $('#Userseminar').val();
    var userName1 = $('#Username1').val();
    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userName1 == ''){
        if (!$("#Username1").next('span.error').length) {
            $("#Username1").after('<span class="error">入力してください</span>');
        };
        $("#Username1").addClass('is-error');
    };
});

//(Username2)前の項目飛ばしてフォーカスでエラー
$('#Usermail').on('focus', function () {
    var userSeminar = $('#Userseminar').val();
    var userName1 = $('#Username1').val();
    var userName2 = $('#Username2').val();

    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userName1 == ''){
        if (!$("#Username1").next('span.error').length) {
            $("#Username1").after('<span class="error">入力してください</span>');
        };
        $("#Username1").addClass('is-error');
    };
    if( userName2 == ''){
        if (!$("#Username2").next('span.error').length) {
            $("#Username2").after('<span class="error">入力してください</span>');
        };
        $("#Username2").addClass('is-error');
    };
});
//(Usermail)前の項目飛ばしてフォーカスでエラー
$('#Usertel').on('focus', function () {
    var userSeminar = $('#Userseminar').val();
    var userName1 = $('#Username1').val();
    var userName2 = $('#Username2').val();
    var userMail = $('#Usermail').val();

    if( userSeminar == ''){
        if (!$('#Userseminar').next('span.error').length) {
            $('#Userseminar').after('<span class="error">選択してください</span>');
        };
        $('#Userseminar').prev().addClass('is-select-error');
    };
    if( userName1 == ''){
        if (!$("#Username1").next('span.error').length) {
            $("#Username1").after('<span class="error">入力してください</span>');
        };
        $("#Username1").addClass('is-error');
    };
    if( userName2 == ''){
        if (!$("#Username2").next('span.error').length) {
            $("#Username2").after('<span class="error">入力してください</span>');
        };
        $("#Username2").addClass('is-error');
    };
    if( userMail == ''){
        $('input.required-mail').addClass('is-error');
        $('.error-mail').show();
    };
});


/* 電話番号入力エラー用 */
$('input.required-tel').on('input', function () {
    var error;
    var err_msg = '半角数字11桁で入力ください';
    tel = $('.required-tel').val();
    var data = $(this).data('name');
    var elem = $(`.entry__name[data-name="${data}"]`);

    var is_gdn = $(`.entry__name[data-cat="gdn"]`).length;

    if (is_gdn !== 0) { // GDNのみ別エラー表示
      if (!tel.match(/^0[987]0[-]?\d{4}[-]?\d{4}$/)) {
        err_msg = '参加確認のできる携帯電話の番号をご入力ください';
        error = true;
      };
    } else {
      if (tel.length <= 10 || tel.match(/[^0-9]+/)) {
        error = true;
      };
    };

    if (error) {
        if (!$(this).next('span.error').length) {
            $(this).after(
                '<span class="error">' + err_msg + '</span>'
            );
            $(this).addClass('is-error');
        }
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');
        return true;
    } else {
        $(this).next('span.error').remove();
        $(this).removeClass('is-error');
        elem.children('.entry__red').addClass('is-ok');
        elem.children('span').addClass('is-ok');
    };
});

$('input.required-tel').on('blur', function () {
    var error;
    var err_msg = '半角数字11桁で入力ください';
    tel = $('.required-tel').val();
    var is_gdn = $(`.entry__name[data-cat="gdn"]`).length;

    if (is_gdn !== 0) {  // GDNのみ別エラー表示
      if (!tel.match(/^0[987]0[-]?\d{4}[-]?\d{4}$/)) {
        err_msg = '参加確認のできる携帯電話の番号をご入力ください';
        error = true;
      };
    } else {
      if (tel.length <= 10 || tel.match(/[^0-9]+/)) {
        error = true;
      };
    };

    if (error) {
      if (!$(this).next('span.error').length) {
        $(this).after('<span class="error">' + err_msg + '</span>');
        $(this).addClass('is-error');
      }
    } else {
        $(this).next('span.error').remove();
        $(this).removeClass('is-error');
    };
});


/* input入力エラー用 */
$('input.required').on('input', function () {
    var error;

    if ($(this).val() === '') {
        error = true;
    }
    if (error) {
        if (!$(this).next('span.error').length) {
            $(this).after('<span class="error">入力してください</span>');
        };
        $(this).addClass('is-error');
    } else {
        $(this).next('span.error').remove();
        $(this).removeClass('is-error');
    }
});
$('input.required').on('blur', function () {
    var error;
    var data = $(this).data('name');
    var elem = $(`.entry__name[data-name="${data}"]`);

    if ($(this).val() === '') {
        error = true;
    }
    if (error) {
        if (!$(this).next('span.error').length) {
            $(this).after('<span class="error">入力してください</span>');
        };
        $(this).addClass('is-error');
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');
    } else {
        $(this).next('span.error').remove();
        $(this).removeClass('is-error');
        elem.children('.entry__red').addClass('is-ok');
        elem.children('span').addClass('is-ok');
    }
});


/* select入力エラー用 */
$('select.required').on('blur', function () {
    var error;
    var result = $(this).val();
    var msg;

    if($('#Userfree2').hasClass('userfree2__800')) {
        resultFree = result == '400万円未満' || result == '400万円～500万円' || result == '500万円～600万円' || result == '600万円～700万円' || result == '700万円～800万円';
        resultFreeText = '参加条件：年収800万円以上の方';
    } else if ($('#Userfree2').hasClass('userfree2__600')) {
        resultFree = result == '400万円未満' || result == '400万円～500万円' || result == '500万円～600万円';
        resultFreeText = '参加条件：年収600万円以上の方';
    } else {
        resultFree = result == '400万円未満' || result == '400万円～500万円';
        resultFreeText = '参加条件：年収500万円以上の方';
    }

    if (result === '') {
        error = true;
        msg = '選択してください';
    } else if (result == '50〜54歳') {
        error = true;
        msg = '参加条件：24歳～49歳';
    } else if (resultFree) {
        error = true;
        msg = resultFreeText;
    } else if (result == '派遣・契約社員' || result == 'アルバイト・パート・主婦' || result == '自営業・経営者') {
        error = true;
        msg = '参加条件：正社員・公務員・教職員・医師・看護師の方';
    }

    if (error) {
        if (!$(this).next('span.error').length) {
            $(this).after('<span class="error">' + msg + '</span>');
        } else {
            $(this).next('span.error').text(msg);
        };
        $(this).prev().addClass('is-select-error');

    } else {
        $(this).next('span.error').remove();
        $(this).prev().removeClass('is-select-error');

    }
});
$('select.required').on('change', function () {
    var error;
    var data = $(this).data('name');
    var elem = $(`.entry__name[data-name="${data}"]`);

    var result = $(this).val();

    if($('#Userfree2').hasClass('userfree2__800')) {
        resultFree = result == '400万円未満' || result == '400万円～500万円' || result == '500万円～600万円' || result == '600万円～700万円' || result == '700万円～800万円';
        resultFreeText = '参加条件：年収800万円以上の方';
    } else if ($('#Userfree2').hasClass('userfree2__600')) {
        resultFree = result == '400万円未満' || result == '400万円～500万円' || result == '500万円～600万円';
        resultFreeText = '参加条件：年収600万円以上の方';
    } else {
        resultFree = result == '400万円未満' || result == '400万円～500万円';
        resultFreeText = '参加条件：年収500万円以上の方';
    }

    var msg;
    if (result === '') {
        error = true;
        msg = '選択してください';
    } else if (result == '50〜54歳') {
        error = true;
        msg = '参加条件：24歳～49歳';
    } else if (resultFree) {
        error = true;
        msg =  resultFreeText;
    } else if (result == '派遣・契約社員' || result == 'アルバイト・パート・主婦' || result == '自営業・経営者') {
        error = true;
        msg = '参加条件：正社員・公務員・教職員・医師・看護師の方';
    }

    if (error) {
        if (!$(this).next('span.error').length) {
            $(this).after('<span class="error">' + msg + '</span>');
        } else {
            $(this).next('span.error').text(msg);
        };
        $(this).prev().addClass('is-select-error');
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');
    } else {
        $(this).next('span.error').remove();
        $(this).prev().removeClass('is-select-error');
        elem.children('.entry__red').addClass('is-ok');
        elem.children('span').addClass('is-ok');
    }
});

//「必須」を「OK」に
// $('#Userseminar').on('change', function () {
//     var val = $(this).val();
//     var data = $(this).data('name');
//     var elem = $(`.entry__name[data-name="${data}"]`);

//     if( val !== ''){
//         elem.children('.entry__red').addClass('is-ok');
//         elem.children('span').addClass('is-ok');
//     } else {
//         elem.children('.entry__red').removeClass('is-ok');
//         elem.children('span').removeClass('is-ok');
//     }
// });


/////////
// メールアドレス判定（ドメイン判定）
////////
const $domainList = [
    //トップドメイン
    '.com',
    '.net',
    '.jp',
    '.info',
    '.org',
    '.biz',
    '.ac',
    '.academy',
    '.accountant',
    '.accountants',
    '.actor',
    '.adult',
    '.ae',
    '.aero',
    '.ag',
    '.agency',
    '.ai',
    '.airforce',
    '.am',
    '.apartments',
    '.at',
    '.attorney',
    '.auction',
    '.audio',
    '.auto',
    '.baby',
    '.band',
    '.bar',
    '.bargains',
    '.be',
    '.beer',
    '.best',
    '.bid',
    '.bike',
    '.bingo',
    '.bio',
    '.pl',
    '.black',
    '.blackfriday',
    '.blog',
    '.blue',
    '.boutique',
    '.builders',
    '.business',
    '.buzz',
    '.bz',
    '.cab',
    '.cafe',
    '.cam',
    '.camera',
    '.camp',
    '.capital',
    '.car',
    '.cards',
    '.care',
    '.careers',
    '.cars',
    '.casa',
    '.cash',
    '.casino',
    '.catering',
    '.cc',
    '.center',
    '.ceo',
    '.ch',
    '.chat',
    '.cheep',
    '.chiritmas',
    '.church',
    '.city',
    '.claims',
    '.cleaning',
    '.click',
    '.clinic',
    '.clothing',
    '.cloud',
    '.club',
    '.cm',
    '.cn',
    '.co',
    '.in',
    '.nz',
    '.coach',
    '.codes',
    '.coffee',
    '.college',
    '.au',
    '.ru',
    '.sg',
    '.tw',
    '.community',
    '.company',
    '.computer',
    '.condos',
    '.construction',
    '.consulting',
    '.contractors',
    '.cooking',
    '.cool',
    '.country',
    '.coupons',
    '.credit',
    '.creditcard',
    '.cricket',
    '.cruises',
    '.cx',
    '.cyou',
    '.cz',
    '.dance',
    '.date',
    '.dating',
    '.deals	',
    '.degree',
    '.delivery',
    '.democrat',
    '.dental',
    '.dentist',
    '.design',
    '.dev',
    '.diamonds',
    '.diet',
    '.digital',
    '.direct',
    '.directory',
    '.discount',
    '.dog',
    '.domains',
    '.download',
    '.education',
    '.email	',
    '.energy',
    '.engineer',
    '.engineering',
    '.enterprises',
    '.equipment',
    '.es',
    '.estate',
    '.eu',
    '.events',
    '.exchange',
    '.expert',
    '.exposed',
    '.express',
    '.fail',
    '.faith',
    '.family',
    '.fan',
    '.farm',
    '.fashion',
    '.finance',
    '.financial',
    '.fish',
    '.fishing',
    '.fit',
    '.fitness',
    '.flights',
    '.florist',
    '.flowers',
    '.fm',
    '.football',
    '.forsale',
    '.foundation',
    '.fun',
    '.fund',
    '.furniture',
    '.futbol',
    '.fly',
    '.gallery',
    '.game',
    '.games',
    '.garden',
    '.gift',
    '.gifts',
    '.gives',
    '.glass',
    '.global',
    '.gold',
    '.golf',
    '.gr',
    '.graphics',
    '.gratis',
    '.green',
    '.gripe',
    '.group',
    '.gs',
    '.guide',
    '.guitars',
    '.guru',
    '.hu',
    '.haus',
    '.health',
    '.healthcare',
    '.help',
    '.hiphop',
    '.hiv',
    '.hn',
    '.hockey',
    '.holdings',
    '.holiday',
    '.homes',
    '.horse',
    '.host',
    '.hosting',
    '.house',
    '.how',
    '.ht',
    '.icu',
    '.id',
    '.tw',
    '.im',
    '.immo',
    '.immobilien',
    '.in',
    '.inc',
    '.industries',
    '.ink',
    '.institute',
    '.insure',
    '.international',
    '.investments',
    '.io',
    '.it',
    '.jewelry',
    '.jobs',
    '.juegos',
    '.kaufen',
    '.ki',
    '.kim',
    '.kitchen',
    '.kiwi',
    '.kr',
    '.kyoto',
    '.la',
    '.land',
    '.lawyer',
    '.lc',
    '.lease',
    '.legal',
    '.li',
    '.life',
    '.lighting',
    '.limited',
    '.limo',
    '.link',
    '.live',
    '.loan',
    '.loans',
    '.lol',
    '.london',
    '.love',
    '.lt',
    '.ltd',
    '.lu',
    '.luxe',
    '.maison',
    '.management',
    '.market',
    '.marketing',
    '.mba',
    '.md',
    '.me',
    '.media',
    '.memorial',
    '.men',
    '.mg',
    '.mn',
    '.mobi',
    '.moda',
    '.mom',
    '.money',
    '.monster',
    '.mortgage',
    '.movie',
    '.ms',
    '.mu',
    '.mx',
    '.nu',
    '.nagoya',
    '.name',
    '.navy',
    '.network',
    '.news',
    '.nf',
    '.ninja',
    '.nl',
    '.okinawa',
    '.onl',
    '.online',
    '.ooo',
    '.organic',
    '.page',
    '.partners',
    '.parts',
    '.party',
    '.pk',
    '.pe',
    '.pet',
    '.ph',
    '.photo',
    '.photography',
    '.photos',
    '.pics',
    '.pizza',
    '.place',
    '.plumbing',
    '.plus',
    '.poker',
    '.porn',
    '.press',
    '.pro',
    '.productions',
    '.promo',
    '.properties',
    '.property',
    '.protection',
    '.pub',
    '.pw',
    '.qpon',
    '.racing',
    '.recipes',
    '.red',
    '.rehab',
    '.reisen',
    '.rent',
    '.rentals',
    '.repair',
    '.report',
    '.republican',
    '.rest',
    '.restaurant',
    '.review',
    '.reviews',
    '.rich',
    '.rip',
    '.ro',
    '.rocks',
    '.rodeo',
    '.ru',
    '.run',
    '.ryukyu',
    '.sale',
    '.salon',
    '.sarl',
    '.sc',
    '.school',
    '.schule',
    '.science',
    '.se',
    '.security',
    '.services',
    '.sex',
    '.sexy',
    '.sg',
    '.sh',
    '.shoes',
    '.shop',
    '.show',
    '.si',
    '.singles',
    '.site',
    '.sk',
    '.ski',
    '.soccer',
    '.social',
    '.software',
    '.solar',
    '.solutions',
    '.space',
    '.storage',
    '.store',
    '.studio',
    '.style',
    '.supplies',
    '.supply',
    '.support',
    '.surf',
    '.surgery',
    '.systems',
    '.tattoo',
    '.tax',
    '.taxi',
    '.tc',
    '.tk',
    '.team',
    '.tech',
    '.technology',
    '.trl',
    '.tennis',
    '.theater',
    '.theatre',
    '.tienda',
    '.tips',
    '.tires',
    '.tl',
    '.today',
    '.tokyo',
    '.tools',
    '.top',
    '.tours',
    '.town',
    '.toys',
    '.trade',
    '.training',
    '.travel',
    '.tv',
    '.university',
    '.uno',
    '.uk',
    '.uz',
    '.vacations',
    '.vc',
    '.vegas',
    '.ventures',
    '.vet',
    '.vg',
    '.viajes',
    '.video',
    '.villas',
    '.vin',
    '.vip',
    '.vision',
    '.vodka',
    '.voyage',
    '.watch',
    '.webcam',
    '.website',
    '.wedding',
    '.wiki',
    '.win',
    '.wine',
    '.work',
    '.works',
    '.world',
    '.ws',
    '.wtf',
    '.コム',
    '.xxx',
    '.xyz',
    '.yoga',
    '.yokohama',
    '.zone',
];

function check(input) {
    let $mailAddress = $('.required-mail').val();
    let $index = $mailAddress.lastIndexOf('.');
    let $domain = $mailAddress.slice($index);
    if ($domainList.indexOf($domain) > -1) {
        input.setCustomValidity('');
    } else {
        //上記、ドメインと一致しない場合
        input.setCustomValidity('正しく入力しなおしてください。');
    };
};

$('.required-mail').on('input blur', function () {
    let $mailAddress = $('.required-mail').val();
    let $index = $mailAddress.lastIndexOf('.');
    let $domain = $mailAddress.slice($index);
    var data = $(this).data('name');
    var elem = $(`.entry__name[data-name="${data}"]`);
    if (
        ($domainList.indexOf($domain) <= -1) ||
        ($mailAddress.indexOf('@') <= -1) ||
        ($mailAddress.indexOf('@.') > -1)
    ){
        $(this).removeClass('is-focus');
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');

    } else if ($mailAddress.match(/@{1}[A-Za-z0-9_.-]{1,}\.{1}[A-Za-z0-9_.-]{1,}\.(rakuten.ne.jp)/)) {
        $(this).removeClass('is-focus');
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');
    } else if ($mailAddress.match(/(@candel.co.jp)/)) {
        $(this).removeClass('is-focus');
        elem.children('.entry__red').removeClass('is-ok');
        elem.children('span').removeClass('is-ok');
    } else {
        $('input.required-mail').removeClass('is-error');
        $('.error-mail').hide();
        $(this).removeClass('is-focus');
        elem.children('.entry__red').addClass('is-ok');
        elem.children('span').addClass('is-ok');
    };
});
$('.required-mail').on('blur', function () {
    let $mailAddress = $('.required-mail').val();
    let $index = $mailAddress.lastIndexOf('.');
    let $domain = $mailAddress.slice($index);

    if (
        ($domainList.indexOf($domain) <= -1) ||
        ($mailAddress.indexOf('@') <= -1) ||
        ($mailAddress.indexOf('@.') > -1)
    ){
        $('input.required-mail').addClass('is-error');
        $('.error-mail').text('メールアドレスを正しく入力しなおしてください。').show();
        $(this).removeClass('is-focus');

    } else if ($mailAddress.match(/@{1}[A-Za-z0-9_.-]{1,}\.{1}[A-Za-z0-9_.-]{1,}\.(rakuten.ne.jp)/)) {
        $('input.required-mail').addClass('is-error');
        $('.error-mail').text('@○○.○○.rakuten.ne.jpはご利用頂けません').show();
        $(this).removeClass('is-focus');
    } else if ($mailAddress.match(/(@candel.co.jp)/)) {
      $('input.required-mail').addClass('is-error');
      $('.error-mail').text('@candel.co.jpはご利用頂けません').show();
      $(this).removeClass('is-focus');
    } else {
        $('input.required-mail').removeClass('is-error');
        $('.error-mail').hide();
        $(this).removeClass('is-focus');

    };
});

const getDevice = function () {
    let ua = navigator.userAgent;
    if (
        ua.indexOf('iPhone') > 0 ||
        ua.indexOf('iPod') > 0 ||
        ua.indexOf('iPad') > 0
    ) {
        return 'ios';
    } else if (ua.indexOf('Android') > 0) {
        return 'android';
    } else {
        return 'other';
    }
};

const userAgentType = getDevice();
const inputUrl = $('#Usermail').get(0);
const submitButton = $('button[type="submit"]').get(0);

$(function () {
    if (userAgentType == 'ios') {
        $('input[type="email"]').get(0).type = 'url';
    }
});

inputUrl.addEventListener('click', () => {
    if (userAgentType == 'ios') {
        $('input[type="email"]').get(0).type = 'url';
    }
});

submitButton.addEventListener('click', () => {
    const inputUrl = $('#Usermail').get(0);
    inputUrl.setAttribute('type', 'email');
});

$('#Usermail').on('invalid',function (){
    if (userAgentType == 'ios') {
        $('input[type="email"]').get(0).type = 'url';
    }
});

//////////////////////
//submitバリデーション
//////////////////////

$('#js-entry-button').on('click', function (e) {
    var offset = ($('.offset').length) ? $('.offset').outerHeight() : 0;

    var userSeminar = $('#Userseminar').val();
    var SeminarPosition = $('#js-userseminar').offset().top - offset;

    var UserName1 = $('#Username1').val();
    var Name1Position = $('#Username1').offset().top - offset;

    var UserName2 = $('#Username2').val();
    var Name2Position = $('#Username2').offset().top - offset;

    var UserMail = $('#Usermail').val();
    var MailPosition = $('#Usermail').offset().top - offset;

    var UserTel = $('#Usertel').val();
    var telPosition = $('#Usertel').offset().top - offset;

    var Userpref = $('#Userpref').val();
    var prefPosition = $('#js-userpref').offset().top - offset;

    var Userage = $('#Userage').val();
    var agePosition = $('#js-userage').offset().top - offset;

    var Userfree = $('#Userfree').val();
    var freePosition = $('#js-userfree').offset().top - offset;

    var Userfree2 = $('#Userfree2').val();
    var free2Position = $('#js-userfree2').offset().top - offset;

    //メール
    let $mailAddress = $('.required-mail').val();
    let $index = $mailAddress.lastIndexOf('.');
    let $domain = $mailAddress.slice($index);

    // gdn flag
    var is_gdn = $(`.entry__name[data-cat="gdn"]`).length;


    if( userSeminar == ''){
        //日程
        $('html, body').animate({scrollTop: SeminarPosition}, 750);
        $('#js-userseminar-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        if (!$("#Userseminar").next('span.error').length) {
            $("#Userseminar").after('<span class="error">選択してください</span>');
        };
        $("#Userseminar").prev().addClass('is-select-error');
        return false;

    } else if ( Userpref == '' ){
        //お住まいの地域
        $('html, body').animate({scrollTop: prefPosition}, 750);
        $('#js-userpref-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);

        if (!$("#Userpref").next('span.error').length) {
            $("#Userpref").after('<span class="error">選択してください</span>');
        };
        $("#Userpref").prev().addClass('is-select-error');
        return false;
    } else if ( Userage == '' ){
        //年代
        $('html, body').animate({scrollTop: agePosition}, 750);
        $('#js-userage-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);

        if (!$("#Userage").next('span.error').length) {
            $("#Userage").after('<span class="error">選択してください</span>');
        };
        $("#Userage").prev().addClass('is-select-error');
        return false;

    } else if ( Userfree2 == '' ){
        //ご年収
        $('html, body').animate({scrollTop: free2Position}, 750);
        $('#js-userfree2-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);

        if (!$("#Userfree2").next('span.error').length) {
            $("#Userfree2").after('<span class="error">選択してください</span>');
        };
        $("#Userfree2").prev().addClass('is-select-error');
        return false;

    } else if ( Userfree == '' ){
        //雇用形態
        $('html, body').animate({scrollTop: freePosition}, 750);
        $('#js-userfree-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);

        if (!$("#Userfree").next('span.error').length) {
            $("#Userfree").after('<span class="error">選択してください</span>');
        };
        $("#Userfree").prev().addClass('is-select-error');
        return false;

    } else if ( UserName1 == '' ){
        //姓
        $('html, body').animate({scrollTop: Name1Position}, 750);
        $('#js-username1-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        $('#Username1').focus();

        if (!$("#Username1").next('span.error').length) {
            $("#Username1").after('<span class="error">入力してください</span>');
        };
        return false;

    } else if ( UserName2 == '' ){
        //名
        $('html, body').animate({scrollTop: Name2Position}, 750);
        $('#js-username2-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        $('#Username2').focus();

        if (!$("#Username2").next('span.error').length) {
            $("#Username2").after('<span class="error">入力してください</span>');
        };
        return false;

    } else if (
        (UserMail == '') ||
        ($domainList.indexOf($domain) <= -1) ||
        ($mailAddress.indexOf('@') <= -1) ||
        ($mailAddress.indexOf('@.') > -1)
    ){
        //メール
        $('html, body').animate({scrollTop: MailPosition}, 750);
        $('#js-usermail-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        $('#Usermail').focus();
        $('.error-mail').show();
        return false;

    } else if (
      UserMail.match(/@{1}[A-Za-z0-9_.-]{1,}\.{1}[A-Za-z0-9_.-]{1,}\.(rakuten.ne.jp)/)
    ){
        //メール  @○○.○○.rakuten.ne.jp
        $('html, body').animate({scrollTop: MailPosition}, 750);
        $('input.required-mail').addClass('is-error');
        $('.error-mail').text('@○○.○○.rakuten.ne.jpはご利用頂けません').show();
        $('#js-entry-button').prop("disabled", true);
        $('#Usermail').focus();
        $('.error-mail').show();
    } else if (
      UserMail.match(/(@candel.co.jp)/)
    ){
        //メール  @candel.co.jp
        $('html, body').animate({scrollTop: MailPosition}, 750);
        $('input.required-mail').addClass('is-error');
        $('.error-mail').text('@candel.co.jpはご利用頂けません').show();
        $('#js-entry-button').prop("disabled", true);
        $('#Usermail').focus();
        $('.error-mail').show();
    } else if (
      is_gdn === 0 && (
        ( UserTel == '' ) ||
        ( UserTel.length <= 10 ) ||
        ( UserTel.match(/[^0-9]+/) ))
    ){
        //電話番号
        $('html, body').animate({scrollTop: telPosition}, 750);
        $('#js-usertel-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        $('#Usertel').focus();

        if (!$('#Usertel').next('span.error').length) {
            $('#Usertel').after('<span class="error">半角数字11桁で入力ください</span>');
        }
        return false;
    } else if (is_gdn !== 0 && !UserTel.match(/^0[987]0[-]?\d{4}[-]?\d{4}$/)) {
        //電話番号(GDN)
        $('html, body').animate({scrollTop: telPosition}, 750);
        $('#js-usertel-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        $('#Usertel').focus();

        if (!$('#Usertel').next('span.error').length) {
            $('#Usertel').after('<span class="error">参加確認のできる携帯電話の番号をご入力ください</span>');
        }
        return false;

    } else if ($('#privacyPolicy').length && $("#privacyPolicy").prop("checked") !== true ){
        //同意チェック
        $('#js-privacypolicy-vali').addClass("is-error");
        $('#js-entry-button').prop("disabled", true);
        return false;
    } else {
        $('#js-entry-button').prop("disabled", false);
        return true;
    };

});


$(window).scroll(function() {
    // windowがスクロールされた時に実行する処理
    $('#js-entry-button').prop("disabled", false);
});
$("form").on("change", function () {
    $('.validation').removeClass("is-error");
    $('#js-entry-button').prop("disabled", false);
});

$("form").on("input", function () {
    $('.validation').removeClass("is-error");
});