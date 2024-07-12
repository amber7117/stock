$(function(){
    if(window.matchMedia('(max-width:599px)').matches){

        //巟暐偄曽朄偺奐暵
        $(".flow li.pay .detail > div h4").on("click", function() {
            $(this).next("p").slideToggle();
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            }
            else {
                $(this).addClass("active");
            }
        });
        
        //島巘僗儔僀僟乕
        $('.teacher').slick({
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2500,
            swipeToSlide: true,
            dots: true
        });

        //儊僨傿傾僗儔僀僟乕
        $('.media01').slick({
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2500,
            swipeToSlide: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true
        });
        
        //怽崬傒偺僞僽愗傝懼偊
        $(".tab_label").on("click",function(){
            var $th = $(this).index();
            $(".tab_label").removeClass("active");
            $(".tab_panel").removeClass("active");
            $(this).addClass("active");
            $(".tab_panel").eq($th).addClass("active");
        });
        

        //儌乕僟儖
        //僌儘乕僶儖曄悢
        var nowModalSyncer = null ;		//尰嵼奐偐傟偰偄傞儌乕僟儖僐儞僥儞僣
        var modalClassSyncer = "modal-syncer" ;		//儌乕僟儖傪奐偔儕儞僋偵晅偗傞僋儔僗柤

        //儌乕僟儖偺儕儞僋傪庢摼偡傞
        var modals = document.getElementsByClassName( modalClassSyncer ) ;

        //儌乕僟儖僂傿儞僪僂傪弌尰偝偣傞僋儕僢僋僀儀儞僩
        for(var i=0,l=modals.length; l>i; i++){

            //慡偰偺儕儞僋偵僞僢僠僀儀儞僩傪愝掕偡傞
            modals[i].onclick = function(){

                //儃僞儞偐傜僼僅乕僇僗傪奜偡
                this.blur() ;

                //僞乕僎僢僩偲側傞僐儞僥儞僣傪妋擣
                var target = this.getAttribute( "data-target" ) ;

                //僞乕僎僢僩偑懚嵼偟側偗傟偽廔椆
                if( typeof( target )=="undefined" || !target || target==null ){
                    return false ;
                }

                //僐儞僥儞僣偲側傞梫慺傪庢摼
                nowModalSyncer = document.getElementById( target ) ;

                //僞乕僎僢僩偑懚嵼偟側偗傟偽廔椆
                if( nowModalSyncer == null ){
                    return false ;
                }

                //僉乕儃乕僪憖嶌側偳偵傛傝丄僆乕僶乕儗僀偑懡廳婲摦偡傞偺傪杊巭偡傞
                if( $( "#modal-overlay" )[0] ) return false ;		//怴偟偔儌乕僟儖僂傿儞僪僂傪婲摦偟側偄
                //if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//尰嵼偺儌乕僟儖僂傿儞僪僂傪嶍彍偟偰怴偟偔婲摦偡傞

                //僆乕僶乕儗僀傪弌尰偝偣傞
                $( "body" ).append( '<div id="modal-overlay"></div>' ) ;
                $( "#modal-overlay" ).fadeIn( "fast" ) ;

                //僐儞僥儞僣傪僙儞僞儕儞僌偡傞
/*                centeringModalSyncer() ;*/

                //僐儞僥儞僣傪僼僃乕僪僀儞偡傞
                $( nowModalSyncer ).fadeIn( "slow" ) ;

                //[#modal-overlay]丄傑偨偼[#modal-close]傪僋儕僢僋偟偨傜乧
                $( "#modal-overlay,#modal-close" ).unbind().click( function() {

                    //[#modal-content]偲[#modal-overlay]傪僼僃乕僪傾僂僩偟偨屻偵乧
                    $( "#" + target + ",#modal-overlay" ).fadeOut( "fast" , function() {

                        //[#modal-overlay]傪嶍彍偡傞
                        $( '#modal-overlay' ).remove() ;

                    } ) ;

                    //尰嵼偺僐儞僥儞僣忣曬傪嶍彍
                    nowModalSyncer = null ;

                } ) ;

            }

        }

    }
});