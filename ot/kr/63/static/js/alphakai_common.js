$(document).ready(function(){
	$("#alphakai_gnb > ul > li > ul").each(function(){
		$(this).parent("li").addClass("depth2")
	})

	$("#alphakai_gnb > ul > li").hover(function(){
		if ($(window).width() > 1024){
			$(this).children("ul").stop().slideDown();
		}
	}, function(){
		if ($(window).width() > 1024){
			$(this).children("ul").stop().slideUp();
		}
	})
	

    $("#menuToggle").click(function(){
		$("#wrap").toggleClass("on")
        $("#topMap").stop().slideToggle()
    })

	$(".menuBG").click(function(){
		$("#wrap").removeClass("on")
		$("#topMap").slideUp()
	})

    $("#topMap > div > ul > li > ul").each(function(){
        $(this).parent("li").addClass("depth2")
    })

    $(window).resize(function(){
        if($(window).width() > 1024){
            $("#topMap > div > ul > li > ul").show()
        } else {
            $("#topMap > div > ul > li > ul").hide()
        }
    })

    $(window).scroll(function(){
        if ($("#mExperience .line").hasClass("animated")){
            $("#mExperience .line").addClass("on")
        }
        if ($(".sLanding_case1 .line").hasClass("animated")){
			$(".sLanding_case1 .line").removeClass("on")
            setTimeout(function() {
                $(".sLanding_case1 .line").addClass("on")
            }, 1500)
        }
        if ($(".alpha_contact .line").hasClass("animated")){
            $(".alpha_contact .line").addClass("on")
        }

        /*if ($("#go_top").offset().top > $("#alphakai_footer").offset().top){
            $("#go_top").addClass("fixed")
        } else {
            $("#go_top").removeClass("fixed")
        }*/
    })

    $(window).load(function(){
        if ($("#mExperience .line").hasClass("animated")){
            $("#mExperience .line").addClass("on")
        }
		setTimeout(function() {
			$(".sLanding_case1 .line").addClass("on")
		}, 1500)
		if ($(".alpha_contact .line").hasClass("animated")){
            $(".alpha_contact .line").addClass("on")
        }
    })


    $("#mSolution ul li").click(function(){
        if($(window).width() < 1025){
            $(this).toggleClass("on")
        }
    })
	
	$("#mSolution .hover_content li").hover(function(){
        if($(window).width() > 1024){
			$("#mSolution .hover_box:eq("+ $(this).index() +")").addClass("on")
		}
	}, function(){
        if($(window).width() > 1024){
			$("#mSolution .hover_box:eq("+ $(this).index() +")").removeClass("on")
		}
	})

    $("#go_top").click(function(){
        $("html, body").animate({scrollTop:0})
    })

})

$(document).on("click", "#topMap > div > ul > li.depth2 > a", function(){
    if($(window).width() < 1025){
        $("#topMap > div > ul > li > ul").stop().slideUp();
        $(this).parent().children("ul").stop().slideToggle();

        return false;
    }
})

$(document).ready(function(){
    if (sessionStorage.getItem("modal_popup1") == "close"){
        $(".modal_popup:eq(0)").hide()
    }
    if (sessionStorage.getItem("modal_popup2") == "close"){
        $(".modal_popup:eq(1)").hide()
    }
	
	$(".modal_popup .close_box .close_btn").click(function(){
        if ($(this).prev("label").children("input[name='chkbox']").is(":checked") == true){
            sessionStorage.setItem("modal_popup1", "close");
        }
        if ($(this).prev("label").children("input[name='chkbox1']").is(":checked") == true){
            sessionStorage.setItem("modal_popup2", "close");
        }
		$(this).closest(".modal_popup").hide()
	})
})