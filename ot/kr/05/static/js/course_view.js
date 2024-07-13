const isAuthenticated = $('a[href="/auth/signin/"]').length == 0;
let selectGeneration = $('.course-item.active');
const lastGeneration = document.querySelector('#last_generation_number').value;
const firstGeneration = document.querySelector('#first_generation_number').value;
let isClick = false;
let isCurriculum = false;
let isProcessing = false;
const alarmButtons = document.querySelectorAll('.btn-alarm');
const code = window.location.href.split('/').reverse()[1];
const launchButtons = document.querySelectorAll('.btn-launch');
const linkButtons = document.querySelectorAll('.btn-link');

// 장바구니 버튼 ui 변경
const ChangeCart = (el, initial=false) => {
    let cart = $('main').find('.btn-cart');
    if($(el).prop('checked') && $(el).hasClass('cartin')){
        $(cart).addClass('active');
    }else if(!initial) {
        $(cart).removeClass('active');
    }
}
$(function() {
    // 팝업에 복사
    $('.course-bar-btns').find('.btn-apply').each((index, element) => {
        let applyNumber = $(element).parent().attr('id').replace('button_box_sticky', '');
        // let itemClone = $('.course-item-list').find(`div[data-number="${applyNumber}"]`).clone();
        // itemClone.find('input').each((i, el) => {
        //     let elId = $(el).attr('id');
        //     $(el).attr('id', 'popup_' + elId);
        // })
        // itemClone.find('label').each((i, el) => {
        //     let elFor = $(el).attr('for');
        //     $(el).attr('for', 'popup_' + elFor);
        // })
        // $('#generation_select_layer').find('.course-item-list').append(itemClone);
    })

    var lnb = $(".course-tab-area").offset().top;
    var last = $(".section-view-last").offset().top - 500;

    $(window).scroll(function() {

        var window = $(this).scrollTop();

        if(lnb <= window) {
            $(".course-tab-area").addClass("sticky");

            if(last >= window) {
                $("#course_bar").addClass("sticky");
            }else{
                $("#course_bar").removeClass("sticky");
            }
        }else{
            $(".course-tab-area").removeClass("sticky");
            $("#course_bar").removeClass("sticky");
        }
        courseTab();
    })
    // 현장강의 조기마감일때 온라인라이브 체킹
    $('.course-item-list').find('.course-item').each((index, el) => {
        if($(el).find('.input-checkbox').not(':disabled').length && !$(el).find('.input-radio:checked').length) {
            $(el).find('.input-radio').not(':disabled').first().prop('checked', true);
            if (!$('.btn-online-preview').length) {
                ChangePrice (el, $(el).attr('data-number'));
            }
        }
    })

    $('input[type="radio"]:checked').each((index, el) => {
        ChangeCart(el, true);
    })
});

//스크롤 시 상세페이지 탭 active
function courseTab(){
    let currentGeneration = $(`#generation_content_${$(selectGeneration).attr('data-number')}`);
    var intro = $(currentGeneration).find("#course_intro");
    var effect = $(currentGeneration).find("#course_effect");
    var target = $(currentGeneration).find("#course_target");
    var tutor = $(currentGeneration).find("#course_tutor");
    var curriculum = $(currentGeneration).find("#course_curriculum");
    if (!isClick && !isCurriculum) {
        if($(window).scrollTop() >= 0) {
            $(`.course-tab-area ul li`).removeClass("active");

            if(effect.length && $(window).scrollTop()>= $(effect).offset().top - 70){
                $(`.course-tab-area ul li`).removeClass("active");
                $(`.course-tab-area ul li`).eq(1).addClass('active');

                if($(window).scrollTop() >= $(target).offset().top - 70){
                    $(`.course-tab-area ul li`).removeClass("active");
                    $(`.course-tab-area ul li`).eq(2).addClass('active');

                    if($(window).scrollTop() >= $(tutor).offset().top - 70){
                        $(`.course-tab-area ul li`).removeClass("active");
                        $(`.course-tab-area ul li`).eq(3).addClass('active');

                        if($(window).scrollTop() >= $(curriculum).offset().top - 70){
                            $(`.course-tab-area ul li`).removeClass("active");
                            $(`.course-tab-area ul li`).eq(4).addClass('active');
                        }
                    }
                }
            } else{
                $(`.course-tab-area ul li`).eq(0).addClass('active');
            }
        }
    }

}

