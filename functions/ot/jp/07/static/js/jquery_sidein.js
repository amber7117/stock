//menu
$(document).ready(function() {
 var btn = $('.js_sideinopen');
 var closebtn = $('.js_sideinclose');
 var page = $('#js_sideinbase');
 page.removeClass('active').fadeOut();
 var h = window.innerHeight;
 $('.js_sidein').removeClass('active');
 $('body').removeClass('js_sideinnow');
/*
 $(window).resize(function() {
  h = window.innerHeight;
  page.removeClass('active').fadeOut();
  $('.js_sidein').removeClass('active');
  $('body').removeClass('js_sideinnow');
 });
*/
 btn.each(function() {
  var href = $($(this).attr('href'));
  var contents = href.find('.js_sidein');
  $(this).on('click', function() {
//?嬐録橪????潿???懁?墳???橋???
form_action();
//?嬐録橪????潿???懁?墳???寙???
   if ($('body').hasClass('js_sideinnow')) {
    page.removeClass('active').fadeOut();
   } else {
    $('body').addClass('js_sideinnow');
   }
   href.fadeIn(0).addClass('active');
   $(document).on('click touchend', function(event) {
    if ((!$(event.target).closest('.js_sidein').length) && (!$(event.target).closest('.ui-widget-overlay').length) && (!$(event.target).closest('.ui-dialog').length)) {
     href.removeClass('active').fadeOut();
     $('body').removeClass('js_sideinnow');
    }
   });
   closebtn.on('click', function() {
    href.removeClass('active').fadeOut();
    $('body').removeClass('js_sideinnow');
   });
/*
   $(window).resize(function() {
    h = window.innerHeight;
    page.removeClass('active').fadeOut();
    $('.js_sidein').removeClass('active');
    $('body').removeClass('js_sideinnow');
   });
*/
  });
 });
//?嬐録橪????潿???懁?墳???橋???
form_action();
function form_action() {
$('.form_action').each(function() {
var action_base = $(this);
var action_input = action_base.find('.form_action_input').fadeIn(0);
var action_conf = action_base.find('.form_action_conf').fadeOut(0);
var action_comp = action_base.find('.form_action_comp').fadeOut(0);
action_input.find($('form')).submit(function() {
if($(this).attr('action') == "#"){
action_input.fadeOut(0);
action_conf.fadeIn();
return false;
}
});
action_conf.find($('form')).submit(function() {
if($(this).attr('action') == "#"){
action_conf.fadeOut(0);
action_comp.fadeIn();
return false;
}
});
});
}
//?嬐録橪????潿???懁?墳???寙???
});
//lineEffect
$(document).ready(function() {
 $(".lineEffect").each(function() {
  var int = 300;
  var base = $(this);
  $(window).scroll(function(){
   var wh = $(this).height();
   var ws = $(this).scrollTop();
   var offset = base.offset().top;
   int = wh / 3;
   var int2 = wh / 2;
   if(ws > (offset - wh) + int){
    base.addClass('active');
   }else{
   }
   if(ws > (offset - wh) + int2){
    base.addClass('active2');
   }
  });
 });
});
//scroll
$(document).ready(function() {
 $('a[href^=#]').click(function() {
 var speed = 400;
 var href= $(this).attr("href");
 var target = $(href == "#" || href == "" ? 'html' : href);
 var position = target.offset().top;
 $('body,html').animate({scrollTop:position}, speed, 'swing');
 return false;
 });
});
