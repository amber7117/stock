$(function () {
  var topBtn = $("#popup-form-btn");
  topBtn.hide();
  //スクロールが100に達したら表示
  $(window).scroll(function () {
    scrollHeight = $(document).height(); //ドキュメントの高さ
    scrollPosition = $(window).height() + $(window).scrollTop(); //現在地
    footHeight = $("footer").innerHeight(); //footerの高さ
    isFooterPositon = scrollHeight - scrollPosition <= footHeight;

    if ($(this).scrollTop() > 1200 && !isFooterPositon) {
      //&&〇〇かつ !〇〇じゃない
      topBtn.fadeIn();
    }
    if ($(this).scrollTop() < 1200) {
      topBtn.fadeOut();
    }
    if (isFooterPositon) {
      //ドキュメントの高さと現在地の差がfooterの高さ以下で
      topBtn.fadeOut();
    }
  });

  //テキストリンクをクリックしたら
  $("#modal-open").click(function () {
    //body内の最後に<div id="modal-bg"></div>を挿入
    $("body").append('<div id="modal-bg"></div>');

    //画面中央を計算する関数を実行
    modalResize();

    //モーダルウィンドウを表示
    $("#modal-bg,#modal-main").fadeIn("slow");

    //画面のどこかをクリックしたらモーダルを閉じる
    $("#modal-bg,.modal-close-btn").click(function () {
      $("#modal-main,#modal-bg").fadeOut("slow", function () {
        //挿入した<div id="modal-bg"></div>を削除
        $("#modal-bg").remove();
      });
    });

    // 画面の左上からmodal-mainの横幅・高さを引き、その値を2で割ると画面中央の位置が計算できる
    $(window).resize(modalResize);
    function modalResize() {
      var w = $(window).width();
      var h = $(window).height();

      var cw = $("#modal-main").outerWidth();
      var ch = $("#modal-main").outerHeight();

      //取得した値をcssに追加する
      $("#modal-main").css({
        left: (w - cw) / 2 + "px",
        top: (h - ch) / 2 + "px",
      });
    }
  });
});
