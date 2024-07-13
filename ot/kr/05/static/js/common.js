$(function () {
    $(".search-area .input-box-search input").focus((e) => {
        $(e.target).parents('.search-area').find('.search-keyword-wrap').fadeIn(500);
    });
    $(".search-area .input-box-search input").blur((e) => {
        $(e.target).parents('.search-area').find('.search-keyword-wrap').fadeOut(500);
    });

    $(window).scroll(() => {
        if ($(window).scrollTop() > $(window).height()) {
            $('#btn_to_top').fadeIn();
        } else {
            $('#btn_to_top').fadeOut();
        }
    })

    const eventSlide = new Swiper('.event-slide', {
        // Optional parameters
        slidesPerView: "auto",
        effect: "fade",
        loop: true,
        watchOverflow: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        // If we need pagination
        pagination: {
            clickable: true,
            el: '.swiper-pagination',
        },
    });
})

function toggleClass(targetElem, originClassName, changeClassName) {
    targetElem.removeClass(originClassName)
    targetElem.addClass(changeClassName)
}

function toggleOneClass(targetElem, toggleClass) {
    if (targetElem.hasClass(toggleClass)) {
        targetElem.removeClass(toggleClass)
    } else {
        targetElem.addClass(toggleClass)
    }
}

function RemoveComma(str) {
    return Number(str.replace('원', '').split(",").join(""));
}

function AddComma(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Clip(text) {
    let textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = text;
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
}

function hide(element) {
    if (element !== null) {
        element.classList.add('dp-hidden');
    }
}
function show(element) {
    if (element !== null) {
        element.classList.remove('dp-hidden');
    }
}
const currentOn = $('#bottom-navigation').find('.on')[0];

// 더보기
$('#more_icon').on('click', (e) => {
    $('#layer_more').removeClass('dp-hidden');
    $('body').addClass('pinned');
    $(currentOn).removeClass('on');
    $(e.currentTarget).parent().addClass('on');
    $('#mobile_search').parent().removeClass('on');
    $('#layer_course').addClass('dp-hidden');
    $('#layer_search').addClass('dp-hidden');
})

// 강의찾기 레이어
$('#mobile_search').on('click', (e) => {
    $('#layer_more').addClass('dp-hidden');
    $('#layer_course').removeClass('dp-hidden');
    $(currentOn).removeClass('on');
    $('#more_icon').parent().removeClass('on');
    $(e.currentTarget).parent().addClass('on');
    $('#layer_search').addClass('dp-hidden');
})

$('.btn-search').on('click', () => {
    let searchLayer = $('#layer_search')
    searchLayer.toggleClass('dp-hidden');
    searchLayer.find('input[name="q"]').focus()
    $('body').toggleClass('pinned')
})

$('.btn-profile').on('click', (e) => {
    $(e.currentTarget).toggleClass('active');
})

$('.btn-logout').on('click', () => {
    $('#layer_logout').removeClass('dp-hidden');
})

$('.cancel-button').on('click', (e) => {
    $(e.target).parents('.layer-alert').addClass('dp-hidden');
})

$('html').click(function (e) {
    if ($('.btn-profile').hasClass('active') && $(e.target).parents('.profile-menu-area').length < 1 && $(e.target).parents('.btn-profile').length < 1) {
        $('.btn-profile').removeClass('active');
    }
})

$('.popup-closed').on('click', (event) => {
    if (!location.pathname.includes('/price/cart/') && !location.pathname.includes('/auth/course/')) {
        ChannelIO('showChannelButton');
    }
    const targetElem = event.currentTarget;
    const targetPopup = $(targetElem).parents('div[class*="layer-popup-wrap"]')
    const bodyElem = $('body')
    if (targetPopup.hasClass('active')) {
        targetPopup.removeClass('active');

    } else {
        targetPopup.addClass('dp-hidden');
        bodyElem.removeClass('pinned')
        if ($(targetElem).parents('#layer_more').length || $(targetElem).parents('#layer_course').length) {
            $(currentOn).addClass('on');
            $('#more_icon').parent().removeClass('on');

            if ((window.location.href.indexOf('course') == -1 && window.location.href.indexOf('category') == -1) || window.location.href.indexOf('detail') != -1 || window.location.href.indexOf('auth') != -1) {
                $('#mobile_search').parent().removeClass('on');
            }
        } else if ($(targetElem).parents('#layer_account').length){
            $('#account_form .form-box').each(function (index, item) {
                $(item).addClass('form-box-readonly')
                $(item).find('.input-text').attr('readonly', true)
                if ($(item).find('.input-text').attr('data-prev')){
                    $(item).find('.input-text').val($(item).find('.input-text').attr('data-prev'))
                }
            })

            if ($('input[name="account_image"]').attr('data-prev')){
                $('input[name="account_image"]').val('')
                $('input[name="account_image"]').next('label').html($('input[name="account_image"]').attr('data-prev')+'<span>파일 선택</span>')
            }

            if ($('input[name="certificate"]').attr('data-prev')){
                $('input[name="certificate"]').val('')
                $('input[name="certificate"]').next('label').html($('input[name="certificate"]').attr('data-prev')+'<span>파일 선택</span>')
            }


            $(targetElem).parents('#layer_account').addClass('dp-hidden')
            $('#edit_account_button').removeClass('dp-hidden')
            $('#save_account_button').addClass('dp-hidden')
        }
    }
})

$('.accordion-list li:not(".lesson-room-wrap .accordion-list li")').on('click', (event) => {
    const targetElem = $(event.currentTarget)
    toggleOneClass(targetElem, 'active')
})

$('.disallowd-button').on('click', (event) => {

    $.ajax({
        url: '/website/api/disallow/',
        type: 'POST',
        data: { 'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val() },
        statusCode: {
            200: function (response) {
                $('#event_layer').addClass('dp-hidden')
            },
        }
    })
})

$('.btn-channel-talk').on('click', () => {
    ChannelIO('showMessenger');
});

$("#btn_to_top").on("click", function () {
    $("html, body").animate({ scrollTop: 0 }, '500');
});


$('.mobile-back').on('click', () => {
    const prevUrl = document.referrer
    const nowPage = location.pathname

    if (prevUrl.includes(location.origin)) {
        if (nowPage.includes('/auth/course/') && prevUrl.includes('/auth/course/')) {
            const prevPathname = prevUrl.replaceAll(location.origin, '')
            const prevUrlList = prevPathname.slice(1, -1).split('/')
            const nowUrlList = nowPage.slice(1, -1).split('/')

            if (prevUrlList.length === 2 && nowUrlList.length >= 4) {
                window.close()
            }
        }
        history.back()
    } else {
        location.href = location.origin
    }
})

function DownloadLargeFile(url, generation_pk) {
    $.ajax({
        url: '/auth/course/',
        type: 'POST',
        data: { 'generation_pk': generation_pk, 'csrfmiddlewaretoken': $("input[name='csrfmiddlewaretoken']").val() },
        statusCode: {
            200: function () {

            },
        }
    })

    window.open(url)
}