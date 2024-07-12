$(document).ready(function(){
  // 普通
  $('.slider-ctrl').slick({
    autoplay: true,         //自動再生
    autoplaySpeed: 3000,    //自動再生のスピード
    speed: 1000,	            //スライドするスピード
    dots: false,             //スライドしたのドット
    arrows: true,           //左右の矢印
    infinite: true,         //スライドのループ
    pauseOnHover: false,    //ホバーしたときにスライドを一時停止しない　
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // ゆっくり
  $('.slider-ctrl__slow').slick({
    autoplay: true,         //自動再生
    autoplaySpeed: 3000,    //自動再生のスピード
    speed: 1800,	            //スライドするスピード
    dots: false,             //スライドしたのドット
    arrows: true,           //左右の矢印
    infinite: true,         //スライドのループ
    pauseOnHover: false,    //ホバーしたときにスライドを一時停止しない　
    slidesToShow: 2,
    slidesToScroll: 2,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // PCでも1枚スライド
  $('.slider-ctrl__one').slick({
    autoplay: true,         //自動再生
    autoplaySpeed: 3000,    //自動再生のスピード
    speed: 1000,	            //スライドするスピード
    dots: false,             //スライドしたのドット
    arrows: true,           //左右の矢印
    infinite: true,         //スライドのループ
    pauseOnHover: false,    //ホバーしたときにスライドを一時停止しない　
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  // 一時停止・再生　デザイン変更ありの場合(SVG画像使用)
  $('#js-stop').on('click', function() {
    $('.slider-ctrl').slick('slickPause');
    $('.slider-ctrl__slow').slick('slickPause');
    $('.slider-ctrl__one').slick('slickPause');
    if ($('.js-ctrl-class.is-active').length != 0) {
      $('.js-ctrl-class.is-active').removeClass('is-active');
    }
    $(this).addClass('is-active');
  });
  
  $('#js-play').on('click', function() {
    $('.slider-ctrl').slick('slickPlay');
    $('.slider-ctrl__slow').slick('slickPlay');
    $('.slider-ctrl__one').slick('slickPlay');
    if ($('.js-ctrl-class.is-active').length != 0) {
      $('.js-ctrl-class.is-active').removeClass('is-active');
    }
    $(this).addClass('is-active');
  })

});