// 수강신청하기
$("#checkout_button").on("click", () => {
    let productId;
    if (typeof $(selectGeneration).attr('data-product') != 'undefined') {
        productId = $(selectGeneration).attr('data-product');
    }else {
        productId = $(selectGeneration).find('.input-radio:checked').val();
    }
    if(!isAuthenticated) {
        window.location.href=`/auth/signin/?next=/price/pay/?cart=${productId}`;
    }else {
        window.location.href=`/price/pay/?cart=${productId}`;
    }
})

$('#login_popup').find('button').on('click', () => {
    window.location.href = `/auth/signin/?next=${location.pathname}`;
})

const iframe = $('iframe')[0]
$('#course_preview_popup .popup-closed').on('click', function () {
    const player = new Vimeo.Player(iframe);
    player.pause();
})

// 상담하기
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const link = button.getAttribute('data-link');
        window.open(link);
    })
})

const OpenConsultingApplication = () => {
    $('#layer_contact').removeClass('dp-hidden')
}

$('.cancel-button').on('click', (e) => {
    $(e.target).parents('.layer-alert').addClass('dp-hidden');
})

$('#layer_contact .form-box.required input, #layer_contact .form-box.required textarea').on('input focusout', () => {
    const requiredInputElem = $('#layer_contact .form-box.required input:not("#layer_contact .input-box-radio input")')
    let inputValCount = 0
    requiredInputElem.each(function (index, item) {
        let inputName = $(item).attr("name")
        let validationElem = $(`#${inputName}_validation`)
        let inputValue = $(item).val()
        let inputBoxElem = $(item).parent()


        if ( inputName === "email"){
            if (inputValue.length === 0){
                validationElem.removeClass("warning success")
                inputBoxElem.removeClass("input-box-success input-box-warning")
                validationElem.html("")
            } else if (!EmailValidation(inputValue)){
                validationElem.html("이메일 형식이 아닙니다. 다시 입력해 주세요.")
                toggleClass(validationElem, "success", "warning")
                toggleClass(inputBoxElem, "input-box-success", "input-box-error")
            }else {
                validationElem.html("")
                toggleClass(validationElem, "warning", "success")
                toggleClass(inputBoxElem, "input-box-error", "input-box-success")
                inputValCount += 1
            }
        }else if (inputName === "phone"){
            if (inputValue.length === 0) {
                validationElem.removeClass("warning success")
                inputBoxElem.removeClass("input-box-success input-box-warning")
                validationElem.html("")
            }else if (!NumberOnly(inputValue)){
                validationElem.html("숫자만 입력해 주세요.")
                toggleClass(validationElem, "success", "warning")
                toggleClass(inputBoxElem, "input-box-success", "input-box-error")
            }
            else if (!PhoneValidation(inputValue, "phone")){
                validationElem.html("올바른 휴대폰 번호를 입력해 주세요.")
                toggleClass(validationElem, "success", "warning")
                toggleClass(inputBoxElem, "input-box-success", "input-box-error")
            }else {
                validationElem.html("")
                toggleClass(validationElem, "warning", "success")
                toggleClass(inputBoxElem, "input-box-error", "input-box-success")
                inputValCount += 1
            }
        }else if (inputName === "username"){
            if (inputValue.length === 0) {
                validationElem.removeClass("warning success")
                inputBoxElem.removeClass("input-box-success input-box-warning")
                validationElem.html("")
            }
            else if (!NameValidation(inputValue, "mix") || NumberValidation(inputValue)){
                validationElem.html("정확한 이름을 입력해 주세요.")
                toggleClass(validationElem, "success", "warning")
                toggleClass(inputBoxElem, "input-box-success", "input-box-error")
            }else {
                validationElem.html("")
                toggleClass(validationElem, "warning", "success")
                toggleClass(inputBoxElem, "input-box-error", "input-box-success")
                inputValCount += 1
            }
        }
    })

    const requiredTextAreaElem = $('#layer_contact .form-box.required textarea')
    let textAreaValCount = 0
    requiredTextAreaElem.each(function (index, item) {
        if($(item).val().length > 0){
            textAreaValCount += 1
        }
    })

    const submitElem = $('#contact_submit')
    if (requiredInputElem.length === inputValCount && requiredTextAreaElem.length === textAreaValCount){
        submitElem.attr('disabled', false)
        toggleClass(submitElem, 'btn-disabled', 'active')
    } else{
        submitElem.attr('disabled', true)
        toggleClass(submitElem, 'active', 'btn-disabled')
    }
})

