// IFrame Player API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


//mov info
function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player(
        'mov', {
            width: 854,
            height: 480,
            videoId: '9_GY8tjpR84', // YouTubeID
            playerVars: {
                rel: 0,
                showinfo: 0,
                loop: 0,
                controls: 1,
                modestbranding: 1
            }
        }
    );

    ytPlayer1 = new YT.Player(
        'mov2', {
            width: 854,
            height: 480,
            videoId: 'QPw2VsaHVrE', // YouTubeID
            playerVars: {
                rel: 0,
                showinfo: 0,
                loop: 0,
                controls: 1,
                modestbranding: 1
            }
        }
    );

    ytPlayer2 = new YT.Player(
        'mov3', {
            width: 854,
            height: 480,
            videoId: 'U_lBDDgrrGA', // YouTubeID
            playerVars: {
                rel: 0,
                showinfo: 0,
                loop: 0,
                controls: 1,
                modestbranding: 1
            }
        }
    );

    ytPlayer3 = new YT.Player(
        'mov4', {
            width: 854,
            height: 480,
            videoId: 'Xws94FkQb58', // YouTubeID
            playerVars: {
                rel: 0,
                showinfo: 0,
                loop: 0,
                controls: 1,
                modestbranding: 1
            }
        }
    );
}


$(function () {


    /*---------------------
    * 声
    ---------------------*/

    $('#btn1').on('click', function () {
        ytPlayer.playVideo(); //動画の再生
        $(this).fadeOut();
        $('#movMsk').fadeOut();
    });

    $('#btn2').on('click', function () {
        ytPlayer1.playVideo(); //動画の再生
        $(this).fadeOut();
        $('#movMsk2').fadeOut();
    });

    $('#btn3').on('click', function () {
        ytPlayer2.playVideo(); //動画の再生
        $(this).fadeOut();
        $('#movMsk3').fadeOut();
    });

    $('#btn4').on('click', function () {
        ytPlayer3.playVideo(); //動画の再生
        $(this).fadeOut();
        $('#movMsk4').fadeOut();
    });

    //page change
    $('.n_b img').on('click', function () {
        $('html,body').animate({
            scrollTop: 0
        }, 10);
        $('.main_section').fadeOut(100);
        $('.next_section').fadeIn(500);
    });

    // copy date
    var now = new Date();
    var y = now.getFullYear();
    $('#copydate').text(y);

});
