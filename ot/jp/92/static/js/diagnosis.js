"use strict";

// JavaScript Document
//=============================================
// jQuery
//=============================================
const diagnosis = $('.diagnosis-box');
const controller = $('.diagnosis-nav');
const pageFrame = $('.diagnosis-frame');
const pageWrap = $('.diagnosis-pages');
const pages = $('.diagnosis-pages__item');
const buttons = $('button');
const result = $('#result');
const container = $('#diagnosis');
const scrollStopTrigger ='js-no-scroll-top';
const resultClass ='is-diagnosis-ended';

let winW;
let dis;
let dis2;

let qLen = 5;
let parentId = 1;
let currentPage = 0;
let buttonsClick = false;

let resizeTimer = null;

//=============================================
// slide
//=============================================
/*==== frame set ====*/

$(window).on('load', function () {
  winW = container.width();
  dis = Math.floor(winW);
  dis2 = dis;
  diagnosis.css({
    width: dis,
    height: 'auto'
  });
  pageFrame.css('width', dis2);
  pageWrap.css('width', dis2 * qLen);
  pageWrap.css('margin-left', -(dis2 * currentPage));
  pages.css('width', dis2);
  result.css('width', dis2);
  result.css('top', $('main').height() + 1);
  $('.diagnosis-box__slide').fadeIn('fast');
});//load

$(window).on('resize', function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    winW = container.width();
    dis = Math.floor(winW);
    dis2 = dis;
    diagnosis.css({
      width: dis,
      height: 'auto'
    });
    pageFrame.css('width', dis2);
    pageWrap.css({
      width: dis2 * qLen,
      marginLeft: -(dis2 * currentPage)
    });
    pages.css('width', dis2);
    result.css('width', dis2);

    if (result.css('top') == '0px') {
      void 0;
    } else {
      result.css('top', $('main').height() + 1);
    }

    $('div.sec_btn_cource_top').css({
      width: dis,
      paddingLeft: 0,
      paddingRight: 0
    });

    if (parentId == 1 && buttonsClick == false) {
      pageWrap.css('margin-left', 0);
    } else {
      pageWrap.css('margin-left', -(parentId * dis2));
    }

    if (result.css('top') == '0px') {
      diagnosis.css('height', $('.diagnosis-result').filter(':visible').outerHeight() + 10);
    }
  }, 200);
});//resize

/*==== slide animate ====*/
$(function () {
  let pt = 0;
  let val;

  buttons.on('click', function (event) {
    buttonsClick = true;
    val = parseInt($(event.currentTarget).val());
    pt += val;
    pt > 0 ? pt : 0;
    parentId = parseInt($(event.currentTarget).closest('.diagnosis-pages__item').attr('id').match(/[0-9]/));

    if (parentId == 5) {//case result
      if (!container.hasClass(scrollStopTrigger)) {
        $('body').animate({scrollTop: 0}, 0);
        $('html').animate({scrollTop: 0}, 0);
      }
      diagnosis.addClass(resultClass);
      result.css('display', 'block');
      var targetObj;

      if (pt == 0 || pt == 1) {
        targetObj = $('.diagnosis-result.per40');
      } else if (pt == 2 || pt == 3) {
        targetObj = $('.diagnosis-result.per60');
      } else if (pt == 4) {
        targetObj = $('.diagnosis-result.per80');
      } else if (pt == 5) {
        targetObj = $('.diagnosis-result.per100');
      } else {
        targetObj = $('.diagnosis-result.40');
      }

      targetObj.css('display', 'block');
      result.delay(300).animate({top: 0}, 500, 'swing', function () {
        $(this).css('border-top', 'none');
      });

      diagnosis.animate({height: targetObj.outerHeight() + 10}, 500, 'linear');
    } else {//no result
      pageWrap.animate({
        marginLeft: parseInt(pageWrap.css('margin-left')) - dis2 + 'px'
      }, 'normal');

      controller.find('.is-current').removeClass('is-current');
      controller.find('.diagnosis-nav__item').eq(parentId).addClass('is-current');
    }

    return parentId;
  });
});//jQuery