$('#layer_contact').find('#contact_submit').on('click', (e) => {
    if (!isProcessing){
        isProcessing = true;
        $.ajax({
            type: 'POST',
            async: false,
            data: {
                'generation_number': $(selectGeneration).attr('data-number'),
                'possible_time': $('input[name="time"]:checked').val(),
                'consulting_method': $('input[name="method"]:checked').val(),
                'description': $('#content_input').val(),
                'email': $('input[name="email"]').val(),
                'username': $('input[name="username"]').val(),
                'phone': $('input[name="phone"]').val(),
                'company': $('#company').val(),
                'job': $('#job').val(),
                'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val()
            },
            statusCode: {
                200: function () {
                    $(`#consulting_popup`).find('.description-text').html('이메일 혹은 유선으로 3영업일 이내에 회신드리겠습니다.')
                    $('input[name="time"]:checked').prop("checked", false)
                    $('input.default[name="time"]').prop("checked", true)
                    $('input[name="method"]:checked').prop("checked", false)
                    $('input.default[name="method"]').prop("checked", true)
                    $('#content_input').val("")

                    if (!$('input[name="email"]').prop("readonly")) {
                        $('input[name="email"]').val("");
                        $('input[name="username"]').val("");
                        $('input[name="phone"]').val("");
                        $('input[name="company"]').val("");
                        $('input[name="job"]').val("");
                    }
                    
                    isProcessing = false;
                }
            }
        })
        $('#layer_contact').addClass('dp-hidden')
        $(`#consulting_popup`).removeClass('dp-hidden')
        $('body').removeClass('pinned')
    }
})

$('#consulting_popup').on('click', '.bg-primary', () => {
    $('#consulting_popup').addClass('dp-hidden')
    $('body').removeClass('pinned')
})

const OpenAlarmPopup = () => {
    // if (!isAuthenticated) {
    //     $('#login_popup').removeClass('dp-hidden');
    // } else {
    //     if($('#alarm_layer').hasClass('disabled')) {
    //         $('#alarm_complete').removeClass('dp-hidden');
    //     }else {
    //         $('#alarm_layer').removeClass('dp-hidden');
    //     }
    // }
	location.href = 'https://open.kakao.com/o/gxMREXsf'
}

$('#alarm_complete').find('button').on('click', () => {
    $('#alarm_complete').find('.body3.txt-color3').html('이미 신청했어요.<br>다음 기수 오픈 시 안내드릴게요.');
    $('#alarm_complete').addClass('dp-hidden');
})
// 출시알림 신청
$('#alarm_layer').on('input', 'input', () => {
    let name = $('#name').val();
    let phone = $('#phone').val();
    let email = $('#email').val();
    $('#name').parent().removeClass('input-box-error');
    $('#name').next('.warning').addClass('dp-hidden');

    $('#phone').parent().removeClass('input-box-error');
    $('#phone').next('.warning').addClass('dp-hidden');

    $('#email').parent().removeClass('input-box-error');
    $('#email').next('.warning').addClass('dp-hidden');

    if (name && phone && email) {
        $('#alarm_layer').find('button').removeClass('btn-disabled');
        $('#alarm_layer').find('button').addClass('bg-primary');
    }else {
        $('#alarm_layer').find('button').addClass('btn-disabled');
        $('#alarm_layer').find('button').removeClass('bg-primary');
    }
})

$('#alarm_layer').find('button').on('click', () => {
    if ($('#alarm_layer').find('input').length) {
        if(!isProcessing) {
            isProcessing = true;
            let name = $('#name').val();
            let phone = $('#phone').val();
            let email = $('#email').val();

            if(!NameValidation(name, "mix") || NumberValidation(name)) {
                $('#name').parent().addClass("input-box-error")
                $('#name').next('.warning').removeClass('dp-hidden');
            } else if(!PhoneValidation(phone, "all")) {
                $('#phone').parent().addClass("input-box-error")
                $('#phone').next('.warning').removeClass('dp-hidden');
            } else if (!EmailValidation(email)) {
                $('#email').parent().addClass("input-box-error")
                $('#email').next('.warning').removeClass('dp-hidden');
            } else {
                let data = {
                    'code': code,
                    'number': lastGeneration,
                    'name': name,
                    'phone': phone,
                    'email': email,
                    'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val()
                }
                $.ajax({
                    url: '/course/api/request_alarm/',
                    type: 'POST',
                    data: data,
                    statusCode: {
                        200: function(response) {
                            isProcessing = false;
                            $(`#alarm_layer`).addClass('dp-hidden');
                            $(`#alarm_layer`).addClass('disabled');
                            $(`#alarm_complete`).removeClass('dp-hidden');
                            alarmButtons.forEach(button => button.classList.add('active'));
                        },
                        403: function(res) {
                            isProcessing = false;
                            $(`#alarm_layer`).addClass('dp-hidden');
                            $('#login_popup').removeClass('dp-hidden');
                        }
                    }
                });
            }
        }
    }else {
        $(`#alarm_layer`).addClass('dp-hidden');
    }
})

