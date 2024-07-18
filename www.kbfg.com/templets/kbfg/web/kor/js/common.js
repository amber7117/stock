var loadMasonryCallbackFunc = null;


;(function($) {
    'use strict';

    /* DEFINE */
    $.isLiveMode = false;
    var printLog = $.printLog;
    var DEF_MO_BREAK_POINT = 1024;
    window.KBFG = {
        $grid : null,
        isMobile : function(e) {
            return (window.innerWidth < e);
        },
        headerScrollTimer: null,
        headerScrollIntervalTimer : null,
        debounceScrollTimer : null,
        cardContsFirstLoadedTimerArr : [],
        isLoadingComplete : false,
        openLoader : function() {
            $('html, body').css('overflow', 'hidden');
            $('.l-loader').addClass('active');
        
            $('#loading-end').text('');
            $('#loading-start').text('Loading');
            setTimeout(function () {
                $('#loading-start').attr({'aria-busy': 'true' });
            }, 100);
        },
        closeLoader : function() {
            $('#loading-start').attr('aria-busy', 'false').text('');
            $('#loading-end').text('Loading complete');
            setTimeout(function () {
                $('#loading-end').text('');
                $('.l-loader').removeClass('active');
            }, 100);
        }
    };

    /* VARIABLE : selector */    
    var elementOfMainMoRolling = document.querySelector('.c-rolling--mo');

    var $selectBoxElements = $('.select-row'),
        $currentPlayer = undefined,
        $currentVideo = undefined,
        $currentProgressbar = undefined,
        $mainKvList = $('.visual-swiper .swiper-slide'),
        kvPaginationLists = document.querySelectorAll('.c-main-swiper-button .swiper-pagination-bullet'),
        btnAutoPlay = document.querySelector('.swiper-player-button'),
        progressbars = document.querySelectorAll('.progress-bar .progress-inner'),
        iframe = document.querySelector('.c-iframe'),
        header = document.querySelector('.header'),
        headerBanner = document.querySelector('.header__banner'),
        $backToTop = $('.back-to-top'),
        footer = document.querySelector('.footer');

    /* ID */
    var timerScroll = undefined,
        timerBounceActive = undefined;

    /* STATE */
    var lastScrollPositionY = 0,
        responsiveSwiper = undefined,
        startIndexForGroup = 0,
        dataEnded = false,
        isContsFirstLoaded = false,
        canIPushTotalMenuBtn = true,
        headerIntervalEnabled = false,
        isIosSafari = $.browser.ios !== undefined && $.browser.safari !== undefined,
        isScrollBounceActive = false,
        maxScrollAmount = 0,
        currentScrollAmount = 1;

    /* VARIABLE : any */
	var yOffset = 0,                         // window.pageYOffset 대신 쓸 변수
        viewportWidth = $(window).width(),
        screenWidth = $(window).outerWidth(),
        viewportHeight = $(window).height(), // Viewport Height
        windowInnerHeight = window.innerHeight,
        prevScrollHeight = 0,                // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
        currentScene = 0,                    // 현재 활성화된 씬(scroll-section)
        enterNewScene = false,               // 새로운 scene이 시작된 순간 true
        accel = 0.2,
        delayedYOffset = 0,
        reqAniFrmId = null,
        reqAniFrmState = false,
        reqVideoAniFrmId = null,
        reqHorizScrollFrmId = null,
        isPassingSticky = false,
        currentScrollTop = 0,
        lastScrollTop = 0,
        isScrollDown = true,
        loadedImageCount = 0,
        loadedIframeCount = 0,
        checkIframeCount = 0,
        isSkipVideoPlay = false,
        isLoadedVideos = false,
        isLoadedImages = false,
        isLoadedIframes = false,
        isDisplayHeader = true,
        curRepeatCountPlayVideoImages = 0,        
        kvSavedRealDuration = [],
        currentPlayIndex = 0,
        reqVideoRepeatId = null,
        defDistanceForThreshold = 3,
        bufferHeightToBackToTop = 10,
        footerRect = 0,
        iosScrollBounceBufferTime = 300, //1000,
        currentSwipeInfo = { 
            init:function() {
                this.isNext = false;
                this.lastPos = 0;
                this.isSwipping = false;
                this.isLoop = false;
            },
            isNext:false, lastPos:0, isSwipping:false, isLoop:false
        },
        timerSwiping = null,
        IEMouseDragDirection = null,
        visualSwiper = null,
        kvImages = [
            {
                currentTime:0,
                duration:420  // 초당 * 60
            }
        ],
        sceneInfo = [
            {
                // 0
                positionType: 'sticky',
                heightSize: 3.8,
                scrollHeight: 0,
                objs: {
                    container: document.querySelector('#section_0'),
                    stickyEl: document.querySelector('#section_0 .sticky-elem'),
                    rolling: document.querySelector('#section_0 .c-rolling'),
                    rollingWrap: document.querySelector('#section_0 .c-rolling__wrap'),
                    mobileCoverEl: document.querySelector('#section_0 .cover-mo'),
                    header: document.querySelector('.header'),
                },
                values: {
                    rolling: [0, 0, {start:0, end:0}],
                },
                resources : {
                    marginBottomOfRollingElememnt : 88,
                    marginBottomOfGNB : 40,
                    heightOfGNB : 100,
                },
            },
            {
                // 1
                positionType: 'sticky',
                heightSize: 3.8,
                scrollHeight: 0,
                objs: {
                    container: document.querySelector('#section_1'),
                    stickyEl: document.querySelector('#section_1 .sticky-elem'),
                    rolling: document.querySelector('#section_1 .c-rolling'),
                    rollingWrap: document.querySelector('#section_1 .c-rolling__wrap'),
                    largeCard: document.querySelector('#section_1 .c-card--large-size .c-card__figure'),
                },
                values: {
                },
                resources : {
                    marginBottomOfRollingElememnt : 88,
                    marginVerticalOfleftRollingWrap : 530,
                },
            },
            {
                // 2
                positionType: 'normal',
                scrollHeight: 0,
                objs: {
                    container: document.querySelector('#section_2'),
                    content: document.querySelector('#section_2 .section__body'),
                },
                values: {
                },
                resources : null,
            }
        ];

    /* INITIALIZE */
    // Document Load
    window.addEventListener('load', initialize()) ;

    /* FUCNTIONS */
    function initialize() {
        //printLog(document.title + ' initialize start...');
        //printLog('$.browser.os = ' + $.browser.os);

        $._smoothScroll.isScrollBlock = false;
        $(window).scroll($._smoothScroll.scroll());
        lastScrollPositionY = window.pageYOffset;
        $.mobileTouch.init('body', true, controlTouchToEvent);

        if($('.main').length > 0) {
            lottie.loadAnimation({
                container: document.querySelector('.loader'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../js/ajax/loader.json'
            });
        }

        if($('.l-loader__cf').length > 0) {
            lottie.loadAnimation({
                container: document.querySelector('.l-loader__cf .loader'),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/js/ajax/loader.json'
            });
        }

        // 주가 정보 세팅
        if(window.location.href.indexOf('10.200.93.141') < 0) {
            if($('.c-iframe').length > 0) iFrameResize({ log: false }, '.c-iframe');
            if($('.c-iframe-stock').length > 0) iFrameResize({ log: false }, '.c-iframe-stock');
        }

        checkIE();
        controlMainLoaded();
        controlSubLoaded();
        initMasonry();
        initUpdateMainBgByMobile();
        modifyInputPlaceholder(); // yjbaek 231027 : placeholder modify

        highlightLastRowElementInTotalMenu();
        setWindowInnerHeight();
        checkVisibility('scroll-visible', 100, 50);
        // checkVisibility('grid-item', 100, 100);
        detectDragDirectionToSwiper();
        controlGnb();
        closeHeaderBanner();
        controlToBackToTopBtn();
        //identifyMainHeader();

        controlMainKvSwiper();
        controlBgScaleEffect();
        disableHeaderBannerIfTitleHidden();
        setTimeout(function () {
            scrollToActiveItemInHorizontalScroll();
        }, 300);

        /* EVENTS */
        {
            $(window).on('load', onLoadWindow);
            $(window).on('resize', onResizeWindow);
            $(window).on('mousewheel DOMMouseScroll', onWheelWindow);
            window.addEventListener('scroll', function(e) {
                controlScrollBounce();
                checkToScrollDown();
                checkVisibilityToBackToTop();
                controlHeader();

                //clearTimeout(KBFG.debounceScrollTimer);
                if($('.c-masonry').length > 0) {
                    revealContentOnScroll('grid-item');
                }

                yOffset = window.pageYOffset;
                windowInnerHeight = window.innerHeight; //gt.yang 231027 : ios/ipados에서 높이 인식 문제로 scroll할 때도 추가
                scrollLoop();
                checkVisibility('scroll-visible', 100, 50);
                checkVisibility('grid-item', 100, 100);

                if (!reqAniFrmState) {
                    reqAniFrmId = requestAnimationFrame(repeatAnimation);
                    reqAniFrmState = true;
                }
            });
            $('.dim').removeClass('dim--blur');
            openHeader();
            hiddenCloseGnbToHeader();
            controlTabs();
            controlAccordion();
            initAccordionInTotalMenu();
            initSwiper();
            initPopup();
            setPrint();
            calculateDistanceFromEsgTab();
            initHorizontalScroll();

            // $('.c-btn--more .c-btn__link').on('click', function() {
            //     setAndExecuteCallback(null);
            // });

            // $('.history-year-btn').on('click', function() { // 그룹연혁 년도 버튼 클릭
            //     openHistoryDropMenu();
            // });

            // yj.baek 20231116 : header show bug fixed
            window.addEventListener('wheel', function(event) {
                if($('.main').length > 0) return;
                if(KBFG.isMobile(DEF_MO_BREAK_POINT)) return;

                if($('.header').hasClass('up')) {
                    if(event.deltaY < 0) {
                        clearTimeout(timerScroll);
                        timerScroll = setTimeout(function() { $('.header').removeClass('up'); }, 500); 
                    }
                }
            });
        };
    }
    
    function initHorizontalScroll() {
        var targetClass = $('.can-h-scroll');

        if(targetClass.length === 0) return;

        setTimeout(function() {
            var targetTableClass = $('.can-h-scroll .detail-body .disclosure');

            if(targetTableClass.length > 0) {
                if(targetTableClass.length > 1)  {
                    targetClass.find('.detail-body .disclosure').parent().addClass('active-horizontal-scroll');
                    targetClass.find('.detail-body .disclosure').parent().parent().addClass('active-horizontal-scroll-parent');
                } else if (targetTableClass.length === 1) {
                    targetTableClass.wrap('<div class="single-table-wrap"></div>');
                    targetTableClass.addClass('active-horizontal-scroll');
                }
            }
        }, 1000);
    }

    function scrollToActiveItemInHorizontalScroll() {
        var scrollableList = document.querySelector('.lnb-box ul');
        var activeItem = document.querySelector('.lnb-box li.on');

        if(scrollableList !== null && activeItem !== null) {
            var firstChild = scrollableList.querySelector('li:first-child');

            if(firstChild !== null) {
                var activeItemOffsetLeft = activeItem.offsetLeft - firstChild.offsetLeft;
                //scrollableList.scrollLeft = activeItemOffsetLeft;
                maxScrollAmount = activeItemOffsetLeft;
                reqHorizScrollFrmId = requestAnimationFrame(repeatHorizentalScrollAnimation);
            }
        }
    }

    function repeatHorizentalScrollAnimation() {
        var scrollableList = document.querySelector('.lnb-box ul');
        
        currentScrollAmount = currentScrollAmount * 2;
        if(currentScrollAmount > maxScrollAmount) {
            scrollableList.scrollLeft = maxScrollAmount;
            cancelAnimationFrame(reqHorizScrollFrmId);
        }
        else {
            scrollableList.scrollLeft = currentScrollAmount;
            reqHorizScrollFrmId = requestAnimationFrame(repeatHorizentalScrollAnimation);
        }
    }

    function initUpdateMainBgByMobile() {
        if(document.querySelector('.main') === null) return;
    
        var coverElem = document.querySelector('.main .c-cover__img-mo');
        if(coverElem === null) return;

        var imageUrl = coverElem.getAttribute('src');
        var targetElem = document.querySelector('#br_area');

        if(targetElem !== null) targetElem.style.setProperty('--main-2session-mo-background-image', 'url("' + imageUrl + '") no-repeat'); // gt.yang 231027 : targetElem 있을 경우로 변경
    }

    function modifyInputPlaceholder() { // yjbaek 231027 : placeholder modify
        var lang = document.documentElement.lang;
        if(lang !== 'ko') {
            if($('.search-area .search-input').length >= 0) {
                if(KBFG.isMobile(450)) {
                    $('.search-area .search-input').attr('placeholder', 'Enter keywords.');
                }
            }
        }
    }

    function controlTouchToEvent(touchInfo) {
        //printLog('touchInfo', touchInfo);
        if($('.c-total-menu--mo').hasClass('open') === true) return;

        if(touchInfo.up === true || touchInfo.down === true) {
            $('.c-util').removeClass('active');
            $('.c-util__global').removeClass('active');
        }
    }

    function identifyMainHeader() {
        if($('.main').length > 0) {
            header.classList.add('header--main');
        }
    }

    function initMasonry() {
        if($('.c-masonry').length === 0) return false;

        // test
        //loadMasonryCallbackFunc = function() {console.log('test')};

        KBFG.$grid = $('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter : 19.5,
            percentPosition : true,
            horizontalOrder: false,
            visibleStyle: { transform: 'translateY(0)', opacity: 0 },
            hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
        });

        KBFG.$grid.imagesLoaded().progress( function() {
            KBFG.$grid.masonry('layout');
        });

        revealContentOnScroll('grid-item');
    }

    function controlMainKvSwiper() {
        if($('.main').length === 0) return false;

        visualSwiper = new Swiper('.visual-swiper', {
            spaceBetween: 0,
            slidesPerView: 1,
            loop: false,
            speed: 1000,
            touchRatio: KBFG.isMobile(DEF_MO_BREAK_POINT) ? 1 : 0,
            slideToClickedSlide: true,
            touchStartPreventDefault: false,
            effect: 'fade',
            // simulateTouch:false,
            grabCursor: 'true',
            allowTouchMove: 'true',
            fadeEffect: { crossFade: true },
            on: {
                init: function () {
                    updateScrollPosition();
                },
            }
        })

        if (KBFG.isMobile(DEF_MO_BREAK_POINT)) {
            var videos = document.querySelectorAll('.main .swiper-video');
            var videoSources = document.querySelectorAll('.main .swiper-video source');

            for (var i = 0; i < videos.length; i++) videos[i].pause();
            for (var i = 0; i < videos.length; i++) videos[i].load();
        }
        playVideo(0);

        if ($currentVideo !== null) {
            reqVideoRepeatId = requestAnimationFrame(updateProgressbar);
        }
        // click to pagination
        for (var i = 0; i < kvPaginationLists.length; i++) {
            kvPaginationLists[i].addEventListener('click', function (e) {
                var index = $(this).index();
                var currentSwiperImages = document.querySelectorAll('.swiper-slide--' + (index+1) + ' .swiper-image');
                changeKeyVisual(index, false);
                for (var i = 0; i < currentSwiperImages.length; i++) {
                    currentSwiperImages[i].classList.add('image-animation-reset');
                    setTimeout(function (element) {
                        return function () {
                            element.classList.remove('image-animation-reset');
                        };
                    }(currentSwiperImages[i]), 10);
                }
            });
            $(kvPaginationLists[i]).on('keyup', function (e) {
                if (e.keyCode === 13) {
                    var index = $(this).index();
                    var currentSwiperImages = document.querySelectorAll('.swiper-slide--' + (index+1) + ' .swiper-image');
                    changeKeyVisual(index, false);
                    for (var i = 0; i < currentSwiperImages.length; i++) {
                        currentSwiperImages[i].classList.add('image-animation-reset');
                        setTimeout(function (element) {
                            return function () {
                                element.classList.remove('image-animation-reset');
                            };
                        }(currentSwiperImages[i]), 10);
                    }
                }
            });
        }

        btnAutoPlay.addEventListener('click', clickBtnAutoPlay);

        visualSwiper.on('touchMove', function (e) {
            var currentPos = 0;
            currentSwipeInfo.isSwipping = true;

            if (KBFG.isMobile(DEF_MO_BREAK_POINT) !== true) return;
            if ($.browser.ie !== undefined)
                currentPos = e.clientX;
            else
                currentPos = e.changedTouches[0].pageX;

            if (currentSwipeInfo.isSwipping === true && currentSwipeInfo.lastPos === 0) {
                currentSwipeInfo.lastPos = currentPos;
                //console.log('touchMove : currentPos = ' + currentPos);
            }
            //console.log('touchMove : startX = ' + currentPos );
        });

        visualSwiper.on('touchEnd', function (e) {
            var currentPos = 0;

            if (KBFG.isMobile(DEF_MO_BREAK_POINT) !== true) return;
            if ($.browser.ie !== undefined)
                currentPos = e.clientX;
            else
                currentPos = e.changedTouches[0].pageX;

            if (currentSwipeInfo.isSwipping === true) {
                // console.log('touchEnd : currentPos = ' + currentPos + 'currentSwipeInfo.lastPos = ' + currentSwipeInfo.lastPos);
                // console.log('currentPlayIndex', currentPlayIndex);
                // change to force by mobile
                if (currentPos < currentSwipeInfo.lastPos) {
                    if (currentPlayIndex === $mainKvList.length - 1) {
                        //currentSwipeInfo.isLoop = true;
                        changeKeyVisual(0, true);
                    }
                }
                else {
                    if (currentPlayIndex === 0) {
                        //currentSwipeInfo.isLoop = true;
                        changeKeyVisual($mainKvList.length - 1, true);
                    }
                }
            }
        });

        visualSwiper.on('activeIndexChange', function (e) {
            //console.log('activeIndexChange : active index = ' + visualSwiper.activeIndex + " / currentSwipeInfo.isLoop:", currentSwipeInfo.isLoop);
            if (KBFG.isMobile(DEF_MO_BREAK_POINT) === true) {
                changeKeyVisual(visualSwiper.activeIndex, false);
            }
            var activeIndex = visualSwiper.activeIndex + 1;
            var swiperImage = document.querySelectorAll('.swiper-slide--' + activeIndex + ' .swiper-image');
            for (var i = 0; i < swiperImage.length; i++) {
                swiperImage[i].classList.add('image-animation-reset'); 
                setTimeout(function (element) {
                    return function () {
                        element.classList.remove('image-animation-reset');
                    };
                }(swiperImage[i]), 10);
            }
            currentSwipeInfo.init();
        });
    }

    function getCurrentSelector(index) {
        var addIndex = index + 1; // D : if dom에서 id를 0부터 시작한다면, +1 제거해도 됨.
        $currentPlayer = document.querySelector('.swiper-slide--' + addIndex);
        if (KBFG.isMobile(DEF_MO_BREAK_POINT) === true) {
            $currentVideo = $currentPlayer.querySelector('.swiper-slide--' + addIndex + ' .viewer.hidden-p');
        } else {
            $currentVideo = $currentPlayer.querySelector('.swiper-slide--' + addIndex + ' .viewer.hidden-m');
        }
        $currentProgressbar = document.querySelector('.progress-inner--' + addIndex);
    }

    function detectDragDirectionToSwiper() {
        if($('.main').length === 0 || KBFG.isMobile(DEF_MO_BREAK_POINT) === true) return false;
        currentSwipeInfo.init();
        currentSwipeInfo.isSwipping = true;
        //if ($.browser.ie === undefined) return;

        var isDragging = false;
        var startX = 0;
        var threshold = 50; // 드래그 인식을 위한 최소 이동 거리

        function handleMouseDown(event) {
            isDragging = true;
            IEMouseDragDirection = null;
            startX = event.clientX;
        }

        function handleMouseMove(event) {
            if (isDragging) {
                var currentX = event.clientX;
                var deltaX = currentX - startX;

                if (Math.abs(deltaX) >= threshold) {
                    if (deltaX > 0) {
                        // 우로 드래그
                        IEMouseDragDirection = 1;
                    } else {
                        // 좌로 드래그
                        IEMouseDragDirection = 0;
                    }
                    // 드래그 동작을 처리하고 더 이상 인식하지 않도록 재설정
                    isDragging = false;
                }
            }
        }

        function handleMouseUp() {
            isDragging = false;

            if (IEMouseDragDirection === 0) {
                // direction : forward
                changeKeyVisual(currentPlayIndex + 1, false);
            }

            if (IEMouseDragDirection === 1) {
                // direction : backward
                changeKeyVisual(currentPlayIndex - 1, false);
            }
        }

        if ($.browser.ie === undefined) {
            document.querySelector('.visual-wrap').addEventListener('mousedown', handleMouseDown);
            document.querySelector('.visual-wrap').addEventListener('mousemove', handleMouseMove);
            document.querySelector('.visual-wrap').addEventListener('mouseup', handleMouseUp);
        } else {
            document.querySelector('.visual-wrap').addEventListener('MSPointerDown', handleMouseDown);
            document.querySelector('.visual-wrap').addEventListener('MSPointerMove', handleMouseMove);
            document.querySelector('.visual-wrap').addEventListener('MSPointerUp', handleMouseUp);
        }
    }

    function changeKeyVisual(index, isforce) {
        if (index < 0) index = kvPaginationLists.length - 1;
        if (index >= kvPaginationLists.length) index = 0;
        if ($currentVideo.classList.contains('swiper-image') === true) {
            kvImages[0].currentTime = 0;
        } else {
            //$currentVideo.pause();
            //$currentVideo.currentTime = 0;
        }
        cancelAnimationFrame(reqVideoRepeatId);                      // pause
        $mainKvList.removeClass('complete active');
        playVideo(index);
        reqVideoRepeatId = requestAnimationFrame(updateProgressbar); // play
        btnAutoPlay.classList.remove('active');

        // swipe bug - 500ms 후 call하지 않으면? swipe기능 동작 오류 발생
        clearTimeout(timerSwiping);
        timerSwiping = setTimeout(function () {
            visualSwiper.slideTo(index);
            $currentVideo.classList.remove('image-pause');
        }, 500);
    }

    function clickBtnAutoPlay() {
        $(btnAutoPlay).toggleClass('active');

        if ($(btnAutoPlay).hasClass('active')) {
            // pause 
            if ($currentVideo.classList.contains('swiper-image') !== true) {
                $currentVideo.pause();
            } else {
                $currentVideo.classList.add('image-pause');
            }
            cancelAnimationFrame(reqVideoRepeatId);
            setTimeout(function () {   
                cancelAnimationFrame(reqVideoRepeatId); // gt.yang : swiper 조작 없이 3번째 슬라이드에 도달했을 때 pause 버튼 눌러도 reqAF 계속 실행되는 현상 발생하여 한번 더 취소 추가
            }, 50);
        } else {
            // play
            reqVideoRepeatId = requestAnimationFrame(updateProgressbar);
            if ($currentVideo.classList.contains('swiper-image') !== true) {
                $currentVideo.play();
            } else {
                $currentVideo.classList.remove('image-pause');
            }
        }
    }

    function playVideo(index) {
        if ($mainKvList.length === 0) return;

        // others action
        for (var i = 0; i < $mainKvList.length; i++) {
            if (i !== index) {
                getCurrentSelector(index);
                findParentWithClass(progressbars[i], 'swiper-pagination-bullet').classList.remove('swiper-pagination-bullet-active');
                //$currentVideo.pause();
            }
        }

        // current action
        getCurrentSelector(index);
        if ($currentVideo === undefined) return;
        
        //printLog('playVideo[' + index + '] - isIE? :' + ($.browser.ie !== undefined) + ' - playVideo.caller:', playVideo.caller.name+"()");
        if ($.browser.ie !== undefined) setTimeout(function () { $currentVideo.currentTime = 0.1 }, 1); // IE bugfix
        else {
            if ($currentVideo.classList.contains('swiper-image') !== true) $currentVideo.currentTime = 0.1;
        }

        if ($currentVideo.classList.contains('swiper-image') !== true) $currentVideo.play();
        findParentWithClass(progressbars[index], 'swiper-pagination-bullet').classList.add('swiper-pagination-bullet-active');

        currentPlayIndex = index;

        // saved duration
        if (kvSavedRealDuration[index] === undefined) {
            setTimeout(function () {
                //printLog('kvSavedRealDuration[' + index + '] + : ', $currentVideo.duration);
                kvSavedRealDuration[index] = $currentVideo.duration;
            }, 200);
        }
    }

    var playVideoLast = Date.now();
    function updateProgressbar() {
        var percent = 0;
        if ($currentVideo === undefined) return;

        if ($currentVideo.classList.contains('swiper-image') === true) {
            percent = (kvImages[0].currentTime / kvImages[0].duration) * 100;
            // kvImages[0].currentTime++;

            var fpsInterval = 1000 / 200;
            var playVideoNow = Date.now();
            var elapsed = playVideoNow - playVideoLast;

            if (elapsed >= fpsInterval) {
                playVideoLast = playVideoNow;
                kvImages[0].currentTime++;
            }
        } else {
            var currentDuration = $currentVideo.duration;

            if (currentDuration < 0.5) {
                if (kvSavedRealDuration[currentPlayIndex] !== undefined) {
                    currentDuration = kvSavedRealDuration[currentPlayIndex];
                    //alert('duration : ' + currentDuration + ', saved = ' + kvSavedRealDuration[currentPlayIndex]);
                }
            }
            percent = Math.ceil(($currentVideo.currentTime / currentDuration) * 100);
            // printLog($($currentVideo).attr("id") + " / $currentVideo.currentTime : " +  $currentVideo.currentTime + " / " + "currentDuration : " + currentDuration + " / percent : " + percent );
        }

        //printLog(' video[' + currentPlayIndex + '] currentDuration = ' + currentDuration + ', percent = ' + percent);

        if (percent === 100) {
            if ($currentVideo.classList.contains('swiper-image') === true) kvImages[0].currentTime = 0;
            else $currentVideo.pause();
            $currentPlayer.classList.remove('active');
            $currentPlayer.classList.add('complete');

            currentPlayIndex++;
            if (currentPlayIndex >= $mainKvList.length) {
                currentPlayIndex = 0;
                $currentProgressbar.style.width = percent + '%';
                $mainKvList.removeClass('complete');

                for (var i = 0; i < progressbars.length; i++) {
                    findParentWithClass(progressbars[i], 'swiper-pagination-bullet').classList.remove('swiper-pagination-bullet-active');
                }
            }

            if ($currentVideo.classList.contains('swiper-image') !== true) $currentVideo.currentTime = currentDuration; // IE bugfix
            visualSwiper.slideTo(currentPlayIndex);
            playVideo(currentPlayIndex);
            $currentPlayer.classList.add('active');
            btnAutoPlay.classList.remove('active');

            $currentProgressbar.style.width = 0 + '%';
            findParentWithClass(progressbars[currentPlayIndex], 'swiper-pagination-bullet').classList.add('swiper-pagination-bullet-active');
        }
        else if (percent > 100) {
            //alert('test : ' + percent + ', duration : ' + currentDuration);
            ;
        }
        else
            $currentProgressbar.style.width = percent + '%';

        reqVideoRepeatId = requestAnimationFrame(updateProgressbar);
    }

    /**
     * 부모 요소를 찾아가며 role 속성 값이 일치하는 요소를 찾는 함수
     */
    function findParentWithRole(element, role) {
        var parent = element.parentElement;
        while (parent) {
            if (parent.getAttribute('role') === role) {
                return parent;
            }
            parent = parent.parentElement;
        }
        return null;
    }

    /**
     * @description 특정 요소에서 className이 있는 부모 요소를 반환
     */
    function findParentWithClass(element, className) {
        let parent = element.parentNode;

        while (parent && !parent.classList.contains(className)) {
            parent = parent.parentNode;
        }

        return parent;
    }

    function onLoadWindow() {
        //printLog('onLoadWindow');
    }

    var idTimerMasonry = null;
    function onResizeWindow() {
        viewportWidth = $(window).width();
        viewportHeight = $(window).height();
        windowInnerHeight = window.innerHeight;
        highlightLastRowElementInTotalMenu();
        setWindowInnerHeight();
        checkVisibility('scroll-visible', 100, 50);
        checkVisibility('grid-item', 100, 100);
        setTimeout(function() { setLayout(false) }, 100);
        hiddenCloseGnbToHeader();
        controlToBackToTopBtn();
        checkVisibilityToBackToTop();
        screenWidth = $(window).outerWidth();
        initSwiper();
        calculateDistanceFromEsgTab();
        $('.c-gnb').css('height','');

        // 리스트 위에서 노출되는 문제 제거 코드
        if ($.browser.mobile === undefined) {
            $('.grid').css({'visibility' : 'hidden'});
            clearTimeout(idTimerMasonry);
            idTimerMasonry = setTimeout(function() {
                //console.log('timeout!!');
                initMasonry();
                setTimeout(function() {$('.grid').css({'visibility' : 'visible'});}, 300);
            }, 400);
        }
    }

    function onWheelWindow() {
        if(KBFG.isMobile(DEF_MO_BREAK_POINT) === false) {
            $('.c-util').removeClass('active');
            $('.c-util__global').removeClass('active');
        }
    }

    function loadImages(targetArray, maxArrayLength, path, startIndex, isSort, callback) {
        var numberOfLoadedImages = 0;
        var tempImageArray = [];

        var loadImages = function(idx) {
            var index = ('000' + Number(startIndex + idx)).slice(-3);
            var imgElem = new Image();
            imgElem.src = path + index + '.jpg';
            targetArray.push(imgElem);
            numberOfLoadedImages++;

            if (numberOfLoadedImages === maxArrayLength) {
                // Complete to load images
                //printLog('complete load image : total load count = ' + numberOfLoadedImages);
                if (callback !== null) callback();
            }
        };
        
        for (var i = 0; i < maxArrayLength; i++) {
            loadImages(i);
        }
    }
    
    function drawImage(obj, image, delay) {
        if (!!obj && !!image) {
            try{
                if (delay > 0)
                    setTimeout(function() { obj.context.drawImage(image, 0, 0, obj.canvas.width, obj.canvas.height);}, delay);
                else
                    obj.context.drawImage(image, 0, 0, obj.canvas.width, obj.canvas.height);
            } catch(e) {
            }
        }
    }

    function setLayout(isNeedLoadImage) {
        if (sceneInfo.length === 0 || sceneInfo[0].objs.container === null) return;

        //printLog('setLayout start... : loadImage = ' + (isNeedLoadImage === true ? 'true' : 'false'));

		// 각 스크롤 섹션의 높이 세팅
		for (var i = 0; i < sceneInfo.length; i++) {
            if (i === 1 && KBFG.isMobile(DEF_MO_BREAK_POINT) === false) {
                if (getOuterHeight(sceneInfo[i].objs.rollingWrap, false) + sceneInfo[i].resources.marginVerticalOfleftRollingWrap < viewportHeight) {
                    console.log('1', getOuterHeight(sceneInfo[i].objs.rollingWrap, false));
                    sceneInfo[i].positionType = '';
                    document.querySelector('#section_' + i).classList.add('not-sticky');
                }
            }

			if (sceneInfo[i].positionType === 'sticky') {

                if(KBFG.isMobile(DEF_MO_BREAK_POINT)) {
                    if(i === 0) {
                        sceneInfo[i].heightSize = (viewportHeight + (viewportHeight - sceneInfo[i].resources.heightOfGNB - sceneInfo[i].resources.marginBottomOfGNB)) / viewportHeight;
                        elementOfMainMoRolling.style.marginTop = -(viewportHeight - sceneInfo[i].resources.heightOfGNB - sceneInfo[i].resources.marginBottomOfGNB) + 'px';
                    }
                    if(i === 1) {
                        sceneInfo[i].scrollHeight = null;
                        sceneInfo[i].objs.container.style.height = null;
                        sceneInfo[i].objs.stickyEl.style.height = null;
                        return;
                    }
                    
                } else {
                    var offset = 0;
                    if(i === 1) {
                        var targetHeight = getOuterHeight(sceneInfo[i].objs.rollingWrap, false);
                        var largeCardHeight = getOuterHeight(sceneInfo[i].objs.largeCard, false);
                        if(largeCardHeight > targetHeight) {
                            var calcOffset = largeCardHeight - targetHeight;
                            offset = (calcOffset / 1000) - 0.02;
                        }
                    }
                    sceneInfo[i].heightSize = ((getOuterHeight(sceneInfo[i].objs.rollingWrap, true) + sceneInfo[i].resources.marginBottomOfRollingElememnt) / viewportHeight) + offset;
                }

				sceneInfo[i].scrollHeight = sceneInfo[i].heightSize * viewportHeight;
                sceneInfo[i].objs.container.style.height = sceneInfo[i].scrollHeight + 'px';
                sceneInfo[i].objs.stickyEl.style.height = viewportHeight + 'px';
			}
            else {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
		}

		yOffset = window.pageYOffset;

		var totalScrollHeight = 0;
		for (var k = 0; k < sceneInfo.length; k++) {
			totalScrollHeight += sceneInfo[k].scrollHeight;
			if (totalScrollHeight >= yOffset) {
				currentScene = k;
				break;
			}
		}
        //printLog('setLayout : scene[' + currentScene + ']' + ' totalScrollHeight = ' + totalScrollHeight + ', yOffset = ' + yOffset);

		var heightRatio = window.innerHeight / 1080;

        // image loading
        if (isNeedLoadImage === true) {
        }
        // if(isLoadedImages === true && isLoadedVideos === true) updateScrollPosition();
	}

	function calcValueByScrollRatio(values, currentYOffset) {
		var ret = 0;
		// 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
		var scrollHeight = sceneInfo[currentScene].scrollHeight;
		var scrollRatio = currentYOffset / scrollHeight;

		if (values.length === 3) {
			// start ~ end 사이에 애니메이션 실행
			var curScenScrollStart = values[2].start * scrollHeight;
			var curScenScrollEnd = values[2].end * scrollHeight;
			var curScenScrollHeight = curScenScrollEnd - curScenScrollStart;

			if (currentYOffset >= curScenScrollStart && currentYOffset <= curScenScrollEnd) {
				ret = (currentYOffset - curScenScrollStart) / curScenScrollHeight * (values[1] - values[0]) + values[0];
			} else if (currentYOffset < curScenScrollStart) {
				ret = values[0];
			} else if (currentYOffset > curScenScrollEnd) {
				ret = values[1];
			}
		} else {
            // imageSequence
			ret = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return ret;
	}

    function playVideoImages(targetScene, imgArryNo, isStarted) {
        var objs = targetScene.objs;
        var resources = targetScene.resources;

        if (resources === null || resources.videos === null || resources.videos[imgArryNo].startIndex === null) {
            resources.videos[imgArryNo].isPlay = false; return; 
        }

        if (isStarted === true) {
            //printLog('palyVideoImages : scene[' + currentScene + '] video[' + imgArryNo + '] start');
            resources.videos[imgArryNo].startIndex = 0;
            resources.videos[imgArryNo].isPlay = true;
        }

        if (resources.videos[imgArryNo].startIndex >= resources.images[imgArryNo].count) {
            //printLog('palyVideoImages : scene[' + currentScene + '] video[' + imgArryNo + '] stop');

            if (curRepeatCountPlayVideoImages === resources.videos[imgArryNo].repeat) {
                curRepeatCountPlayVideoImages = 0;
                cancelAnimationFrame(reqVideoAniFrmId);
                drawImage(objs, resources.images[imgArryNo].array[resources.videos[imgArryNo].startIndex - 1], 0);
                return;
            }
            else {
                curRepeatCountPlayVideoImages++;
                resources.videos[imgArryNo].startIndex = 0;
            }
        }

        //printLog('palyVideoImages : scene[' + currentScene + ']' + ' startIndex = ' + resources.videos[imgArryNo].startIndex + ', resource count = ' + resources.images[imgArryNo].count);
        drawImage(objs, resources.images[imgArryNo].array[resources.videos[imgArryNo].startIndex], 0);

        // check frame rate
        if (resources.videos[imgArryNo].frameRate === 30) {
            if (isSkipVideoPlay === true) {
                isSkipVideoPlay = false;
                reqVideoAniFrmId = requestAnimationFrame(function() { playVideoImages(targetScene, imgArryNo, false)});
                return;
            }
            isSkipVideoPlay = true;
        }

        resources.videos[imgArryNo].startIndex++;
        reqVideoAniFrmId = requestAnimationFrame(function() { playVideoImages(targetScene, imgArryNo, false)});
    }

    function checkToScrollDown() {
        var scrolltop = $(window).scrollTop();

        if (scrolltop > lastScrollTop ) isScrollDown = true 
        else if (scrolltop < lastScrollTop ) isScrollDown = false;
        lastScrollTop = scrolltop;
        //printLog('changeElementPosition [0] : isScrollDown = ' + isScrollDown);
    }

    // for IE to Sticky
    function setElementToSticky(objs, scrollRatio, targetRatio, positionTop, isForceFixed, isBottomBgBlack) {
        var prevObjs = null,
            nextObjs = null,
            isTypeSticky = false,
            isPrintLog = true,          // need to show debugging log : true
            nextScene = currentScene;

        // exception
        if ($.browser.ie === undefined || objs.stickyEl === null || objs.stickyEl === undefined) return;

        // condition
        if (currentScene > 0) prevObjs = sceneInfo[currentScene - 1].objs;
        if (currentScene < sceneInfo.length - 1) nextObjs = sceneInfo[currentScene + 1].objs;

        if (isScrollDown === false) {
            if (prevObjs !== null) nextScene--;
        }
        else {
            if (nextObjs !== null) nextScene++;
        }

        // printLog('--: Scene |' + currentScene + '|       | scrollRatio : ' + scrollRatio + ' | positionTop : '
        //      + positionTop + ' | prevObjs : ' + (prevObjs !== null) + ' | nextObjs : ' + (nextObjs !== null));

        // action
        if (isForceFixed === true ){
            // prev normal -> sticky & mouseDown & 1st enter
            if (scrollRatio >= targetRatio) {
                if (objs.stickyEl.classList.contains('is-fixed') === false) {
                    isPassingSticky = true;
                    objs.stickyEl.style.position = 'fixed';
                    objs.stickyEl.classList.add('is-fixed');
                    //if (isPrintLog === true) printLog('40: Scene |' + currentScene + '| fixed | scrollRatio : ' + scrollRatio + ' | positionTop : ' + positionTop);
                }
            }
            return;
        }

        if (scrollRatio >= targetRatio){
            // sticky passing
            if (objs.stickyEl.classList.contains('is-fixed') === true || isPassingSticky === false) {
                isPassingSticky = true;
                if (isBottomBgBlack === true) {
                    $('.content-wrap').css({'background-color' : '#000'});
                    $('.sub-bottom-wrap').css({'background-color' : '#000'});
                }
                objs.stickyEl.style.top = positionTop  + 'px';
                objs.stickyEl.style.position = 'relative';
                objs.stickyEl.classList.remove('is-fixed');
                //if (isPrintLog === true) printLog('00: Scene |' + currentScene + '|       | scrollRatio : ' + scrollRatio + ' | positionTop : ' + positionTop);
            } else {
                objs.stickyEl.style.top = positionTop  + 'px';
                objs.stickyEl.style.position = 'relative';
                objs.stickyEl.classList.remove('is-fixed');
            }
        }
        else if (scrollRatio < 0){
            // sticky -> prev normal & mouseUp
            if (objs.stickyEl.classList.contains('is-fixed') === true) {
                objs.stickyEl.style.top = 0  + 'px';
                objs.stickyEl.style.position = 'relative';
                objs.stickyEl.classList.remove('is-fixed');
                //if (isPrintLog === true) printLog('01: Scene |' + currentScene + '|       | scrollRatio : ' + scrollRatio + ' | positionTop : ' + positionTop);
            }
        }
        else{
            // next normal -> sticky  & mouseUp
            if (isScrollDown !== true) {
                if (objs.stickyEl.classList.contains('is-fixed') === true) {
                    ;
                }
                else {
                    if (objs.stickyEl.classList.contains('is-fixed') === false) {
                        objs.stickyEl.classList.add('is-fixed');
                        objs.stickyEl.style.position = 'fixed';
                        objs.stickyEl.style.top = 0 + 'px';
                        //if (isPrintLog === true) printLog('02: Scene |' + currentScene + '| fixed | scrollRatio : ' + scrollRatio + ' | positionTop : ' + positionTop);
                    }
                }
            }
            // prev normal -> sticky & mouseDown & 1st enter
            else{
                if (objs.stickyEl.classList.contains('is-fixed') === false) {
                    isPassingSticky = true;
                    //objs.stickyEl.style.top = 0 + 'px';
                    objs.stickyEl.style.position = 'fixed';
                    objs.stickyEl.classList.add('is-fixed');
                    //if (isPrintLog === true) printLog('50: Scene |' + currentScene + '| fixed | scrollRatio : ' + scrollRatio + ' | positionTop : ' + positionTop);
                }
            }
        }
    }

    function playAnimation() {
		var objs = sceneInfo[currentScene].objs,
            prevObjs = null,
            nextObjs = null,
            isBottomBgBlack = false,
		    values = sceneInfo[currentScene].values,
            //nextValues = sceneInfo[currentScene+1].values,
		    currentYOffset = yOffset - prevScrollHeight,
		    scrollHeight = sceneInfo[currentScene].scrollHeight,
		    scrollRatio = currentYOffset / scrollHeight,
            positionTop = (scrollHeight - $(window).height());
            // showProductIndex = sceneInfo[currentScene].showProductIndex;

        if (currentScene > 0) prevObjs = sceneInfo[currentScene - 1].objs;
        if (currentScene < sceneInfo.length - 1) nextObjs = sceneInfo[currentScene + 1].objs;

        // ToDo : 속도 개선을 위해 제거 필요
        if ($.isLiveMode === false) scrollRatio = scrollRatio.toFixed(4);
        
        //printLog(currentScene + ' : ' + scrollRatio + ', positionTop = ' + positionTop + ', yOffset = ' + yOffset);

        switch (currentScene) {
            case 0:

                if (KBFG.isMobile(DEF_MO_BREAK_POINT)) {
                    setElementToSticky(objs, scrollRatio, (scrollHeight - viewportHeight) / scrollHeight, positionTop, false, isBottomBgBlack);

                    if (scrollRatio > 0.1) {
                        objs.header.classList.add('scrolled');
                    } else {
                        objs.header.classList.remove('scrolled');
                    }

                    if (scrollRatio > ((scrollHeight - viewportHeight) / scrollHeight) - 0.1) {
                        objs.container.classList.add('active');
                    } else {
                        objs.container.classList.remove('active');
                    }

                    if (scrollRatio > ((scrollHeight - viewportHeight) / scrollHeight) - 0.35) {
                        objs.mobileCoverEl.style.zIndex = '0';
                    } else {
                        objs.mobileCoverEl.style.zIndex = '-1';
                    }

                    if (scrollRatio > 0.3724)
                        isDisplayHeader = false;
                    else
                        isDisplayHeader = true;
                } else {
                    setElementToSticky(objs, scrollRatio, (scrollHeight - viewportHeight) / scrollHeight, positionTop, false, isBottomBgBlack);

                    if (scrollRatio > 0.1) {
                        objs.header.classList.add('scrolled');
                    } else {
                        objs.header.classList.remove('scrolled');
                    }

                    if (scrollRatio >= 0.05) {
                        objs.rolling.classList.add('active');
                    } else {
                        objs.rolling.classList.remove('active');
                    }

                    if (scrollRatio > 0.6) {
                        isDisplayHeader = false;
                    } else {
                        isDisplayHeader = true;
                    }

                    if (scrollRatio >= 0.85) {
                        nextObjs.rolling.classList.add('active');
                    } else {
                        nextObjs.rolling.classList.remove('active');
                    }
                }

                if (scrollRatio < 0.55) {
                    if(nextObjs.largeCard != null) nextObjs.largeCard.classList.remove('active');
                }

                break;

            case 1:

                if (KBFG.isMobile(DEF_MO_BREAK_POINT)) {

                } else {
                    setElementToSticky(objs, scrollRatio, (scrollHeight - viewportHeight) / scrollHeight, positionTop, false, isBottomBgBlack);

                    if(scrollRatio > 0.05) {
                        if(objs.largeCard != null) objs.largeCard.classList.add('active');
                    } 
                    // else {
                    //     if(objs.largeCard != null) objs.largeCard.classList.remove('active');
                    // }
                }

                break;

            case 2:
                
                break;

            case 3:

                break;
		}
	}
    
	function scrollLoop() {
        if($('.main').length === 0) return false;
        var scrolltop = $(window).scrollTop();
        if (sceneInfo.length === 0 || sceneInfo[0].objs.container === null) return;
        
		enterNewScene = false;
		prevScrollHeight = 0;

        // ToDo : IE에서 last Scene에서 F5 실행 시 --> currentScene값이 0으로 초기화 되는 문제 대폭 개선 필요
        // ToDo : yOffset 값으로 currentScene값 가져오는 function 필요

		for (var i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			document.body.classList.remove('scroll-effect-end');
		}

		if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
			enterNewScene = true;
			if (currentScene === sceneInfo.length - 1) {
				document.body.classList.add('scroll-effect-end');
			}
			if (currentScene < sceneInfo.length - 1) {
				currentScene++;
			}
		}

        //printLog('scrollLoop : scene[' + currentScene + '], delayedYOffset = ' + delayedYOffset + ', yOffset = ' + (yOffset));

		if (delayedYOffset > 0 && delayedYOffset < prevScrollHeight) {
			enterNewScene = true;
			// 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
			if (currentScene === 0) return;
			currentScene--;
		}

		if (enterNewScene) return;

		playAnimation();
	}

	function repeatAnimation() {
        if($('.main').length === 0) return false;
        if (sceneInfo.length === 0 || sceneInfo[0].objs.container === null) {
                reqAniFrmState = false;
                return;
            }

		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * accel;

		if (!enterNewScene) {
			if (sceneInfo[currentScene].positionType === 'sticky') {
				var currentYOffset = delayedYOffset - prevScrollHeight;
				var objs = sceneInfo[currentScene].objs;
				var values = sceneInfo[currentScene].values;
                var resources = sceneInfo[currentScene].resources;
                //printLog('repeatAnimation : scene[' + currentScene + '] call calcValueByScrollRatio()');
                if (values.length > 0) {
                    if (values.imageSequence !== undefined) {
                        var sequence = Math.round(calcValueByScrollRatio(values.imageSequence, currentYOffset));
                        if (resources.images[0].array[sequence]) {
                            drawImage(objs, resources.images[0].array[sequence], 0);
                        }
                    }
                }
			}
		}

        // body id가 제대로 인식 안되는 경우를 해결(일부 기기에서 페이지 끝으로 고속 이동 시)
        // 페이지 맨 위로 갈 경우: scrollLoop와 첫 scene의 기본 캔버스 그리기 수행
        if (delayedYOffset < 1) {
            scrollLoop();
        }

		reqAniFrmId = requestAnimationFrame(repeatAnimation);

		if (Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(reqAniFrmId);
			reqAniFrmState = false;
		}
	}

	function initAfterLoadImages() {
        //printLog('initAfterLoadImages! : currentScene = ' + currentScene);

        drawImage(sceneInfo[3].objs, sceneInfo[3].resources.images[0].array[0], 300);
        loadImages(); 
	}

    function loadImages () {  
        var path = '';

        for (var i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].resources === null || sceneInfo[i].resources === undefined || 
                sceneInfo[i].resources.images[0].loaded === null || 
                sceneInfo[i].resources.images[0].loaded === undefined) 
                continue;

            for (var k = 0; k < sceneInfo[i].resources.images.length; k++) {
                if (sceneInfo[i].resources.images[k].loaded === false) {
                    sceneInfo[i].resources.images[k].loaded = true; 
                    path = ($.browser.mobile === true) ? sceneInfo[i].resources.images[k].pathMo : sceneInfo[i].resources.images[k].path;
                    loadImages(sceneInfo[i].resources.images[k].array, sceneInfo[i].resources.images[k].count, 
                        path, sceneInfo[i].resources.images[k].startIndex, true, initAfterLoadImages);
                }
            }
        }
    }

	function updateScrollPosition() {
		// 중간에서 새로고침 했을 경우 자동 스크롤로 제대로 그려주기
		var tempYOffset = window.pageYOffset;
		var tempScrollCount = 0;
        
		if (tempYOffset > 0) {
			var siId = setInterval(function() {
                lastScrollPositionY = tempYOffset;
				scrollTo(0, tempYOffset);
				tempYOffset += 1;

				if (tempScrollCount > 15) {
                    playAnimation();
					clearInterval(siId);
                    //printLog('complete updateScrollPosition!');
				}
				tempScrollCount++;
			}, 20);
		}
	}

    function getOuterHeight(element, includeMargin) {
        if(element === null) return;

        includeMargin = includeMargin || false;

        var height = Math.min(
            element.offsetHeight,
            element.clientHeight
        );

        if (includeMargin) {
            var computedStyle = window.getComputedStyle(element) || 0;
            var marginTop = parseFloat(computedStyle.marginTop) || 0;
            var marginBottom = parseFloat(computedStyle.marginBottom) || 0;

            return height + marginTop + marginBottom;
        }

        return height;
    }

    /**
     * @param HeightOfActiveAdd : 요소가 뷰포터에서 얼마만 큼 올라왔을때 active class가 추가되는 높이
     */
    function checkVisibility(className, delay, HeightOfActiveAdd) {
        var elements = document.querySelectorAll('.' + className);
        if (elements.length === 0) return;
        var currentDelay = delay;

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            var rect = element.getBoundingClientRect();

            // 높이를 기준으로 요소가 뷰포트의 절반 이상 보이는지 확인
            if (rect.bottom - rect.height + HeightOfActiveAdd <= (window.innerHeight || document.documentElement.clientHeight)) {

                // active 클래스가 없는 요소인 경우에만 처리
                if (element.className.indexOf('active') === -1) {
                    var tabPanel = document.querySelector('.sub-page [role="tabpanel"]');
                    if (tabPanel) {
                        var parentTabPanel = findParentWithRole(element, 'tabpanel');
                        if (parentTabPanel && parentTabPanel.getAttribute('hidden') === null) {
                            setTimeout(function (element) {
                                element.classList.add('active');
                            }, currentDelay, element);
                            currentDelay += delay;
                        }
                    } else {
                        setTimeout(function (element) {
                            element.classList.add('active');
                        }, currentDelay, element);
                        currentDelay += delay;
                    }
                }
            }
        }
    }


    //영상작동:영상로드시 바로 작동
	/* window.addEventListener('loadedmetadata', function (e) {
		if ($(e.target).parents('.swiper-slide')) {
			visualSwiper.autoplay.stop();
			$(e.target).parents('.swiper-slide').attr('data-swiper-autoplay', parseInt(e.srcElement.duration * 1000));

			visualSwiper.autoplay.start();
			$('.c-main-swiper-button .swiper-pagination-bullet-active .progress-bar .progress-inner').css({ 'animation-duration': +visualSwiper.slides.eq(visualSwiper.realIndex).attr('data-swiper-autoplay') / 1000 + 's' }).addClass('active');
		}
        if(isLoadedVideos === false) {
            isLoadedVideos = true;
            if(isLoadedImages === true && isLoadedVideos === true) updateScrollPosition();
        }
	}, true); */

    // custom select box start
    function toggleActivationStateOfSelectBox(selectBox) {
        selectBox.toggleClass('active');
        toggleModalOpenBodyClass(selectBox);
    }

    function displaySelectedOption(optionElement) {
        var selectBox = optionElement.closest('.select-row');
        var displayElement = selectBox.find('.selected-value');
        if(optionElement.find('.select-list').length === 0){
            if(optionElement.text().indexOf('\n') < 0)
                displayElement.text(optionElement.text());
        }
    }

    function toggleModalOpenBodyClass(selectBox) {
        if(selectBox.hasClass('active')) {
            $('body').addClass('modal-open');
        } else {
            $('body').removeClass('modal-open');
        }
    }

    $(document).on('click', function (e) {
        var clickedElement = $(e.target);

        if($('.select-row').length > 0) {
            var selectBox = clickedElement.closest('.select-row');
            var isOptionClicked = selectBox.find('.option');
            var isSelectBoxClicked = selectBox.length > 0;

            if (isSelectBoxClicked) {
                if (isOptionClicked) {
                    displaySelectedOption(clickedElement);
                }

                toggleActivationStateOfSelectBox(selectBox);
            } else {
                $('.select-row').removeClass('active');
                $('body').removeClass('modal-open');
            }
        }

        if($('.history-year-btn').length > 0) {
            var selectBox = clickedElement.closest('.history-year-area');
            var isSelectBoxClicked = selectBox.length > 0;

            if (isSelectBoxClicked) {
                $('body').addClass('modal-open');
                $('.history-year-dropmenu').toggleClass('active');
                $('.history-year-btn').toggleClass('active');
            } else {
                $('body').removeClass('modal-open');
                $('.history-year-dropmenu').removeClass('active');
                $('.history-year-btn').removeClass('active');
            }
        }

        if(clickedElement.parents('.c-util__global').length < 1) {
            if(KBFG.isMobile(DEF_MO_BREAK_POINT) === false) {
                $('.c-util').removeClass('active');
                $('.c-util__global').removeClass('active');
            }
        }

        // yj.baek 20231114 : esg 정책 tab 예외 추가
        var idTimerClickToTab = null;
        if(window.location.href.indexOf('policy/environment/list.') > 0) {
            if($('.lnb-area li').length > 0) {
                if($(e.target).closest('.lnb-area').length > 0){
                    clearTimeout(idTimerClickToTab);
                    idTimerClickToTab = setTimeout(function() { scrollToActiveItemInHorizontalScroll(); }, 300); 
                }
            }
        }
    });
    // custom select box end

    // ie check
    if ($.browser.ie === undefined) {
        $('#main').addClass('not-ie')
    }

    // header
    function disableHeaderBannerIfTitleHidden() {
        var bannerElement = document.querySelector('.header__banner');
        if (bannerElement === null) {
            document.querySelector('header').classList.add('header--banner-disable');
        }
    }

    function closeHeaderBanner() {
        var headerBannerCloseBtn = document.querySelector('.header__banner-close-btn');
        if(headerBannerCloseBtn === null) return;

        headerBannerCloseBtn.addEventListener('click', function () {
            header.classList.add('header--banner-close');
            headerBanner.setAttribute('aria-hidden', 'true');
        });
    }

    function closeGnb() {
        $('.header').removeClass('open');
        $('.dim').removeClass('dim--blur');
        
        $('.c-gnb__depth-01-link').removeClass('active');
        $('.c-gnb__depth-02').removeClass('active');
        $('.c-btn-close').removeClass('active');
        $('.c-gnb').removeClass('active active-esg end');
        $('.c-gnb').css('height','');
    }

    function openHeader() {
        // 1depth click for 2depth
        $('.c-gnb__depth-01-link').on({
            click: function (e) {
                if ($(e.target).hasClass('outlink') === true) {
                    closeGnb();
                    return;
                }

                // open Gnb
                $('.header').addClass('open');
                $('.dim').addClass('dim--blur');

                $('.c-gnb').removeClass('active active-esg');
                $('.c-gnb').addClass('active');

                $('.c-gnb__depth-01-link').removeClass('active');
                $('.c-gnb__depth-02').removeClass('active');

                $(e.target).addClass('active');
                $(e.target).parent().find('.c-gnb__depth-02').addClass('active');
                setGNBHeight(e);

                $('.c-btn-close').addClass('active');

                $('.c-gnb').one('transitionend', function () {
                    $(this).addClass('end');
                });
            },

            mouseenter: function (e) {
                if ($(e.target).hasClass('outlink') === true) {
                    closeGnb();

                    return;
                }

                // open Gnb
                $('.header').addClass('open');
                $('.dim').addClass('dim--blur');

                $('.c-gnb').removeClass('active active-esg');
                $('.c-gnb').addClass('active');

                $('.c-gnb__depth-01-link').removeClass('active');
                $('.c-gnb__depth-02').removeClass('active');

                $(e.target).addClass('active');
                $(e.target).parent().find('.c-gnb__depth-02').addClass('active');
                setGNBHeight(e);

                $('.c-gnb').one('transitionend', function () {
                    $(this).addClass('end');
                });
            },
        })
        closeHeader();
        openFunctionMenuToHeader();
        closeFunctionMenuToHeader();
        controlTotalMenuToHeader();
    }

    function setGNBHeight(e) {
        var HeightOfGNB1Depts = $('.c-gnb__depth-01').outerHeight();
        var HeightOfGNB2Depts = $(e.target).parent().find('.c-gnb__depth-02').outerHeight();
        var marginBottomOfGNB = 40;

        $('.c-gnb').css('height', HeightOfGNB1Depts + HeightOfGNB2Depts + marginBottomOfGNB);

        //printLog('HeightOfGNB1Depts = ' + HeightOfGNB1Depts + ', HeightOfGNB2Depts = ' + HeightOfGNB2Depts);
    }

    function closeHeader() {
        $('.header__nav-wrap').on('mouseleave', function(e) {
            closeGnb();
        })
    }

    // Todo gt.yang : 리사이징(pc/mo 분기점 통과)에 따라 유틸메뉴 스타일 디테일 작업시, resize 이벤트에 header에 header--pc, header--mo class 추가해서 처리 필요.
    function openFunctionMenuToHeader() {
        $('.c-util__toggle').on('click', function(e) {
            $('.c-util').addClass('active');

            if($(e.target).parents('.c-gnb').length > 0 === true) {
                $('.c-gnb .c-util__search,.c-util__global').removeClass('active');
                $(e.target).parent().addClass('active');
                $('.c-util__search-input').attr('tabindex','0').focus();

            } else if($(e.target).parents('.c-total-menu').length > 0 === true) {
                $('.c-total-menu .c-util__search,.c-util__global').removeClass('active');
                $(e.target).parent().addClass('active');
                $('.c-util__search-input').attr('tabindex','0').focus();
            }

            if($(this).hasClass('c-util__search-submit-btn') === false) {
                $('.c-gnb__depth-01').removeClass('c-gnb__depth-01--hidden');
            }

            if($(e.target).hasClass('c-util__search-open-btn') === true) {
                $('.c-gnb__depth-01').addClass('c-gnb__depth-01--hidden');
                $('.c-gnb').addClass('util-search-menu-open').removeClass('util-search-menu-close');
                if(KBFG.isMobile(DEF_MO_BREAK_POINT)) $('.c-util__total-btn').addClass('open').removeClass('close');

                canIPushTotalMenuBtn = false;
                setTimeout(function () {
                    canIPushTotalMenuBtn = true;
                }, 600); // .c-util__search-open-btn의 transition-delay에서 .1s 여유 있게 처리

                switch (document.documentElement.lang) {
                    case 'ko':
                        if (KBFG.isMobile(DEF_MO_BREAK_POINT)) {
                            $('.c-util__search-input')
                                .attr('placeholder', '새로운 소식을 검색해보세요.')
                                .attr('title', '새로운 소식을 검색해보세요.');
                        } else {
                            $('.c-util__search-input')
                                .attr('placeholder', 'KB금융그룹의 새로운 소식을 검색해보세요.')
                                .attr('title', 'KB금융그룹의 새로운 소식을 검색해보세요.');
                        }
                        break;
                }

                $('.c-util__search-input').attr('tabindex','0').focus();
            }
            if($(e.target).hasClass('c-util__global-open-btn') === true) {
                $('.c-gnb').addClass('util-global-menu-open').removeClass('util-search-menu-open');
            }
        });
    }

    function closeFunctionMenuToHeader() {
        $('.c-util__global-close-btn, .c-util__search-close-btn').on('click', function(e) {

            if($(e.target).parents('.c-gnb').length >= 0 === true) {
                $('.c-gnb').find($(e.target)).parent().removeClass('active');
            }

            if ($(e.target).parents('.c-total-menu').length >= 0 === true) {
                $('.c-total-menu').find($(e.target)).parent().removeClass('active');
            }

            if($(e.target).parent().find('.c-util__search-open-btn').length === 1) {
                $('.c-gnb').removeClass('util-search-menu-open');
                $('.c-gnb__depth-01').removeClass('c-gnb__depth-01--hidden');
            }

            if($(e.target).parent().find('.c-util__global-open-btn').length === 1) {
                $('.c-gnb').removeClass('util-global-menu-open');
            }
        });
    }

    function controlTotalMenuToHeader() {
        $('.c-util__total-btn').on('click', function (e) {
            if(canIPushTotalMenuBtn === false) return;
            canIPushTotalMenuBtn = false;

            $('.c-gnb').removeClass('util-global-menu-open');
            $('.c-gnb__depth-01').removeClass('c-gnb__depth-01--hidden');

            setTimeout(function () {
                canIPushTotalMenuBtn = true;
            }, 500); // .header__nav-wrap의 transition-duration

            if(KBFG.isMobile(DEF_MO_BREAK_POINT) && $('.c-gnb').hasClass('util-search-menu-open') === true) {
                $(this).removeClass('open').addClass('close');
                $('.c-util').removeClass('active');
                $('.c-util__search').removeClass('active');
                $('.c-gnb').removeClass('util-search-menu-open').addClass('util-search-menu-close');
                $('.c-gnb').on('transitionend', function () {
                    $('.c-gnb').removeClass('util-search-menu-close');
                });
                return false;
            } else {
                if ($('.c-total-menu').hasClass('open') === false) {
                    closeGnb();
                    header.classList.add('header--banner-close-when-total-menu-open');
                    $('body').addClass('body-lock');
                    toggleTabListActiveState();
                    $('.header__nav-wrap').addClass('total-menu-open').removeClass('total-menu-close');
                    $('.c-util__search').removeClass('active');
                    $('.dim').addClass('dim--blur');
                    $('.c-total-menu').addClass('open').attr('aria-hidden', 'true');
                    $(this).addClass('open').removeClass('close').attr('aria-expanded', 'true');
                } else {
                    header.classList.remove('header--banner-close-when-total-menu-open');
                    $('.c-total-menu').removeClass('open').attr('aria-hidden', 'false');
                    $('.header__nav-wrap').addClass('total-menu-close');
                    
                    $(this).removeClass('open').addClass('close').attr('aria-expanded', 'false');
                    $('.dim').removeClass('dim--blur');

                    // gt.yang : 페이지 진입과 전체메뉴 눌렀을때 현재 하이라이트된 메뉴 초기화 되는 문제로 주석 처리
                    /* 모바일 메뉴 초기화 */
                    // $('.c-total-menu--mo .c-tab__item').removeClass('active');
                    // $('.c-total-menu--mo [role="tab"]').attr('aria-selected', 'false');
                    // $('.c-total-menu--mo [role="tabpanel"]').attr('hidden', 'true');
                    /* // 모바일 메뉴 초기화 */
                    setTimeout(function () {
                        $('body').removeClass('body-lock');
                        $('.header__nav-wrap').removeClass('total-menu-open');
                        $('.c-util').removeClass('active');
                        $('.c-util__global').removeClass('active');
                    }, 500); // .header__nav-wrap의 transition-duration
                    
                    initAccordionInTotalMenu();
                }
            }
        });
    }

    function toggleTabListActiveState() {
        var tabLinks = document.querySelectorAll('.c-tab__link');
        var isInActiveToTabLinks = false;
        for (var i = 0; i < tabLinks.length; i++) {
            if (tabLinks[i].getAttribute('aria-selected') === 'true') {
                isInActiveToTabLinks = true;
                break;
            }
        }
        if (isInActiveToTabLinks === true) {
            $('.c-total-menu--mo .c-tab__list').removeClass('inactive');
        } else {
            $('.c-total-menu--mo .c-tab__list').addClass('inactive');
        }
    }

    function hiddenCloseGnbToHeader() {
        if(KBFG.isMobile(DEF_MO_BREAK_POINT) === true) {
            $('.c-gnb').removeClass('active end');
            $('.c-btn-close').removeClass('active');
        } else {
            return;
        }
    }
    
    /* gnb fixed */
    function controlGnb() {
        var scrollTopArr = [];
        var offsetY = 200;
        if(KBFG.isMobile(DEF_MO_BREAK_POINT)) offsetY = 0;
        var subNavScroll = {
            init: function () {
            this.sticky_nav();
            },
        
            sticky_nav: function () {
            var $subNav = $('.lnb-area'),
                $subNavWrap = $('.lnb-area .lnb-box'),
                $headerHeight = $('.header').outerHeight(),
                $breadCrumb = $('.bread-crumb');
                if ($subNav.length > 0) {
                var subNavOffset = $subNav.offset(),
                    subNavTop = subNavOffset.top - $headerHeight - offsetY; 
                    if ($(window).scrollTop() > subNavTop) {
                        $breadCrumb.css('display','block');
                        $subNav.addClass('fixed');
                        $subNavWrap.css('top', $headerHeight);
                        if ( $('.header').hasClass('up') ) {
                            $subNavWrap.css('margin-top', -$headerHeight);
                        } else {
                        $subNavWrap.css('margin-top', 0);
                        }
                        } else {
                        $subNav.removeClass('fixed');
                        $breadCrumb.css('display','none');
                        $subNavWrap.css('top', 0);
                    }
                }
            },
        };

        // bread-crumb 제거
        // $(window).on('scroll', function () {
        //     subNavScroll.init();
        // });
        
        // $(window).on('resize', function () {
        //     subNavScroll.init();
        // });
    }

    function controlHeader() {
        if ($('.header').hasClass('open') || $('.c-total-menu').hasClass('open') || isScrollBounceActive === true) return false;
        currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // yj.baek 20231116 : header show bug fixed
        // if (Math.abs(currentScrollTop - lastScrollPositionY) > defDistanceForThreshold) {
        //     if ((currentScrollTop - lastScrollPositionY) > 0) {
        //         if ($('.main').length !== 0) {
        //             if (isDisplayHeader === false) $('.header').addClass('up');
        //         } else {
        //             $('.header').addClass('up');
        //         }
        //     }
        //     if ((currentScrollTop - lastScrollPositionY) < 0) {
        //         $('.header').removeClass('up');
        //     }
        //     lastScrollPositionY = currentScrollTop;
        // }
        //console.log('condition = ' + (Math.abs(currentScrollTop - lastScrollPositionY) > defDistanceForThreshold) + ', currentScrollTop = ' + currentScrollTop + ', lastScrollPositionY = ' + lastScrollPositionY );
        if (currentScrollTop <= 0) {
            $('.header').removeClass('up');  
        }
        else if (Math.abs(currentScrollTop - lastScrollPositionY) > defDistanceForThreshold) {
            if ((currentScrollTop - lastScrollPositionY) > 0) {
                if ($('.main').length !== 0) {
                    if (isDisplayHeader === false) $('.header').addClass('up');
                } else {
                    $('.header').addClass('up');
                }
            }
            if ((currentScrollTop - lastScrollPositionY) < 0) {
                $('.header').removeClass('up');
            }
        }
        lastScrollPositionY = currentScrollTop;

        if (headerIntervalEnabled === false) {
            headerIntervalEnabled = true;
            KBFG.headerScrollIntervalTimer = setInterval(function () {
                if ($('.main').length !== 0 && KBFG.isMobile(DEF_MO_BREAK_POINT) === false) {
                    if (currentScrollTop > getOuterHeight(sceneInfo[0].objs.container, true)) {
                        header.classList.add('exit-kv');
                    } else {
                        header.classList.remove('exit-kv');
                    }
                }
                if ($('.main').length !== 0 && KBFG.isMobile(DEF_MO_BREAK_POINT) === true) {
                    if (currentScrollTop / getOuterHeight(sceneInfo[0].objs.container, true) > 0.3724) {
                        header.classList.add('exit-kv');
                    } else {
                        header.classList.remove('exit-kv');
                    }
                }
            }, 200);
        }

        clearTimeout(KBFG.headerScrollTimer);
        KBFG.headerScrollTimer = setTimeout(function () {
            //printLog("scroll end");
            clearInterval(KBFG.headerScrollIntervalTimer);
            headerIntervalEnabled = false;
        }, 200);
    }

    function controlScrollBounce() {
        //if (isScrollBounceActive === true) return;

        // 페이지 상단에서 바운스 발생
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        if (scrollTop <= 0) {
            isScrollBounceActive = true;
            // printLog('safari bounce end!');
            clearTimeout(timerBounceActive);
            timerBounceActive = setTimeout(function () {
                isScrollBounceActive = false;
                if(scrollTop + windowInnerHeight < documentHeight) $('.header').removeClass('up');
            }, iosScrollBounceBufferTime);
        }

        var documentHeight = Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );

        // 페이지 하단에서 바운스 발생
        if (scrollTop + windowInnerHeight > documentHeight) {
            isScrollBounceActive = true;
            // printLog('safari bounce end!');
            clearTimeout(timerBounceActive);
            timerBounceActive = setTimeout(function () {
                isScrollBounceActive = false;
                checkVisibilityToBackToTop();
                if(document.body.scrollTop > 0) $('.header').addClass('up');
            }, iosScrollBounceBufferTime);
        }
    }

    // // history dropMenu 오픈
    // function openHistoryDropMenu() {
    //     if($('.history-year-dropmenu').length < 1) return;
        
    //     $('.history-year-dropmenu').toggleClass('active');
	// 	$('.history-year-btn').toggleClass('active');
    // }

    // tab 동작 및 접근성
    function controlTabs() {
        if($('.c-tab').length < 1) return;

        // 탭 체인지 함수
        function changeTabs(e) {
            var target = e.target;
            var parent = target.closest('.c-tab__list');
            var grandparent = parent.closest('.c-tab__wrap'); //($('.main').length === 0) ? parent.parentNode.parentNode : parent.parentNode;

            //console.log(parent.parentNode.parentNode);
            if($(target).parents('.c-total-menu--mo').length > 0) {
                parent.classList.remove('inactive');
            }

            // Remove all current selected tabs
            var selectedTabs = parent.querySelectorAll('[aria-selected="true"]');
            for (var i = 0; i < selectedTabs.length; i++) {
                selectedTabs[i].setAttribute('aria-selected', false);
                selectedTabs[i].parentNode.classList.remove('active');
            }

            // Set this tab as selected
            target.setAttribute('aria-selected', true);
            target.parentNode.classList.add('active');

            // start : 타겟 innerText 변경 기능 추가 23-08-02
            var targetInnerText = target.innerText;

            if(document.querySelectorAll('.history-wrap').length > 0 === true) { // history-wrap 분기
                document.querySelector('.history-year-btn').innerText = targetInnerText;
                document.querySelector('.history-year-dropmenu').classList.remove('active'); // 드롭다운 닫기
                document.querySelector('.history-year-btn').classList.remove('active');
            }
            // end : 타겟 innerText 변경 기능 추가 23-08-02

            // Hide all tab panels
            var tabPanels = grandparent.querySelectorAll('[role="tabpanel"]');
            for (var j = 0; j < tabPanels.length; j++) {

                tabPanels[j].setAttribute('hidden', true);

                // 09-25 esg 전략체계도 하단 애니메이션 관련 분기
                if (document.querySelectorAll('.key-class-strategy-info').length > 0 === true) {
                    if($('.c-total-menu--mo').hasClass('open') === false) { // gt.yang 231027 : 모바일에서 1뎁스 클릭시 모든 tabPanels가 노출되는 문제로 수정
                        tabPanels[j].removeAttribute('hidden');
                    }
                    tabPanels[j].classList.remove('panel-on');
                    
					// 2023.10.20 ktw | 특정 해상도에서 레이아웃 틀어짐 수정 1440px
					setTimeout(function() {
						calculateDistanceFromEsgTab();
					},200);
                }
            }

            // Show the selected panel            
            grandparent.parentNode.querySelector('#' + target.getAttribute('aria-controls')).removeAttribute('hidden');

            // 09-25 esg 전략체계도 하단 애니메이션 관련 분기
            if (document.querySelectorAll('.key-class-strategy-info').length > 0 === true) {
                grandparent.parentNode.querySelector('#' + target.getAttribute('aria-controls')).classList.add('panel-on');
            }
        }

        var tabWrap = document.querySelectorAll('.c-tab');
        for (var k = 0; k < tabWrap.length; k++) {
            var tabs02 = tabWrap[k].querySelectorAll('[role="tab"]');
            var tabList02 = tabWrap[k].querySelector('[role="tablist"]');

            // Add a click event handler to each tab
            for (var l = 0; l < tabs02.length; l++) {
                tabs02[l].addEventListener('click', changeTabs);
            }

            // Enable arrow navigation between tabs in the tab list
            var tabFocus = 0;

            tabList02.addEventListener('keydown', function (e) {
            // Move right
            if (e.keyCode === 39 || e.keyCode === 37) {
                tabs02[tabFocus].setAttribute('tabindex', -1);
                if (e.keyCode === 39) {
                    tabFocus++;
                    // If we're at the end, go to the start
                    if (tabFocus >= tabs02.length) {
                        tabFocus = 0;
                    }
                    // Move left
                    } else if (e.keyCode === 37) {
                        tabFocus--;
                    // If we're at the start, move to the end
                    if (tabFocus < 0) {
                        tabFocus = tabs02.length - 1;
                    }
                }

                tabs02[tabFocus].setAttribute('tabindex', 0);
                tabs02[tabFocus].focus();
            }
            });
        }
    }

    function initAccordionInTotalMenu() {
        return false; // gt.yang : 페이지 진입과 전체메뉴 눌렀을때 현재 하이라이트된 메뉴 초기화 되는 문제로 주석 처리
        $('.c-total-menu--mo .c-accordion-menu__depth-01-link').attr('aria-expanded', 'false');
        $('.c-total-menu--mo .c-accordion-menu__depth-01-link').parent('li').removeClass('active');
        $('.c-total-menu--mo .c-accordion-menu__depth-02-list').attr('aria-hidden', 'true');
        $('.c-total-menu--mo .c-accordion-menu__depth-02-list').slideUp('fast');
        $('.c-total-menu--mo .c-accordion-menu__depth-02-list a').removeClass('on');
    }

    // 아코디언 동작 및 접근성
    function controlAccordion() {
        if($('.c-accordion-menu').length < 1) return;

        // 모바일 전체메뉴 tab 클릭시 accordion 설정 풀기
        if($('.c-total-menu--mo').length > 0) {
            $('.c-total-menu--mo .c-tab__list > li > button').on('click', function() {
                initAccordionInTotalMenu();
            });
        }

        $('.c-accordion-menu').each(function () {
            var others = $(this).find('.c-accordion-menu__depth-02-list[aria-hidden]');
            var btn = $(this).find('.c-accordion-menu__depth-01-link[aria-controls]');
            btn.on('click', function () {
                var expanded = $(this).attr('aria-expanded');
                var cont = $(this).attr('aria-controls');
                if (expanded === 'true') {
					if(btn.hasClass('esg-strategy-info') === true) return;

                    $(this).attr('aria-expanded', 'false');
                    $('#' + cont).attr('aria-hidden', 'true').slideUp('fast');
                } else {

                    if($('.key-class-strategy-info').length > 0) {
                        others.attr('aria-hidden', 'true').slideUp(350); // key-class-strategy-info 분기 처리
                    } else {
                        others.attr('aria-hidden', 'true').slideUp('fast');
                    }
                    
                    btn.attr('aria-expanded', 'false');
                    $(this).attr('aria-expanded', 'true');

                    if($('.key-class-strategy-info').length > 0) {
                        $('#' + cont).attr('aria-hidden', 'false').slideDown(350); // key-class-strategy-info 분기 처리
                    } else {
                        $('#' + cont).attr('aria-hidden', 'false').slideDown('fast');
                    }
                }
            });
        });
    }

    // 스와이퍼
    function initSwiper() {
        if($('.swiper-container').length < 1) return;

        if(screenWidth < DEF_MO_BREAK_POINT && responsiveSwiper == undefined) {
            if($('#main').length > 0) {
                responsiveSwiper = new Swiper('.company-wrap .swiper-container', {
                    loop: true,
                    spaceBetween: 20,
                });
            } else {
                responsiveSwiper = new Swiper('.company-wrap .swiper-container', {
                    loop: true,
                    loopAdditionalSlides : 1,
                    centeredSlides: true,
                    spaceBetween: 20,
                    observer: true,
                    observeParents: true,
                });
            }
        } else if(screenWidth > DEF_MO_BREAK_POINT - 1 && responsiveSwiper != undefined) {
            responsiveSwiper.destroy();
            responsiveSwiper = undefined;
            $('.swiper-wrapper').removeAttr('style');
            $('.swiper-slide').removeAttr('style');
        }
    }

    // tw.kim 0822 popup
    function initPopup() {
        if($('.popup-wrap').length < 1) return;
        
        $('.popup-open').on('click', function (e) {
            e.preventDefault();
            var slt = $(this).attr('href');
            $(slt).show().siblings().hide();
            $('.popup-wrap').addClass('active');
            $('body').addClass('body-lock');
        });
    
        $('.btn-popup-close').on('click', function(e){
            $('.popup-wrap').removeClass('active');
            $('body').removeClass('body-lock');
        });
    }
    // tw.kim 0822 popup

    /**
     * @description masonry 콘텐츠에서 스크롤 내릴시 load할 데이터 있으면 추가
     */
    function revealContentOnScroll(className) {
        var rect = footer.getBoundingClientRect();
        var elements = document.querySelectorAll('.' + className);

        if(document.documentElement.lang === 'ko') {
            if (elements.length === 0 || $('.c-masonry + .c-btn--more').length > 0) return;
        }

        if (isContsFirstLoaded === false) {
            isContsFirstLoaded = true;
            if(document.documentElement.lang === 'ko') {
                if(loadMasonryCallbackFunc === null) elements[0].parentNode.removeChild(elements[0]);
            }
            // var cardContsFirstLoadedTimer = setInterval(function () {
            //     isContsFirstLoaded = true;
            //     for (var i = 0; i < elements.length; i++) {
            //         var element = elements[i];
            //         if (element.className.indexOf('active') === -1) {
            //             isContsFirstLoaded = false;
            //             break;
            //         }
            //     }
            //     if (isContsFirstLoaded === true) {
            //         for (var i = 0; i < KBFG.cardContsFirstLoadedTimerArr.length; i++) {
            //             var timer = KBFG.cardContsFirstLoadedTimerArr[i];
            //             clearInterval(timer);
            //         }
            //         KBFG.cardContsFirstLoadedTimerArr = [];

            //         //console.log('페이지 새로고침 후 푸터에서 시작할 경우 : 카드형 콘텐츠 모두 최초 로드 후 추가 콘텐츠 로드');
            //         setAndExecuteCallback(null);
            //     }
            // }, 200);
            // KBFG.cardContsFirstLoadedTimerArr.push(cardContsFirstLoadedTimer);
            setTimeout(function() { loadMasonryData(++startIndexForGroup); }, 1000);  // dev와 합의된 1초 지연 : because test data load
        }

        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            if (dataEnded === true || isContsFirstLoaded === false) return;

            //console.log('페이지 새로고침 후 최상단에서 시작할 경우 : 카드형 콘텐츠 데이터 추가 로드');
            if(loadMasonryCallbackFunc){
                loadMasonryCallbackFunc()
            }else{
                loadMasonryData(++startIndexForGroup);
            }

        }
    }

    function controlToBackToTopBtn() {
        if (KBFG.isMobile(DEF_MO_BREAK_POINT)) {
            $('.back-to-top').css('bottom', $('.footer').height() + 20 + 'px');
        } else {
            $('.back-to-top').css('bottom', $('.footer').height() + 50 + 'px');
        }
        $(".back-to-top__btn").click(function (e) {
            if($('.main').length !== 0) {
                sceneInfo[0].objs.container.classList.remove('active');
                header.classList.remove('scrolled');
            }
            smoothScrollTo('html', 500);
        });
    }

    function checkVisibilityToBackToTop() {
        footerRect = footer.getBoundingClientRect();
        if (footerRect.bottom <= windowInnerHeight + bufferHeightToBackToTop) {
            $backToTop.addClass('visible').removeClass('hidden');
        } else {
            $backToTop.addClass('hidden').removeClass('visible');
        }
    }

    function smoothScrollTo(targetElement, duration) {
        var targetPosition = $(targetElement).offset().top;
        var startPosition = $(window).scrollTop();
        var startTime = null;

        function scrollAnimation(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }

            var elapsedTime = currentTime - startTime;
            var progress = Math.min(elapsedTime / duration, 1);
            var easeInOutQuad = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            var newPosition = startPosition + (targetPosition - startPosition) * easeInOutQuad;

            window.scrollTo(0, newPosition);

            if (progress < 1) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        requestAnimationFrame(scrollAnimation);
    }

    // start : load masonry.json data
    function loadMasonryData(reqStartIndex) {
        if($('.main').length === 0) return false;
        if(loadMasonryCallbackFunc != null) return false;

        var jsonPath = './js/ajax/masonry.json';
        //if(document.documentElement.lang != 'ko') jsonPath = '../js/ajax/masonry.eng.json';
        var btnReadMore = 'Read more';
        if(document.documentElement.lang === 'id') btnReadMore = 'Baca lebih lanjut'
        if(document.documentElement.lang === 'zh') btnReadMore = '更多信息'
        if(document.documentElement.lang === 'jp') btnReadMore = '続きを読む'
        
        $.ajax({
            url : jsonPath,
            method : 'GET',
            dataType : 'json',
            success : function(data) {
                var start = (reqStartIndex - 1) * 9;
                var end = start + 9;
                var items = data.slice(start, end);
                var html = '', imagePath = '';

                if(items.length > 0) {
                    $.each(items, function(index, item) {
                        // console.log(data[index].no + ', ' + data[index].title);
                        index = start + index;
                        imagePath = '';
                        if(data[index].img.indexOf('/images/') > 0) {
                            imagePath = '<figure class="c-card__figure">' +
                            '<img src="' + data[index].img + '" alt="' + data[index].alt + '" class="c-card__thumbnail">' + '</figure>' 
                        }

                        if(document.documentElement.lang !== 'ko') {
                            html += 
                            '<div class="grid-item  ' + (index < 3 ? 'load-active' : '') + '">' +
                                '<a href="' + data[index].url + '" class="c-card c-card--type02">' +
                                    '<div class="c-card__inner">' +
                                        '<span class="c-card__caption">'+ data[index].caption +'</span>' +
                                        '<div class="c-card__title-box">' +
                                            '<span class="c-card__title">'+ data[index].title +'</span>' +
                                        '</div>' + 
                                        imagePath +
                                        '<p class="c-card__link">' + btnReadMore + '</p>' +
                                    '</div>' +
                                '</a>' +
                            '</div>';
                        } else {
                            html += 
                            '<div class="grid-item  ' + (index < 3 ? 'load-active' : '') + '">' +
                                '<a href="#" class="c-card">' +
                                    '<div class="c-card__inner">' +
                                        '<span class="c-card__caption">'+ data[index].caption +'</span>' +
                                        '<div class="c-card__title-box">' +
                                            '<span class="c-card__title">'+ data[index].title +'</span>' +
                                        '</div>' + 
                                        imagePath +
                                        '<p class="c-card__desc">' + data[index].desc +
                                        '</p>' +
                                    '</div>' +
                                '</a>' +
                            '</div>';
                        }
                    });

                    var $newItems = $(html); // Masonry.js 라이브러리의 특성으로 제이쿼리 객체로 한번 감싸줘야함
                    KBFG.$grid.append($newItems).masonry('appended', $newItems); // Masonry 레이아웃에 HTML 문자열을 추가하고 레이아웃을 갱신
                    KBFG.$grid.imagesLoaded().progress(function() {
                        KBFG.$grid.masonry('layout');
                    });

                    if(document.documentElement.lang !== 'ko') $('.c-masonry .grid').css({'height' : ($('.c-masonry .grid').height() + 16) + 'px'});

                } else {
                    //alert('더 이상 로드할 데이터가 없습니다.');
                    //console.log('loadMasonryData : end data');
                    dataEnded = true;
                }
            },
            error : function(request, status, error) {
                console.log(error);
            }
        });
    }

    function setWindowInnerHeight() {
        document.documentElement.style.setProperty('--user-window-inner-height', + window.innerHeight + 'px');
    }

    function controlBgScaleEffect() {
        if($('.info-mission-effect').length === 0) return;

        var body = document.querySelector('body');
        var subVisual = document.querySelector('.sub-visual');
        var wrapper = document.querySelector('.press-content');
        var container = document.querySelector('.sub-page');
        var targetElem = document.querySelector('.info-mission-effect');
        var targetElemBg = document.querySelector('.info-mission-effect-bg');
        var isActiveEsgBgEffect = false;

        if (wrapper === null || targetElemBg === null || container === null) return;

        var wrapperBg = body.style.backgroundColor;
        var docWidth = window.innerWidth || document.documentElement.clientWidth;
        var docHeight = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            body.scrollHeight,
            body.offsetHeight);

        var elementRect = targetElemBg.getBoundingClientRect();
        var distanceToWidthEdge = Math.max(elementRect.left, docWidth - elementRect.right);
        var distanceToHeightEdge = Math.max(window.pageYOffset + elementRect.top, docHeight - (window.pageYOffset + elementRect.top) - elementRect.height);
        var scaleX = (distanceToWidthEdge + elementRect.width) * 2 / elementRect.width;
        var scaleY = (distanceToHeightEdge + elementRect.height) * 2 / elementRect.height;
        var isEnterBgEffectArea = false; // gt.yang 231027 : 모션 활성 시작 영역 설정

        targetElemBg.style.transform = 'scale(' + scaleX + ',' + scaleY + ')';

        targetElemBg.addEventListener('animationend', function () {
            subVisual.style.backgroundColor = wrapperBg;
            wrapper.style.backgroundColor = wrapperBg;
            body.style.overflowX = '';
        })

        window.addEventListener('scroll', function () {
            isEnterBgEffectArea = targetElem.getBoundingClientRect().bottom < windowInnerHeight && targetElem.getBoundingClientRect().top > 0; // gt.yang 231027 : 모션 활성 시작 영역 설정
            if(isEnterBgEffectArea === true && isActiveEsgBgEffect === false) { // gt.yang 231027 : 모션 활성 시작 영역 설정
                isActiveEsgBgEffect = true;

                subVisual.style.backgroundColor = 'transparent';
                wrapper.style.backgroundColor = 'transparent';
                body.style.overflowX = 'hidden';
                container.classList.add('active-effect-bg');
            }
        })
    }

    function setPrint(){
       $('.print-btn').on('click', function(e) {
            e.preventDefault();
            var headerHtml='<html><head>';
            headerHtml+='<title>print</title>';//title

            var wrapperClass = $('#print').attr('class');


            $('head').children('style,link,script').each(function(){
                headerHtml += this.outerHTML;
            });

            headerHtml+='<script type="text/javascript">$(window).load(function(){window.focus();window.print();window.close();});</script>';//print script
            headerHtml+='</head><body><div id="container" class="' + wrapperClass + '"><div style="margin-left:0">';


            var contHtml=$('#print').html();
            var closeHtml='</div></div></body></html>';

            var win = window.open('', 'print', '');
            win.document.write(headerHtml+contHtml+closeHtml);
            win.document.close(); // IE >= 10에 필요
            return true;          
       });
    }

    function calculateDistanceFromEsgTab() {
        if($('.key-class-strategy-info').length === 0) return;

        var distanceFromObj = $('.key-class-strategy-info .info-strategy-tab-list').outerHeight(),
            marginFromObj = 16;

        $('.key-class-strategy-info .c-tab__panel').css('top', distanceFromObj + marginFromObj);
    }

    /**
     * @description 가로축 기준 마지막 요소의 우측 마진을 제거하기 위함.
     * @ToDo 개선 필요
     */
    function highlightLastRowElementInTotalMenu() {
        return false;
        if (KBFG.isMobile(DEF_MO_BREAK_POINT) === true) return false;

        var items = document.querySelectorAll('.c-total-menu__depth-02-item');
        var rowBottoms = []; // 각 가로 줄의 하단 위치를 저장하는 배열
        var currentRowBottom = items[0].getBoundingClientRect().bottom; // 첫 번째 요소의 하단 위치로 초기화

        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('last-row-element');
        }

        // 각 가로 줄의 하단 위치 계산
        for (var i = 0; i < items.length; i++) {
            var itemRect = items[i].getBoundingClientRect();
            if (itemRect.bottom !== currentRowBottom) {
                rowBottoms.push(currentRowBottom);
                currentRowBottom = itemRect.bottom;
            }
        }
        rowBottoms.push(currentRowBottom); // 마지막 가로 줄의 하단 위치 추가

        // 가로 줄의 마지막 요소에 'highlight' 클래스 추가
        for (var j = 0; j < rowBottoms.length; j++) {
            var lastItemIndex = -1;
            for (var k = 0; k < items.length; k++) {
                var itemRect = items[k].getBoundingClientRect();
                if (itemRect.bottom === rowBottoms[j]) {
                    lastItemIndex = k;
                }
            }
            if (lastItemIndex !== -1) {
                items[lastItemIndex].classList.add('last-row-element');
            }
        }
    }

    function controlSubLoaded() {
        if ($('.main').length > 0) return false;

        var idInterval = null;
        var counter = 0;

        idInterval = setInterval( function(){
            if(counter > 10) clearInterval(idInterval);

            checkVisibility('scroll-visible', 100, 50);                
            clearInterval(idInterval);

            counter++;
        }, 300);
    }

    function controlMainLoaded() {
        if ($('.main').length === 0) return false;

        // gt.yang : 낮은 iOS 버전의 safari에서
        // Pull-to-Refresh를 느리게 할 경우
        // 간헐적으로 새로고침 영역이 고정되어 문서 높이가 작아지는 현상으로 분기 처리 
        if(isIosSafari === true) {
            document.addEventListener('touchstart', preventTouchStart, {passive : false});
        } else {
            $('html, body').css({'overflow': 'hidden', 'height': '100%'});
        }

        checkPlaybackStatusVideos('.swiper-slide--1 video');
        checkLoadedImages();
        checkLoadedIframes();

        function checkLoadedImages() {
            //printLog('checking loaded Images...');
            var idInterval = null;
            var counter = 0;

            // test code : because not apply from DEV...
            // KBFG.isLoadingComplete = true;
            // checkMainLoaded();
            // return;

            idInterval = setInterval( function(){
                if(counter > 100) clearInterval(idInterval);

                if(KBFG.isLoadingComplete === true) {
                    var imgElems = document.querySelectorAll('#section_0 img, #section_1 img');
                    for (var i = 0; i < imgElems.length; i++) {
                        var imgObjs = new Image();
                        imgObjs.src = imgElems[i].src;
                        imgObjs.addEventListener('load', function () {
                            loadedImageCount++;
                            if (loadedImageCount === imgElems.length) {
                                //printLog('images load check completed. loadedImageCount = ' + loadedImageCount + ', imgElems.length =' + imgElems.length);
                                KBFG.isLoadingComplete = true;
                                checkMainLoaded();
                            }
                        });
                    }

                    clearInterval(idInterval);
                }

                counter++;
            }, 100);
        }

        function checkLoadedIframes() {
            //if(isLoadedIframes === false) printLog('checking loaded Iframes...');
            var iframes = document.querySelectorAll('iframe');
            var checkTimerLimit = 1500;
            if (iframes.length === 0 || checkIframeCount > 1) {
                isLoadedIframes = true;
                //printLog('Forcefully terminate iframe load check.');
                checkMainLoaded();
                return;
            }
            for (var i = 0; i < iframes.length; i++) {
                iframes[i].addEventListener('load', function () {
                    loadedIframeCount++;
                    if (loadedIframeCount === iframes.length) {
                        //printLog('iframes load check completed. loadedIframeCount = ' + loadedIframeCount + ', iframes.length =' + iframes.length);
                        isLoadedIframes = true;
                        checkMainLoaded();
                        return;
                    }
                });
            }
            /* for (var i = 0; i < iframes.length; i++) {
                window.addEventListener('message', function (event) {
                    var messageLower = event.data.toLowerCase();
                    if (messageLower.indexOf("iframesizer") !== -1 && messageLower.indexOf("init") !== -1) {
                        loadedIframeCount++;
                        if (loadedIframeCount === iframes.length) {
                            printLog('iframes load check completed. loadedIframeCount = ' + loadedIframeCount + ', iframes.length =' + iframes.length);
                            isLoadedIframes = true;
                            checkMainLoaded();
                            return;
                        }
                    }
                });
            } */
            if(isLoadedIframes === false) {
                checkIframeCount++
                window.setTimeout(checkLoadedIframes, checkTimerLimit);
            }
        }

        function checkPlaybackStatusVideos(videoSelector) {
            //printLog('checking loaded Videos...');
            var videoElements = document.querySelectorAll(videoSelector);
            var currentVideo = null;
            var numLoadedVideos = 0;

            if (videoElements.length === 0) {
                isLoadedVideos = true;
                checkMainLoaded();
                return;
            }

            if (videoElements.length > 0) {
                var allReady = true;
                for (var i = 0; i < videoElements.length; i++) {
                    var currentVideo = videoElements[i];
                    if (currentVideo.readyState < 3 || currentVideo.buffered.length === 0) {
                        allReady = false;
                        currentVideo.addEventListener('canplaythrough', handleVideoReady);
                    } else {
                        handleVideoReady();
                    }
                }
                if (allReady) {
                    handleAllVideosLoaded();
                }
            }

            function handleVideoReady() {
                numLoadedVideos++;
                if (numLoadedVideos === videoElements.length) {
                    handleAllVideosLoaded();
                }
                //currentVideo.removeEventListener('canplaythrough', handleVideoReady);
            }

            function handleAllVideosLoaded() {
                //printLog('videos load check completed. numLoadedVideos = ' + numLoadedVideos + ', videoElements.length =' + videoElements.length);
                isLoadedVideos = true;
                checkMainLoaded();
            }
        }

        function checkMainLoaded() {
            var LoaderFadeOutTransitionBufferTime = 300;
            if (KBFG.isLoadingComplete === true) { // && isLoadedIframes === true && isLoadedVideos === true) {
                setLayout();
                setTimeout(function () {
                    if(isIosSafari === true) {
                        document.removeEventListener('touchstart', preventTouchStart, {passive : false});
                    }
                    $('html, body').css({'overflow': '', 'height': ''});
                    sceneInfo[0].objs.container.classList.remove('active');
                    KBFG.closeLoader();
                    //playVideo(0);
                }, LoaderFadeOutTransitionBufferTime);
            }
        }
    }

    // IE 버전 체크 함수
    function getIEVersion() {
        var ua = window.navigator.userAgent;
    
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            // IE 10 이하 버전일 경우
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie), 10));
        }
    
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            // IE 11 이하 버전일 경우
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv), 10));
        }
    
        // IE가 아닌 경우
        return -1;
    }

    function checkIE() {
        var ieVersion = getIEVersion();
        if (ieVersion === -1) {
            //console.log("이 브라우저는 Internet Explorer가 아닙니다.");
        } else {
            //console.log("이 브라우저는 Internet Explorer " + ieVersion + " 버전입니다.");
            var currentURL = window.location.href;
            if (ieVersion === 11 && currentURL.indexOf('10.200.93.141') !== -1) {
                ;
            }
            else {
                // 특정 IP 주소일 때 리다이렉션할 페이지 URL
                var langPath = null;
                if(document.documentElement.lang === 'ko') langPath = 'kor';
                else if(document.documentElement.lang === 'en') langPath = 'eng';
                else if(document.documentElement.lang === 'id') langPath = 'idn';
                else if(document.documentElement.lang === 'zh') langPath = 'chn';
                else if(document.documentElement.lang === 'jp') langPath = 'jpn';
            
                window.location.href = '/' + langPath + '/explorer-end.html';
            }
        }
    }

    function preventTouchStart(e) {
        e.preventDefault();
    }

})(window.jQuery);
/* ready() end */

/* GLOBAL FUNCTION */
function openLoader() {
    KBFG.openLoader();
}

function completeDynamicImages() {
    KBFG.isLoadingComplete = true;
}

function setAndExecuteCallback(callback) {
    loadMasonryCallbackFunc = callback;
}

function openWindowsPopup(url) {
    // sample : http://flowis.co.kr/kbstar/20230725/pop_kor.html
    window.open(url, '_blank', 'width=480, height=383, scrollbars=no, menubar=no');
}

function openWindowsPopupWithTargetSize(url, width, height) {
    window.open(url, '_blank', 'width='+ width +', height=' + height + ', scrollbars=no, menubar=no');
}

function xssReplace(inputString) {
	inputString = inputString.replace("<","&lt;");
	inputString = inputString.replace(">","&gt;");
	inputString = inputString.replace("(","&#40;");
	inputString = inputString.replace(")","&#41;");
	inputString = inputString.replace("&","&#amp;");
	inputString = inputString.replace("#","&#35;");
	inputString = inputString.replace("'","&quot;");
	inputString = inputString.replace("%","<");
	inputString = inputString.replace("alert","<");
	return inputString;
}
