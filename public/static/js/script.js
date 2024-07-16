let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", vh + "px");
window.addEventListener("resize", function () {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
});

$(function () {
  Main.init();
});

var Main = {
  init: function (e) {
    Main.cardswip();
    Main.member();
    Main.contswip();
    Main.count();
    Main.popCommon();
  },
  popCommon: function(){
    $('.view_more').on('click', function () {
        $('.popup_wrap').show();
    })
    $('.popup_wrap .close, .popup_wrap .bg').on('click', function () {
        $('.popup_wrap').hide();
    })

    $('.view_more_detail').on('click', function () {
      $('.popup_wrap_detail').show();
  })
  $('.popup_wrap_detail .close, .popup_wrap_detail .bg').on('click', function () {
      $('.popup_wrap_detail').hide();
  })
  },
  count: function () {
  },
  cardswip: function () {
    const card = new Swiper(".card_slider", {
      loop: true,
      slidesPerView: "auto",
      loopAdditionalSlides: 1,
      spaceBetween: 20,
      // centeredSlides: true,
      speed:1000,
      autoplay: 
      {
      delay: 1000,
      disableOnInteraction: false,
      },
      pagination: {
        el: ".sliders__pagination_card",
        clickable: true,
      },
      breakpoints: {
        850: {
          slidesPerView: 1,
          spaceBetween: 10,
          centeredSlides: true,
        },
      },
    });
  },
  member: function () {
    const category = new Swiper(".member_slider", {
      speed:1000,
      loop: true,
      // paginationClickable: true,
      centeredSlides: true,
      slidesPerView: '5',
      initialSlide: 0,
      loopAdditionalSlides: 1,
      spaceBetween: 48,
      autoplay: 
      {
      delay: 1000,
      disableOnInteraction: false,
      },
      pagination: {
        el: ".sliders__pagination",
        clickable: true,
      },
      breakpoints: {
        1600: {
          slidesPerView: '4',
          spaceBetween: 48,
          centeredSlides: true,
        },
        850: {
          slidesPerView: '2',
          spaceBetween: 72,
          centeredSlides: true,
        },
        600: {
          slidesPerView: "2",
          spaceBetween: 42,
          centeredSlides: true,
        },
      },
    });
  },
  contswip: function () {
    const conts = new Swiper(".cont_slider", {
      allowTouchMove: false,
      direction: "vertical",
      loop: true,
      slidesPerView: 6,
      speed:1000,
      autoplay: 
      {
      delay: 1000,
      },
    });
  },
};