// 수강신청 팝업
$(".btn-apply").on("click", () => {
    if (!isAuthenticated) {
        $('#login_popup').removeClass('dp-hidden');
    }else {
        $('#generation_select_layer').removeClass('dp-hidden');
    }
})

$('#possible_time').on('click', 'label', (event) => {
    const targetElem = $(event.currentTarget)
    const targetInput = targetElem.prev('input')
    $('#possible_time').find('input').prop('checked', false)
    targetInput.prop('checked', true)
})

$('#consulting_method').on('click', 'label', (event) => {
    const targetElem = $(event.currentTarget)
    const targetInput = targetElem.prev('input')
    $('#consulting_method').find('input').prop('checked', false)
    targetInput.prop('checked', true)
})

// 이어보기
$(".btn-continue").on("click", () => {
    window.location.href = `/auth/course/${location.pathname.split('/')[3]}/${$(selectGeneration).attr('data-number')}`;
})

// 내강의장
$(".btn-class").on("click", () => {
    window.location.href = '/auth/course/';
})

$(".btn-consulting").on("click", () => {
    OpenConsultingApplication();
})

// 장바구니 담기
$('main').find(".btn-cart").on("click", () => {
    if (!isAuthenticated) {
        $('#login_popup').removeClass('dp-hidden');
    } else {
        let selectProduct = $(selectGeneration).attr('data-product');
        // 오프라인 강의 체크 
        if($(selectGeneration).find('.input-radio:checked').length) {
            selectProduct = $(selectGeneration).find('.input-radio:checked').val();
        }
        $.ajax({
            url: '/price/api/add_cart/',
            type: 'GET',
            async : true,
            data: {'pk': selectProduct},
            statusCode: {
                200: function (response) {
                    // 헤더 장바구니 담긴 숫자 변경
                    $('header .btn-cart').find('span').html(response);

                    // 장바구니 ui 변경
                    $('main').find('.btn-cart').addClass('active');

                    // 온라인이라면
                    if (!$(selectGeneration).find('.input-radio:checked').length) {
                        $(selectGeneration).addClass('cartin');
                    }else {
                        $(selectGeneration).find('.input-radio:checked').addClass('cartin');
                    }
                    $('#cart_toast').removeClass('dp-hidden');
                    $('#cart_toast').find('.primary.txt-bold').html('<a href="/price/cart/">장바구니에서 확인할래요</a>');
                    setTimeout(() => {
                        $('#cart_toast').addClass('dp-hidden');
                    }, 1500)
                },
                201: () => {
                    $('#cart_toast').removeClass('dp-hidden');
                    $('#cart_toast').find('.primary.txt-bold').html('이미 담겨있어요!');
                    setTimeout(() => {
                        $('#cart_toast').addClass('dp-hidden');
                    }, 1500)
                }
            }
        })
    }
})

// 출시알림 이벤트
alarmButtons.forEach((button) => {
    button.addEventListener('click', () => {
        OpenAlarmPopup();
    })
})

// 모집중인 기수 보기 이벤트
launchButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (!$('#course_bar').hasClass('sticky')){
            document.querySelector(`div[data-number="${firstGeneration}"]`).click();
            return;
        }
        document.getElementById('course_bar').style.opacity = '0';
        $([document.documentElement, document.body]).stop().animate({scrollTop: 0}, 500);
        setTimeout(() => {
            document.getElementById('course_bar').style.opacity = '1';
            document.querySelector(`div[data-number="${firstGeneration}"]`).click();
        },300)
    })
})

