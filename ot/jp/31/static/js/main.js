(function($) {
 
$(function () {
    var display = function () {
    if ($(this).scrollTop() > 150) { //scroll量
            $(".Bnr").fadeIn();
        } else {
            $(".Bnr").fadeOut();
        }
    };
    $(window).on("scroll", display);
    //click
    $(".Bnr p.close a").click(function(){
    $(".Bnr").fadeOut();
    $(window).off("scroll", display);
    });
});
 
})(jQuery);