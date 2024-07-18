const updateHeader = (data) => {
	board = data.result.board

	const topTit = document.querySelector("#contentTop h1.topTit")
	const topSubTit = document.querySelector("#contentTop p.topSubTit")
	topTit.innerText = ""
	topSubTit.innerText = ""
}

const getErrorResult = (error) => {
	return error.response ?
							{ 
							resultCode: error.response.status, 
							resultMessage: error.response.statusText 
							}
						: error;
}

const getHomeContentList = async () => {
	const apiHost = ''
	const url = `${apiHost}/api/kbfg/home-contents?page=1&pageSize=30&langCd=KO`;
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	}	

	try {
		let response = await fetch(url, options)
		const data = await response.json();
		return data;
		
	} catch (error) {
		return getErrorResult(error)
	}
}

const apiHost = ''

//상단메뉴 알람추가 alrams
const updateHeaderAlram = (items)=>{
	if(items.length === 0 ){
		return;
	}

	const alarmNextDiv = document.querySelector("div.header__nav-wrap");

	const alramDivHtml = document.querySelector("div.header__banner");
	const alram = items[0]
	const alramHtml = document.createElement("div");
	alramHtml.className = "header__banner"
	alramHtml.setAttribute("aria-hidden", false);
	let alramLink = alram.pcHlink;
	if(alramLink.startsWith("www")){
		alramLink = `https://${alramLink}`;
	}
	alramHtml.innerHTML = `
	<div class="header__banner-inner">
		<a href="${alramLink}" target="${alram.pcLinkTgt}" class="header__banner-link-area">
			<span class="header__banner-title">${alram.pcTitl}</span>
			<span class="header__banner-date hidden-m">${alram.crtYms.substring(0,10)}</span>
			<span class="header__banner-date hidden-p"></span>
		</a>
		<button class="header__banner-close-btn"></button>
	</div>
	`
	// alramDivHtml.append(alramHtml);
	alarmNextDiv.prepend(alramHtml);


}

const updateKeyVisuals=(items, completeFn)=>{
	const kvListHtml = document.querySelector("#section_0 div.swiper-wrapper")
	const kvBListHtml = document.querySelector("#section_0 div.swiper-pagination")
	if(items.length === 1){
		jQuery('div.swiper-pagination span.progress-bar').addClass("hidden");
		jQuery('div.swiper-pagination').addClass("hidden");
		jQuery('button.swiper-player-button').addClass("hidden");
	}
	items.forEach((kv, i) => {
		const temp = document.createElement("div");
		temp.className = `swiper-slide swiper-slide--${i+1}`
		temp.innerHTML = kv.pcFileTyp === 'video/mp4' 
			? `
			<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}">
			<video class="swiper-video viewer hidden-m" autoplay="false" muted="" playsinline="">
			<source src="${apiHost}/api/download-path/board/${kv.pcFileId}/kbfinacialgroup-herovideo-${i+1}" type="${kv.pcFileTyp}" />
			</video>
			<div class="c-kv-text hidden-m">
				<p class="c-kv-text__title">${kv.pcTitl}</p>
				<p class="c-kv-text__desc">${kv.pcSbtl}
				</p>
			</div>
			<video class="swiper-video viewer hidden-p" autoplay="false" muted="" playsinline="">
			<source src="${apiHost}/api/download-path/board/${kv.mobilFileId || kv.pcFileId}/kbfinacialgroup-herovideo-mobile${i+1}" type="${kv.mobilFileTyp || kv.pcFileTyp}" />
			</video>			
			<div class="c-kv-text hidden-p">
				<p class="c-kv-text__title">${kv.mobilTitl || kv.pcTitl}</p>
				<p class="c-kv-text__desc">${kv.mobilSbtl || kv.pcSbtl}</p>
			</div>
			</a>	
			` 
			: `<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}">
			<img class="swiper-image viewer hidden-m" src="${apiHost}/api/download-path/board/${kv.pcFileId}/kbfinacialgroup-heroimage-${i+1}" alt="${kv.pcAlt}"/>
			<div class="c-kv-text hidden-m">
				<p class="c-kv-text__title">${kv.pcTitl}</p>
				<p class="c-kv-text__desc">${kv.pcSbtl}
				</p>
			</div>
			<img class="swiper-image viewer hidden-p" src="${apiHost}/api/download-path/board/${kv.mobilFileId || kv.pcFileId}/kbfinacialgroup-heroimage-mobile${i+1}" alt="${kv.mobilAlt||kv.pcAlt}"/>
			<div class="c-kv-text hidden-p">
				<p class="c-kv-text__title">${kv.mobilTitl || kv.pcTitl}</p>
				<p class="c-kv-text__desc">${kv.mobilSbtl || kv.pcSbtl}</p>
			</div>
			</a>
			`
		kvListHtml.append(temp);
		const tempB = document.createElement("span");
		tempB.className=`swiper-pagination-bullet`
		tempB.setAttribute("tabindex", `${i}`);
		tempB.setAttribute("role", `button`);
		tempB.setAttribute("aria-label", `Go to slide ${i+1}`);
		tempB.innerHTML = `${String(i+1).padStart(2,"0")}
		<span class="progress-bar">
			<span class="progress-inner progress-inner--${i+1} active">
		</span>`
		kvBListHtml.append(tempB);
	})	
	
	if(completeFn!=null){
		setTimeout(()=>{
			completeFn();
		}, 200)
	}
}