function ChangePrice (targetElem, generationNumber) {
    $('.price-area').addClass('dp-hidden');
    if($(targetElem).find('.input-radio').length > 0){
        if ($(targetElem).find('.input-radio:checked').length) {
            $(`div.price-area[data-product="${$(targetElem).find('.input-radio:checked').val()}"]`).removeClass('dp-hidden');
        } else {
            $(`div.price-area[data-target="${generationNumber}"]`).removeClass('dp-hidden');

        }
    } else {
        $(`div.price-area[data-product="${$('#generation_select_layer .course-item.active').find('.input-radio:checked').val()}"]`).removeClass('dp-hidden');
    }
}
$('.course-item-list').on('click', '.course-item', (event) => {
    $('input[type="radio"]:checked').each((index, el) => {
        ChangeCart(el);
    })
    const targetElem = event.currentTarget
    const generationNumber = $(targetElem).attr('data-number')

    if (!$(targetElem).hasClass('active')){
        $('.course-item.active').removeClass('active')
        $(targetElem).addClass('active')
        $('div[id^="generation_content_"]').addClass('dp-hidden');

        if($(`#generation_content_${generationNumber}`).length) {
            $(`#generation_content_${generationNumber}`).removeClass('dp-hidden');
        }else {
            const data = {
                'code': code,
                'number': generationNumber
            }
            $.ajax({
                url: '/course/api/content/',
                type: 'GET',
                data: data,
                success: (response) => {
                    $('.course-tab-area').after(`<div class="course-container" id="generation_content_${generationNumber}">${response}${$('#course_curriculum').clone().wrapAll("<div/>").parent().html()}</div>`);
                    InitContent(generationNumber);
                }
            })
        }
        // 체크
        $('#select_number' + generationNumber).prop('checked', true);
        $('#popup_select_number' + generationNumber).prop('checked', true);
        // 기수별 상세내용
        $(`div[data-number="${generationNumber}"]`).not('.active').addClass('active');
        $(`div[id^="button_box"]`).addClass('dp-hidden');

        // 버튼교체
        $(`#button_box${generationNumber}`).removeClass('dp-hidden');
        $(`#button_box_sticky${generationNumber}`).removeClass('dp-hidden');

        // 문구 교체
        let currentButton = $(`#button_box${generationNumber}`).find('button');
        let changeElement = $('.course-copyright').find('.caption1');
        if($(currentButton).html().indexOf('상담') > -1) {
            $(changeElement).html('무료로 상담받고, 현업 강사님과 함께 실무 노하우와 스킬을 마스터하세요.')
        } else if ($(currentButton).html().indexOf('출시알림') > -1) {
            $(changeElement).html('출시알림 신청하고 다음 강의를 제일 먼저 만나보세요. ')
        } else {
            $(changeElement).html('할인가 확인하고, 현업 강사님과 함께 실무 노하우와 스킬을 마스터하세요.')
        }

        // 라벨 교체
        $('.offline-label-box').addClass('dp-hidden');
        $(`div.offline-label-box[data-target="${generationNumber}"]`).removeClass('dp-hidden');
        // 가격 교체
        ChangePrice (targetElem, generationNumber);

    }
    $(targetElem).find('input[type="radio"]:checked').each((index, el) => {
        ChangeCart(el);
    })

    selectGeneration = $('.course-item.active')
})

$('.course-tab-item').on('click', (event) => {
    isCurriculum = false;
    isClick = true;
    $('.course-tab-item.active').removeClass('active')
    const targetElem = event.currentTarget
    const generationNumber = $('.course-item.active').attr('data-number')

    $(targetElem).addClass('active')
    $(`#generation_content_${generationNumber}`).removeClass('dp-hidden')
    //앵커 이벤트
    let pageId = $(targetElem).attr('target');
    let gap = 80;
    if ($('.course-tab-item').index(targetElem) == 0){
        gap = 104;
    }
    if ($(pageId).length) {
        $('html, body').stop().animate({scrollTop : $(`#generation_content_${generationNumber}`).find(pageId).offset().top - gap}, 1000, 'swing', ()=>{ setTimeout(()=> {isClick = false;}, 100); });
    }
})

// 현장강의/온라인라이브 체크
$('.course-item-list').on('change', 'input[name^="howto"]',(e) => {
    let value = e.target.value;
    // 상단카드/팝업 동기화
    $(`input[name="${e.target.name}"]`).not(':checked').each((index, el) => {
        if(el.value == value) {
            $(el).prop('checked', true);
        }
    });
    // 강의장 교체
    $('.class-room-' + e.target.name.replace('howto', '')).each((index, el) => {
        $(el).toggleClass('dp-hidden');
    })
    // 가격 교체
    $('.price-area').addClass('dp-hidden');
    let selectProduct = $(e.target).val();
    $(`div.price-area[data-product="${selectProduct}"]`).removeClass('dp-hidden');
})

$('.btn-online-preview').on('click', () => {
    $('#course_preview_popup').removeClass('dp-hidden')
})

InitContent(firstGeneration);
