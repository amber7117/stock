// performances_slick_lp
$(function(){
    $('.performances_slick').slick({
      arrows: true,
      autoplay: true,
      autoplaySpeed: 2500,
      swipeToSlide: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      responsive: [{
        breakpoint: 599,
        settings: {
          slidesToShow: 1,
          centerMode: false
        }
      }]
    });
  
    $('.performances_slick').on('setPosition', function(){
      var maxHeight = 0;
      $('.performances_slick .personal_data').each(function(idx, elem) {
        $(elem).height('auto');
        var height = $(elem).height();
        if(maxHeight < height){ maxHeight = height;}
      });
      $('.performances_slick .personal_data').height(maxHeight);
    });
  });
  