const updateRKeyVisuals=(items , completeFn)=>{
	const kvRListHtml = document.querySelector("#kr_area div.c-rolling__wrap")
	const kvRListHtmlM = document.querySelector("#kr_area_mo div.c-rolling__wrap")
	
	items.forEach((kv, i) => {
		const tempR = document.createElement("div");
		tempR.className=`c-rolling__item`
		tempR.innerHTML = kv.pcFileId > 0 
		? 
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<figure class="c-card__figure">
					<img src="${apiHost}/api/download/board/${kv.pcFileId}" alt="${kv.pcAlt}" class="c-card__thumbnail">
				</figure>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		:
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		kvRListHtml.append(tempR);

		const tempRM = document.createElement("div");
		tempRM.className= i===0 ? `c-rolling__item c-rolling__item--mo-first`: `c-rolling__item`
		tempRM.innerHTML = kv.pcFileId > 0 
		? 
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<figure class="c-card__figure">
					<img src="${apiHost}/api/download/board/${kv.mobilFileId}" alt="${kv.mobilAlt}" class="c-card__thumbnail">
				</figure>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		:
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		kvRListHtmlM.append(tempRM);		


	})	

	if(completeFn!=null){
		setTimeout(()=>{
			completeFn();
		}, 200)
	}

}


const updateBLKeyVisuals=(items , completeFn)=>{
	const kvBLListHtml = document.querySelector("#section_1 div.c-rolling.c-rolling--left-side div.c-rolling__wrap")
	items.forEach((kv, i) => {
		const tempBL = document.createElement("div");
		tempBL.className=`c-rolling__item`
		tempBL.innerHTML = kv.pcFileId > 0 && kv.pcFileTyp != null
		? 
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<figure class="c-card__figure">
					<img src="${apiHost}/api/download/board/${kv.pcFileId}" alt="${kv.pcAlt}" class="c-card__thumbnail">
				</figure>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		:
		`<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card">
			<div class="c-card__inner">
				<span class="c-card__caption">${kv.pcCgryCd}</span>
				<div class="c-card__title-box">
					<span class="c-card__title">${kv.pcTitl}</span>
				</div>
				<p class="c-card__desc">${kv.pcSbtl}</p>
			</div>
		</a>`
		kvBLListHtml.append(tempBL);
	})	

	if(completeFn!=null){
		setTimeout(()=>{
			completeFn();
		}, 200)
	}
}

const updateBRKeyVisuals=(items)=>{
	const kvBRHtml = document.querySelector("#br_area")
	const kvBRIECover = document.querySelector("#br_area img.ie-cover__img");
	const kvBRCCover = document.querySelector("#br_area img.c-cover__img");
	
	items.forEach((kv, i) => {
		const tempBR = document.createElement("div");
		tempBR.className=`c-content-wrap c-content-wrap--sticky`
		tempBR.innerHTML = `
		<a href="${kv.pcHlink}" target="${kv.pcLinkTgt}" class="c-card c-card--large-size except white">
		<figure class="c-card__figure">
			<img src="${apiHost}/api/download/board/${kv.pcFileId}" alt="${kv.pcAlt}" class="c-card__img hidden-m">
		</figure>
		<div class="c-card__inner">
			<span class="c-card__caption">${kv.pcCgryCd}</span>
			<div class="c-card__title-box">
				<span class="c-card__title">${kv.pcTitl}</span>
			</div>
			<p class="c-card__desc white">${kv.pcSbtl}</p>
		</div>
	  </a>`
	  const tempMCover = document.createElement("img");
	  tempMCover.className = 'c-cover__img-mo blind';
	  tempMCover.setAttribute("src", `${apiHost}/api/download/board/${kv.mobilFileId}`);
	  kvBRIECover.setAttribute("src", `${apiHost}/api/download/board/${kv.bgImgFileId}`);
	  kvBRCCover.setAttribute("src", `${apiHost}/api/download/board/${kv.bgImgFileId}`);
	  kvBRCCover.parentElement.append(tempMCover);

	  kvBRHtml.append(tempBR);  // <span class="c-card__caption">${kv.pcCgryCd}</span>
	})	
}

