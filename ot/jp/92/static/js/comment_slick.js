$(function(){
    //乽庴島惗偺惡乿僗儔僀僟乕
    $('.comment_slick').slick({
        arrows: true,
        autoplay: true,
        autoplaySpeed: 5000,
        swipeToSlide: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots: true,
        responsive: [{
            breakpoint: 599,
            settings: {
                arrows: false,
                dots: false,
                slidesToShow: 1,
                centerMode: true,
                centerPadding: '20px'
            }
        }]
    });
});