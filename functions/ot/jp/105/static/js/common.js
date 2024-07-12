// JavaScript Document

/* --------------------------------------------------------
scroll
-------------------------------------------------------- */
$(function () {
  $('a[href^="#"]').click(function () {
    let speed = 500;
    let href = $(this).attr("href");
    let target = $(href == "#" || href == "" ? "html" : href);
    if (window.matchMedia("(max-width: 440px)").matches) {
      let position = target.offset().top - 300;
      $("html, body").animate({ scrollTop: position }, speed, "swing");
    } else {
      let position = target.offset().top;
      $("html, body").animate({ scrollTop: position }, speed, "swing");
    }
    return false;
  });
});

/* --------------------------------------------------------
video pc<=>mobile
-------------------------------------------------------- */
var defaultQueryList = {
  mobile: matchMedia("(max-width: 768px)"),
  pc: matchMedia("(min-width: 769px)")
}

function routingByBreakpoint(sourceList) {
  for (var i = 0, l = sourceList.length; i < l; i++) {
    var source = sourceList[i];
    if (!(source.dataset.query && defaultQueryList[source.dataset.query] && source.dataset.src)) continue;
    if (!(defaultQueryList[source.dataset.query].matches)) continue;
    var newSource = document.createElement("source");
    newSource.src = source.dataset.src;
    source.parentElement.appendChild(newSource);
  }
}

(function () {
  var elemList = document.getElementsByClassName("breakpoint");
  for (var i = 0, l = elemList.length; i < l; i++) {
    var sourceList = elemList[i].getElementsByTagName("source");
    routingByBreakpoint(sourceList);
  }

})();


/* --------------------------------------------------------
fade
-------------------------------------------------------- */
$(function () {
  $(window).scroll(function () {
    $('.u-fade_top01,.u-fade_top02,.u-fade_top03,.u-fade_top04').each(function () {
      var targetElement = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if (scroll > targetElement - windowHeight + 0) {
        $(this).css('opacity', '1');
        $(this).css('transform', 'translateY(0)');
      }
    });
  });
});

$(function () {
  $(window).scroll(function () {
    $('.u-fade_left01,.u-fade_right01').each(function () {
      var targetElement = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if (scroll > targetElement - windowHeight + 0) {
        $(this).css('opacity', '1');
        $(this).css('transform', 'translateX(0)');
      }
    });
  });
});

$(function () {
  $(window).scroll(function () {
    $('.u-scale').each(function () {
      var targetElement = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if (scroll > targetElement - windowHeight + 0) {
        $(this).css('opacity', '1');
      }
    });
  });
});

var $target = $('.u-scale');
var offset = 100;
$(window).on('scroll', function () {
  var scroll = $(window).scrollTop();
  var h = $(window).height();
  $target.each(function () {
    var pos = $(this).offset().top;
    if (scroll > pos - h + offset) {
      $(this).addClass('active');
    }
  })
}).trigger('scroll');