const updateMBanner=(items)=>{
	const mbHtml = document.querySelector("#section_2 div.c-content-wrap div.c-banner")
	items.forEach((kv, i) => {
		const tempMB = document.createElement("figure");
		tempMB.className=`c-banner__figure`
		tempMB.innerHTML = `
		<img src="${apiHost}/api/download/board/${kv.pcFileId}" alt="${kv.pcAlt}" class="c-card__img hidden-m">
		<img src="${apiHost}/api/download/board/${kv.mobilFileId||kv.pcFileId}" alt="${kv.mobilAlt||kv.pcAlt}" class="c-card__img hidden-p">
		`
		mbHtml.append(tempMB);
		const tempMBlink = document.createElement("a");
		tempMBlink.className=`c-banner__text`;
		tempMBlink.setAttribute("href", `${kv.pcHlink}`);
		tempMBlink.setAttribute("target", `${kv.pcLinkTgt}`);
		tempMBlink.innerHTML = `
		<p class="c-banner__title">${kv.pcTitl}</p>
		<span class="c-banner__check">${kv.pcSbtl}</span>`
		mbHtml.append(tempMBlink);
	})	
}


    const shuffle = (array) => {
      for (let index = array.length - 1; index > 0; index--) {
        // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
        const randomPosition = Math.floor(Math.random() * (index + 1));

        // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
        const temporary = array[index];
        array[index] = array[randomPosition];
        array[randomPosition] = temporary;
      }
      return [...array]
    }           
          


const updateList = (data) => {
	//const grid = jQuery("#section_2 .c-masonry .grid")
          
        jQuery('.grid').masonry({
            // options
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter : 19.5,
            percentPosition : true,
            horizontalOrder: false,
            visibleStyle: { transform: 'translateY(0)', opacity: 0 },
            hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
        });
          /*
          jQuery('.grid').masonry({
          // options
          itemSelector: '.grid-item',
          columnWidth: '.grid-sizer',
          gutter: '.gutter-sizer',
          percentPosition : true,
          horizontalOrder: false,
          visibleStyle: { transform: 'translateY(0)', opacity: 0 },
          hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
        });*/
	items = shuffle(data.result.posts);
	
	items.forEach((post, i) => {
          let html = '';
		const temp = document.createElement("div");
		temp.className = 'c-rolling__item'
		//temp.innerHTML 
		let imgSrc = ''
		let fiqureHtml = ''
		let contentLink = ''
		if(post.bulbdId=== 8){
			contentLink = `/kor/pr/press/view.htm?CONTENT=${post.bltcId}&B=8&QUERY=list.htm`
			// 보도자료만 썸네일
			if(post.thmbLoc!=null){
			   imgSrc = post.thmbLoc
			   fiqureHtml = `
			 <figure class="c-card__figure">
			   <img
				 src="${imgSrc}"
				 alt="${post.thmbAlt}"
				 class="c-card__thumbnail"
			   />
			 `
			   /*
				*/
		   }else if( post.files.length > 0 && post.fileGroupId>0){
				console.log('post', post);
				let file = post.files[0];
				imgSrc = (file.dataTyp === 'migration') 
					? post.fileNm 
					: `/api/download/board/${post.files[0].fileId}`
				fiqureHtml = `
				<figure class="c-card__figure">
				  <img
					src="${imgSrc}"
					alt="${file.dsplFileNm || post.titl}"
					class="c-card__thumbnail"
				  />
				`
			}
		}else{
			// 공지사항
			contentLink = `/kor/pr/notice/view.htm?CONTENT=${post.bltcId}&B=9&QUERY=list.htm`
		}
		let sumry = (post.bulbdId=== 8)? `<p class="c-card__desc">${post.sumry}</p>` : `<p class="c-card__desc">${post.rgcrYms.substring(0,10)}</p>`

		html = `
		<div class="grid-item ${(i < 3) ? 'load-active' : ''}">
        <a href="${contentLink}" class="c-card">
          <div class="c-card__inner">
            <span class="c-card__caption">${post.bulbdNm}</span>
            <div class="c-card__title-box">
              <span class="c-card__title">${post.titl}</span>
            </div>
            <!-- 카드 썸네일 -->
            ${fiqureHtml}
            <!-- // 카드 썸네일 -->
            ${sumry}
          </div>
        </a>
		</div>`
       
        var $newItems = jQuery(html); // Masonry.js 라이브러리의 특성으로 제이쿼리 객체로 한번 감싸줘야함
         
          jQuery(".grid").append($newItems).masonry('appended', $newItems);
          $newItems.imagesLoaded().done(function() {  
            jQuery(".grid").masonry('layout');
          });         
		});
            
       
        jQuery(".grid").imagesLoaded().done(function() {
       jQuery(".grid").masonry('reloadItems');     
            jQuery(".grid").masonry('layout');
        });
                  
      }

/** KR 최신홈컨텐츠 조회 */
const latestContentParams = {
	pageSize : 9,
	page:0,
	totalPageCount:0,
	totalCount:0,
}

function getLatestContent(){
	latestContentParams.page = latestContentParams.page + 1;

	if(latestContentParams.page>1){
		//  최종 16개 까지만 노출해야 한다.
		return;
	}

	const apiHost = ''
	//const bulbdDetailUrl = `${apiHost}/api/kbfg/board/${bulbdId}`
	const url = `${apiHost}/api/kbfg/home-posts?page=${latestContentParams.page}&pageSize=${latestContentParams.pageSize}`
	const options = {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		}
	}

	// 게시물 목록
	fetch(url, options)
		.then(
			async (response) => {
				const data = await response.json();
				updateList(data);

			}
		).catch((error) => {
			console.log("error:", error)
		})
		.finally(()=>{

		})
		
		;

	return 1;	

}


const updateMasonaryCallbackFn = ()=>{
	if(typeof(loadMasonryCallbackFunc)==='object'){
	  loadMasonryCallbackFunc = getLatestContent
	  console.log("callbackfunction loaded...")
		// 전체 데이터가 로드되있어야 한다. 
		// window.dispatchEvent(new Event("resize"));
		
		getLatestContent();
		clearInterval(updateMasonaryCallbackFn);

		completeDynamicImages();
	}
  }

                  
                 
                  
                  
                  
document.addEventListener("DOMContentLoaded", async ()=>{


	
	// const res = await getHomeContentList({})
	// console.log("^^ ~ file: index.js:181 ~ res:", res)
	// 컨텐츠 상세
	/*
	fetch(bulbdDetailUrl, options)
	.then(
		async (response) =>{
			const data = await response.json();
			updateHeader(data);
		}
		).catch((error) => console.log("error:", error));
		*/
	/* 홈컨텐츠 조회 */
	let alrams = []
	let keyvisuals = []
	let rKeyvisuals = []
	let blKeyvisuals = []
	let brKeyvisuals = []
	let mBanners = []

	const res = await getHomeContentList();
	// 홈컨텐츠 정보조회 성공
	if (res.resultCode === 200) {
		const { homeContents } = res.result;

		// homeContents.forEach(item=>{
		// 	item.mobilFileId = null 
		// })

		// todo 디자인변경
		blKeyvisuals = homeContents
			.filter((item, i) => item.locCd === 'BLK') 
		updateBLKeyVisuals(blKeyvisuals, ()=>{

			brKeyvisuals = homeContents
				.filter((item, i) => item.locCd === 'BRK') 
				.filter((item, i) => i === 0);
			updateBRKeyVisuals(brKeyvisuals)
	
			mBanners = homeContents
				.filter((item, i) => item.locCd === 'MB') 
				.filter((item, i) => i === 0);
			updateMBanner(mBanners)

		})



		alrams = homeContents
		.filter((item, i) => item.locCd === 'ALM') // 키비쥬얼만 가져오기
		.filter((item, i) => i < 1); // 최대 1개 까지만
		updateHeaderAlram(alrams)

		keyvisuals = homeContents
			.filter((item, i) => item.locCd === 'TK') // 키비쥬얼만 가져오기
			.filter((item, i) => i < 5); // 최대 5개 까지만
		updateKeyVisuals(keyvisuals, ()=>{})
		
		//KV 추가후 실행
		rKeyvisuals = homeContents
			.filter((item, i) => item.locCd === 'RK') 
		updateRKeyVisuals( rKeyvisuals, ()=>{} )
		
		 










		/* 최근개시물 9 + 9 [KR] */
		
		//getLatestContent();


	}else{
		console.log("keyvisual res", res)
	}
	
	console.log("load commonjs")
	let commonJs = document.createElement("script");
	commonJs.setAttribute("src", "/templets/kbfg/web/kor/js/common.js");
	setTimeout(()=>{
		document.head.appendChild(commonJs);


		setInterval(
			updateMasonaryCallbackFn
		  , 500)


	},200)





});



