var LOCALIZE = function(){ return {
'getCurrency' : function(){ return 'KRW'; },
'getCurrencyChar' : function(){ return '₩'; },
'getCurrencyDecimalCount' : function(){ return 0; },
'getCurrencyDecimalChar' : function(){ return '.'; },
'getCurrencyThousandChar' : function(){ return ','; },
'getCurrencyFormat' : function(price){ var _format_string = '%s원'; return _format_string.replace('%s', money_format(price,0,'.',',')); }, 

		'convArguments' : function(){ 
			var msg=arguments[0];
			if (arguments[1].length>0){
				// REQUEST IN getLocalizeString
				if(arguments[1].length === 1 && typeof arguments[1][0] === 'object'){
					for(var i=1; i<=arguments[1][0].length; i++){
						msg = replaceAll(msg, '%'+i, arguments[1][0][i-1]);
						msg = replaceAll(msg, '％'+i, arguments[1][0][i-1]);
					}
				}else{
					for(var i=1; i<=arguments[1].length; i++){
						msg = replaceAll(msg, '%'+i, arguments[1][i-1]);
						msg = replaceAll(msg, '％'+i, arguments[1][i-1]);
					}
				}
			}; 
			return msg; 
		},
'버튼_구매확정' : function(){ return LOCALIZE.convArguments("구매확정", arguments); },
'테스트기창이' : function(){ return LOCALIZE.convArguments("테스트기창이", arguments); },
'타이틀_이름없는질문' : function(){ return LOCALIZE.convArguments("이름 없는 질문", arguments); },
'설명_상품페이지이동불가안내' : function(){ return LOCALIZE.convArguments("해당 상품 페이지로 이동할 수 없습니다.", arguments); },
'버튼_게시중' : function(){ return LOCALIZE.convArguments("게시중", arguments); },
'설명_주문부터적용됩니다수정하시겠습니까' : function(){ return LOCALIZE.convArguments("주문부터 적용됩니다. 수정하시겠습니까?", arguments); },
'설명_기본배송지는삭제할수없습니다' : function(){ return LOCALIZE.convArguments("기본 배송지는 삭제할 수 없습니다.", arguments); },
'설명_최대n개선택' : function(){ return LOCALIZE.convArguments("최대 %1개 선택", arguments); },
'설명_정기결제해지를취소하시겠습니까' : function(){ return LOCALIZE.convArguments("정기결제 해지를 취소하시겠습니까?", arguments); },
'shopPayment_eInvoiceDonateToOptionCode88888' : function(){ return LOCALIZE.convArguments("재단법인 중화민국 소아암 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode555' : function(){ return LOCALIZE.convArguments("대만 기독교 멘노회 의료재단법인 멘노병원", arguments); },
'shopPayment_eInvoiceDonateToOptionCode52668' : function(){ return LOCALIZE.convArguments("사단법인 타이베이시 길고양이 중성화 지원 계획 협회", arguments); },
'shopPayment_eInvoiceDonateToOptionCode8873' : function(){ return LOCALIZE.convArguments("사단법인 대만도농협동조합", arguments); },
'shopPayment_eInvoiceDonateToOptionCode785' : function(){ return LOCALIZE.convArguments("재단법인 민들레 희망 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode8957282' : function(){ return LOCALIZE.convArguments("재단법인 유기동물의집 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode858' : function(){ return LOCALIZE.convArguments("재단법인 천주교 치매노인 사회복지 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode11111' : function(){ return LOCALIZE.convArguments("재단법인 국제 한부모 아동문교 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode88432' : function(){ return LOCALIZE.convArguments("재단법인 다운 증후군 사회복지재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode8835' : function(){ return LOCALIZE.convArguments("재단법인 가톨릭 선목 사회복지 재단", arguments); },
'shopPayment_eInvoiceDonateToOptionCode402' : function(){ return LOCALIZE.convArguments("재단법인 중화민국 자폐 재단", arguments); },
'shopPaymentAlert_selectEInvoiceType' : function(){ return LOCALIZE.convArguments("전자영수증 발행방법을 확인해 주세요.", arguments); },
'설명_내용을입력해주세요' : function(){ return LOCALIZE.convArguments("내용을 입력해주세요.", arguments); },
'설명_선택한상품이없습니다' : function(){ return LOCALIZE.convArguments("선택한 상품이 없습니다", arguments); },
'버튼_정확도순' : function(){ return LOCALIZE.convArguments("정확도순", arguments); },
'버튼_최신순' : function(){ return LOCALIZE.convArguments("최신순", arguments); },
'설명_배송비금액이변경되었습니다' : function(){ return LOCALIZE.convArguments("배송비 금액이 변경되었습니다. 쿠폰 적용이 초기화됩니다.", arguments); },
'설명_게시글차단안내' : function(){ return LOCALIZE.convArguments("게시글을 차단하시겠습니까? 작성자의 다른 글과 댓글도 확인할 수 없습니다.", arguments); },
'설명_게시글차단해제안내' : function(){ return LOCALIZE.convArguments("게시글을 차단 해제하시겠습니까? 작성자의 다른 글과 댓글을 다시 확인할 수 있습니다.", arguments); },
'설명_후기를삭제하시겠습니까' : function(){ return LOCALIZE.convArguments("후기를 삭제하시겠습니까", arguments); },
'타이틀_기본자간' : function(){ return LOCALIZE.convArguments("기본 자간", arguments); },
'타이틀_자간' : function(){ return LOCALIZE.convArguments("자간", arguments); },
'버튼_이미지교체' : function(){ return LOCALIZE.convArguments("이미지 교체", arguments); },
'설명_님을차단안내' : function(){ return LOCALIZE.convArguments("댓글을 차단하시겠습니까? 작성자의 다른 댓글도 확인할 수 없습니다.", arguments); },
'설명_님을차단해제안내' : function(){ return LOCALIZE.convArguments("댓글을 차단 해제하시겠습니까? 작성자의 다른 댓글을 다시 확인할 수 있습니다.", arguments); },
'설명_차단기능횟수를초과했습니다' : function(){ return LOCALIZE.convArguments("차단 가능 횟수를 초과했습니다.", arguments); },
'설명_검색어를입력하세요' : function(){ return LOCALIZE.convArguments("검색어를 입력하세요.", arguments); },
'설명_휴면상태로그아웃' : function(){ return LOCALIZE.convArguments("휴면 상태를 유지하고 로그아웃 합니다.", arguments); },
'설명_휴면상태완료' : function(){ return LOCALIZE.convArguments("휴면해제 완료 되었습니다.", arguments); },
'타이틀_접속량이많아연결이지연' : function(){ return LOCALIZE.convArguments("접속량이 많아 연결이 지연되고 있습니다.", arguments); },
'타이틀_일시적인서비스장애' : function(){ return LOCALIZE.convArguments("일시적인 서비스 장애입니다.", arguments); },
'설명_죄송합니다서버에일시적인문제가생겨' : function(){ return LOCALIZE.convArguments("죄송합니다. 서버에 일시적인 문제가 생겨 열심히 조치하고 있습니다. 빠르게 복구할 수 있도록 최선을 다하겠습니다.", arguments); },
'설명_잠시후다시시도해주세요' : function(){ return LOCALIZE.convArguments("잠시 후 다시 시도해주세요.", arguments); },
'설명_비밀번호확인중입니다' : function(){ return LOCALIZE.convArguments("비밀번호 확인 중입니다. 잠시 기다려주세요.", arguments); },
'설명_업로드에실패하였습니다' : function(){ return LOCALIZE.convArguments("업로드에 실패 하였습니다.", arguments); },
'설명_n기준n시부터n시사이에게시물작성이가능합니다' : function(){ return LOCALIZE.convArguments("%1 기준 %2 ~ %3 사이에 게시물 작성이 가능합니다.", arguments); },
'설명_다음예상결제일과에서확인가능' : function(){ return LOCALIZE.convArguments("* 다음 예상 결제일은 %1입니다.<br>* 구독 일정은 마이페이지 > 정기구독 관리에서 확인 가능합니다.", arguments); },
'버튼_등록하기' : function(){ return LOCALIZE.convArguments("등록하기", arguments); },
'설명_진행중인정기구독주문이있어카드삭제불가' : function(){ return LOCALIZE.convArguments("현재 진행 중인 정기구독 주문이 있어 카드를 삭제할 수 없습니다.<br/>카드 변경 혹은 정기구독 해지 후 카드를 삭제해 주세요.", arguments); },
'설명_등록된자동결제카드를삭제하시겠습니까' : function(){ return LOCALIZE.convArguments("등록된 자동결제 카드를 <br class=\'hidden-lg hidden-md hidden-sm\'/>삭제하시겠습니까?", arguments); },
'설명_이번배송을건너뛰겠습니까다음구독일은n입니다' : function(){ return LOCALIZE.convArguments("이번 배송을 건너뛰겠습니까?<br/>해당 상품의 다음 구독일은<br class=\'hidden-lg hidden-md\'/> <strong>%1</strong> 입니다.", arguments); },
'설명_이번배송을건너뛰겠습니까다음구독일은n입니다선택옵션도함께' : function(){ return LOCALIZE.convArguments("이번 배송을 건너뛰겠습니까?<br/>해당 상품의 다음 구독일은<br class=\'hidden-lg hidden-md\'/> <strong>%1</strong> 입니다.<br>선택옵션도 함께 적용됩니다.", arguments); },
'설명_전체상품의정기구독을해지하시겠습니까' : function(){ return LOCALIZE.convArguments("전체 상품의 정기구독을 <br class=\'hidden-lg hidden-md hidden-sm\'/>해지하시겠습니까?", arguments); },
'설명_해당상품의정기구독을해지하시겠습니까' : function(){ return LOCALIZE.convArguments("해당 상품의 정기구독을 <br class=\'hidden-lg hidden-md hidden-sm\'/>해지하시겠습니까?", arguments); },
'설명_해당상품의정기구독을해지하시겠습니까선택옵션도함께' : function(){ return LOCALIZE.convArguments("해당 상품의 정기구독을 <br class=\'hidden-lg hidden-md hidden-sm\'/>해지하시겠습니까?<br>선택옵션도 함께 해지됩니다.", arguments); },
'설명_타임세일종료까지n일' : function(){ return LOCALIZE.convArguments("타임세일 종료까지 %1일", arguments); },
'설명_상세페이지타임세일종료까지n일' : function(){ return LOCALIZE.convArguments("<label class=\'text-bold text-brand\'>타임세일</label> 종료까지 <strong>%1일</strong>", arguments); },
'설명_종류까지n1시n2분n3초남음' : function(){ return LOCALIZE.convArguments("종료까지 %1:%2:%3 남음", arguments); },
'설명_상세페이지타임세일종료까지n1시n2분n3초남음' : function(){ return LOCALIZE.convArguments("<label class=\'text-bold text-brand\'>타임세일</label> 종료까지 <strong>%1:%2:%3</strong> 남음", arguments); },
'설명_상품할인금액' : function(){ return LOCALIZE.convArguments("상품 할인금액", arguments); },
'설명_만14세미만은가입이불가합니다오류' : function(){ return LOCALIZE.convArguments("만 14세 미만은 가입이 불가합니다. 만 14세 이상임을 확인해주세요", arguments); },
'설명_결제예상금액임시' : function(){ return LOCALIZE.convArguments("총 상품금액(%1개)", arguments); },
'설명_배송지미선택미입력' : function(){ return LOCALIZE.convArguments("배송지가 선택되지 않았거나 배송지 정보가 입력되지 않았습니다.", arguments); },
'설명_이용약관및개인정보처리방침및개인정보제3자동의' : function(){ return LOCALIZE.convArguments("이용약관 및 개인정보 처리방침 및 개인정보 제3자 제공에 동의하셔야 가입이 가능합니다.", arguments); },
'설명_배송지를삭제하시겠습니까' : function(){ return LOCALIZE.convArguments("배송지를 삭제하시겠습니까?", arguments); },
'설명_추천인코드가복사되었습니다' : function(){ return LOCALIZE.convArguments("추천인 코드가 복사되었습니다!", arguments); },
'설명_기부코드를체크해주세요' : function(){ return LOCALIZE.convArguments("기부코드를 체크 해 주세요.", arguments); },
'설명_n개띄어쓰기없음' : function(){ return LOCALIZE.convArguments("%1개", arguments); },
'설명_주문서가새로고침되었습니다' : function(){ return LOCALIZE.convArguments("주문서가 새로고침 되었습니다.", arguments); },
'설명_이전에입력한주문서정보를그대로유지하시겠습니까' : function(){ return LOCALIZE.convArguments("이전에 입력한 주문서 정보를 그대로 유지하시겠습니까?", arguments); },
'설명_작성한내용이모두사라집니다' : function(){ return LOCALIZE.convArguments("작성한 내용이 모두 사라집니다. 작성을 취소하시겠습니까?", arguments); },
'설명_군' : function(){ return LOCALIZE.convArguments("군", arguments); },
'설명_성' : function(){ return LOCALIZE.convArguments("성", arguments); },
'설명_지역' : function(){ return LOCALIZE.convArguments("지역", arguments); },
'설명_구역' : function(){ return LOCALIZE.convArguments("구역", arguments); },
'설명_다운로드불가안내' : function(){ return LOCALIZE.convArguments("다운로드 가능한 파일이 없습니다. \n관리자에게 문의해 주세요.", arguments); },
'버튼_아이디찾기' : function(){ return LOCALIZE.convArguments("아이디 찾기", arguments); },
'설명_대표이미지삭제' : function(){ return LOCALIZE.convArguments("대표 이미지 삭제", arguments); },
'설명_비밀번호재설정링크유효기간만료' : function(){ return LOCALIZE.convArguments("비밀번호 재설정 링크 유효기간이 만료되었습니다. 다시 비밀번호 찾기를 이용해주세요.", arguments); },
'설명_현시' : function(){ return LOCALIZE.convArguments("현시", arguments); },
'설명_향진시구' : function(){ return LOCALIZE.convArguments("향진시구", arguments); },
'설명_2단계인증을진행하지않으면로그인이불가능합니다' : function(){ return LOCALIZE.convArguments("2단계 인증을 진행하지 않으면 로그인이 불가능합니다. 인증을 중단할까요?", arguments); },
'설명_인증번호를입력해주세요' : function(){ return LOCALIZE.convArguments("인증번호를 입력해주세요", arguments); },
'설명_인증이완료되었습니다' : function(){ return LOCALIZE.convArguments("인증이 완료되었습니다.", arguments); },
'설명_수취인이름을n글자이상입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 정보의 수령인 이름을 %1 글자 이상 입력해 주세요", arguments); },
'설명_실시간계좌이체는Windows환경에서만지원합니다' : function(){ return LOCALIZE.convArguments("실시간 계좌이체는 Windows 환경에서만 지원합니다.", arguments); },
'타이틀_반품신청을진행하시겠습니까' : function(){ return LOCALIZE.convArguments("반품 신청을 진행하시겠습니까?", arguments); },
'타이틀_교환신청을진행하시겠습니까' : function(){ return LOCALIZE.convArguments("교환 신청을 진행하시겠습니까?", arguments); },
'타이틀_교환비용결제를진행하시겠습니까' : function(){ return LOCALIZE.convArguments("교환 비용결제를 진행하시겠습니까?", arguments); },
'타이틀_반품신청을철회하시겠습니까' : function(){ return LOCALIZE.convArguments("반품신청을 철회하시겠습니까?", arguments); },
'타이틀_교환신청을철회하시겠습니까' : function(){ return LOCALIZE.convArguments("교환신청을 철회하시겠습니까?", arguments); },
'타이틀_취소신청을철회하시겠습니까' : function(){ return LOCALIZE.convArguments("취소신청을 철회하시겠습니까?", arguments); },
'설명_주문번호혹은모드가없습니다' : function(){ return LOCALIZE.convArguments("주문번호 혹은 모드가 없습니다.", arguments); },
'설명_현금영수증신청이완료되었습니다' : function(){ return LOCALIZE.convArguments("현금영수증 신청이 완료되었습니다.", arguments); },
'설명_대표' : function(){ return LOCALIZE.convArguments("대표", arguments); },
'설명_링크' : function(){ return LOCALIZE.convArguments("링크", arguments); },
'설명_가입중단경고' : function(){ return LOCALIZE.convArguments("추가정보 중 필수항목을 모두 입력해 주셔야 가입이 완료됩니다. 가입을 중단할까요?", arguments); },
'버튼_게시물접근권한없음' : function(){ return LOCALIZE.convArguments("게시물 접근 권한이 없습니다. 해당 사이트 관리자에게 문의하세요.", arguments); },
'설명_일요일약자' : function(){ return LOCALIZE.convArguments("일", arguments); },
'설명_월요일약자' : function(){ return LOCALIZE.convArguments("월", arguments); },
'설명_화요일약자' : function(){ return LOCALIZE.convArguments("화", arguments); },
'설명_수요일약자' : function(){ return LOCALIZE.convArguments("수", arguments); },
'설명_목요일약자' : function(){ return LOCALIZE.convArguments("목", arguments); },
'설명_금요일약자' : function(){ return LOCALIZE.convArguments("금", arguments); },
'설명_토요일약자' : function(){ return LOCALIZE.convArguments("토", arguments); },
'설명_URL입력' : function(){ return LOCALIZE.convArguments("URL 입력", arguments); },
'설명_즐겨찾기등록키안내' : function(){ return LOCALIZE.convArguments("%1 키를 눌러 즐겨찾기에 등록하실 수 있습니다.", arguments); },
'설명_해당옵션필수입니다' : function(){ return LOCALIZE.convArguments("해당 옵션은 필수입니다.", arguments); },
'타이틀_PC모드로보기' : function(){ return LOCALIZE.convArguments("PC 모드로 보기", arguments); },
'타이틀_모바일모드로보기' : function(){ return LOCALIZE.convArguments("모바일 모드로 보기", arguments); },
'설명_이미지등록실패' : function(){ return LOCALIZE.convArguments("%1 이미지 등록에 실패하였습니다.", arguments); },
'안드로이드_서비스이용불가' : function(){ return LOCALIZE.convArguments("현재 시스템 점검으로 인해 서비스 이용이 불가합니다.\n잠시 후 다시 시도해 주시기 바랍니다.", arguments); },
'설명_게시물을불러오는데에실패하였습니다' : function(){ return LOCALIZE.convArguments("게시물을 불러오는 데에 실패하였습니다.", arguments); },
'설명_구매가능회원이아닙니다' : function(){ return LOCALIZE.convArguments("구매 가능 회원이 아닙니다.", arguments); },
'설명_다운로드만료안내' : function(){ return LOCALIZE.convArguments("다운로드 가능 기간 또는 횟수가 초과되었습니다. \n재 구매 후 다시 시도 바랍니다.", arguments); },
'설명_n원' : function(){ return LOCALIZE.convArguments("%1원", arguments); },
'설명_인증메일발송완료' : function(){ return LOCALIZE.convArguments("인증메일을 발송하였습니다.", arguments); },
'설명_가입승인되지않은아이디입니다' : function(){ return LOCALIZE.convArguments("가입승인 대기 중입니다. 운영자의 승인 후 이용하실 수 있습니다.", arguments); },
'설명_회원등급할인' : function(){ return LOCALIZE.convArguments("회원등급 할인", arguments); },
'설명_결제예상금액' : function(){ return LOCALIZE.convArguments("총 상품금액(%1개)", arguments); },
'설명_기기의위치정보검색실패' : function(){ return LOCALIZE.convArguments("기기의 위치정보 검색에 실패 했습니다. 위치수집 설정을 확인해주세요.", arguments); },
'타이틀_s회원가' : function(){ return LOCALIZE.convArguments("%1 회원가", arguments); },
'타이틀_회원할인금액' : function(){ return LOCALIZE.convArguments("회원 할인금액", arguments); },
'설명_현재재고부족으로N개이상구매할수없습니다' : function(){ return LOCALIZE.convArguments("현재 재고 부족으로 %1개 이상 구매할 수 없습니다.", arguments); },
'설명_결제시간이초과되었습니다' : function(){ return LOCALIZE.convArguments("결제시간이 초과되었습니다. 다시 시도해주세요.", arguments); },
'설명_0원상품갯수제한' : function(){ return LOCALIZE.convArguments("해당 선택옵션은 상품 구매 수량 만큼 구매 가능합니다. \n(예: 본상품 5개 구매시 해당 선택 옵션은 5개까지 구매 가능)", arguments); },
'설명_해당선택옵션은최대N개까지구매가능합니다' : function(){ return LOCALIZE.convArguments("해당 선택옵션은 최대 %1개까지 구매 가능합니다.", arguments); },
'설명_디지털상품은수량을변경하실수없습니다' : function(){ return LOCALIZE.convArguments("디지털 상품은 수량을 변경하실 수 없습니다.", arguments); },
'설명_공유에실패하였습니다' : function(){ return LOCALIZE.convArguments("공유에 실패하였습니다.", arguments); },
'설명_삭제하시겠습니까삭제후재등록불가' : function(){ return LOCALIZE.convArguments("해당 구매평을 삭제하시겠습니까? \n(삭제 후 재등록은 불가능합니다.)", arguments); },
'설명_최대이미지크기안내' : function(){ return LOCALIZE.convArguments("%1x%2 이하의 이미지만 업로드 하실 수 있습니다.", arguments); },
'설명_도로명지번을검색해주세요' : function(){ return LOCALIZE.convArguments("도로명 주소 또는 지번 주소를 검색 해주세요.", arguments); },
'설명_장소를수정할수없습니다' : function(){ return LOCALIZE.convArguments("장소를 수정할 수 없습니다.", arguments); },
'설명_최대N개만구매가능한상품입니다' : function(){ return LOCALIZE.convArguments("최대 %1개만 구매 가능한 상품입니다.", arguments); },
'설명_최대구매수량' : function(){ return LOCALIZE.convArguments("최대 구매수량은 %1개 입니다.", arguments); },
'설명_macOS에서ISP결제' : function(){ return LOCALIZE.convArguments("macOS에서는 ISP결제(KB국민, BC, 우리, 저축은행, 전북, 수협, 제주 카드)를 지원하지 않습니다. \n해당 카드로 결제하시려면 모바일로 결제해 주시기 바랍니다.", arguments); },
'설명_최대n개까지선택가능합니다' : function(){ return LOCALIZE.convArguments("최대 %1개까지 선택 가능합니다.", arguments); },
'설명_숨기시겠습니까' : function(){ return LOCALIZE.convArguments("숨기시겠습니까?", arguments); },
'설명_개인정보제3자제공에동의하여주시기바랍니다' : function(){ return LOCALIZE.convArguments("개인정보 제 3자 제공에 동의하여 주시기 바랍니다.", arguments); },
'버튼_복사' : function(){ return LOCALIZE.convArguments("복사", arguments); },
'설명_URL을길게누르면복사할수있습니다' : function(){ return LOCALIZE.convArguments("URL을 길게 누르면 복사 할 수 있습니다.", arguments); },
'설명_URL이복사되었습니다' : function(){ return LOCALIZE.convArguments("URL이 복사되었습니다.", arguments); },
'설명_신고가성공적으로접수되었습니다' : function(){ return LOCALIZE.convArguments("신고가 성공적으로 접수되었습니다.", arguments); },
'타이틀_글쓰기카테고리선택' : function(){ return LOCALIZE.convArguments("카테고리", arguments); },
'타이틀_주문취소를진행하시겠습니까' : function(){ return LOCALIZE.convArguments("주문 취소를 진행하시겠습니까?", arguments); },
'타이틀_예약취소를진행하시겠습니까' : function(){ return LOCALIZE.convArguments("예약 취소를 진행하시겠습니까?", arguments); },
'설명_사이트관리자설정에의해차단된콘텐츠입니다' : function(){ return LOCALIZE.convArguments("사이트 관리자 설정에 의해 차단된 콘텐츠입니다.", arguments); },
'버튼_파일첨부_최대nMB' : function(){ return LOCALIZE.convArguments("파일첨부(최대 %1MB)", arguments); },
'설명_이미지업로드URL이비어있습니다' : function(){ return LOCALIZE.convArguments("이미지 업로드 URL이 비어있습니다.", arguments); },
'설명_파일업로드URL이비어있습니다' : function(){ return LOCALIZE.convArguments("파일 업로드 URL이 비어있습니다.", arguments); },
'설명_파일리스트를확인하세요' : function(){ return LOCALIZE.convArguments("파일 리스트를 확인하세요.", arguments); },
'설명_드래그업로드는지원하지않습니다' : function(){ return LOCALIZE.convArguments("드래그 업로드는 지원하지 않습니다.", arguments); },
'설명_이미지복사붙여넣기기능은지원하지않습니다' : function(){ return LOCALIZE.convArguments("이미지 복사 붙여넣기 기능은 지원하지 않습니다.", arguments); },
'버튼_가로구분선만' : function(){ return LOCALIZE.convArguments("가로 구분선만", arguments); },
'버튼_테두리없음' : function(){ return LOCALIZE.convArguments("테두리 없음", arguments); },
'버튼_테두리진하게' : function(){ return LOCALIZE.convArguments("테두리 진하게", arguments); },
'버튼_Hover효과행단위' : function(){ return LOCALIZE.convArguments("Hover 효과(행 단위)", arguments); },
'버튼_테이블헤더음영' : function(){ return LOCALIZE.convArguments("테이블 헤더 음영", arguments); },
'버튼_줄무늬행' : function(){ return LOCALIZE.convArguments("줄무늬 행", arguments); },
'버튼_모바일에서표형식무시' : function(){ return LOCALIZE.convArguments("모바일에서 표 형식 무시", arguments); },
'버튼_반응형테이블' : function(){ return LOCALIZE.convArguments("반응형 테이블", arguments); },
'버튼_기본버튼' : function(){ return LOCALIZE.convArguments("기본 버튼", arguments); },
'버튼_강조버튼' : function(){ return LOCALIZE.convArguments("강조 버튼", arguments); },
'설명_최소이미지크기안내' : function(){ return LOCALIZE.convArguments("%1x%2 이상의 이미지만 업로드 하실 수 있습니다.", arguments); },
'설명_작성하신대로접수하시겠습니까' : function(){ return LOCALIZE.convArguments("작성하신대로 접수하시겠습니까?", arguments); },
'설명_네이버페이를계속해서진행하시겠습니까' : function(){ return LOCALIZE.convArguments("N페이 결제를 계속해서 진행하시겠습니까?", arguments); },
'버튼_네이버' : function(){ return LOCALIZE.convArguments("네이버", arguments); },
'설명_거리주소' : function(){ return LOCALIZE.convArguments("거리주소 (Street address, P.O box, company name, c/o)", arguments); },
'설명_건물명' : function(){ return LOCALIZE.convArguments("건물명 (Apartment, suite, unit, building, floor, etc.)", arguments); },
'설명_도시명' : function(){ return LOCALIZE.convArguments("도시명 (City)", arguments); },
'설명_도시군' : function(){ return LOCALIZE.convArguments("도시군 (State/Province/Region)", arguments); },
'설명_주문하실상품을선택해주세요' : function(){ return LOCALIZE.convArguments("주문하실 상품을 선택해 주세요.", arguments); },
'설명_테스트결제메시지_이니시스' : function(){ return LOCALIZE.convArguments("현재 테스트 결제 상태입니다.\nKG 이니시스의 경우엔 주문 하신 후 일정시간이 지나면 자동으로 취소 처리가 됩니다.", arguments); },
'설명_페이지를벗어나시겠습니까' : function(){ return LOCALIZE.convArguments("이 페이지를 벗어나시겠습니까?", arguments); },
'설명_국가선택' : function(){ return LOCALIZE.convArguments("국가 선택", arguments); },
'설명_오전' : function(){ return LOCALIZE.convArguments("오전", arguments); },
'설명_오후' : function(){ return LOCALIZE.convArguments("오후", arguments); },
'설명_최대업로드용량안내_게시판' : function(){ return LOCALIZE.convArguments("최대 100MB 까지 업로드 하실 수 있습니다.", arguments); },
'설명_우편번호' : function(){ return LOCALIZE.convArguments("우편번호", arguments); },
'설명_첨부된이미지가없습니다' : function(){ return LOCALIZE.convArguments("첨부된 이미지가 없습니다.", arguments); },
'타이틀_대표이미지설정' : function(){ return LOCALIZE.convArguments("대표 이미지 설정", arguments); },
'타이틀_년' : function(){ return LOCALIZE.convArguments("년", arguments); },
'타이틀_월' : function(){ return LOCALIZE.convArguments("월", arguments); },
'타이틀_일' : function(){ return LOCALIZE.convArguments("일", arguments); },
'설명_가입승인이필요합니다' : function(){ return LOCALIZE.convArguments("가입승인이 필요합니다.", arguments); },
'설명_비밀글입니다' : function(){ return LOCALIZE.convArguments("비밀글입니다.", arguments); },
'설명_주소장소를검색해주세요' : function(){ return LOCALIZE.convArguments("주소, 장소를 검색 해주세요.", arguments); },
'설명_주소검색버튼을눌러주세요' : function(){ return LOCALIZE.convArguments("주소검색 버튼을 눌러서 등록해 주세요.", arguments); },
'설명_검색결과가존재하지않습니다' : function(){ return LOCALIZE.convArguments("검색 결과가 존재하지 않습니다.", arguments); },
'설명_삭제하시겠습니까' : function(){ return LOCALIZE.convArguments("삭제하시겠습니까?", arguments); },
'설명_위치정보검색에문제가있습니다' : function(){ return LOCALIZE.convArguments("위치정보 검색에 문제가 있습니다.", arguments); },
'설명_위치정보검색을허용해주세요' : function(){ return LOCALIZE.convArguments("위치정보 검색을 허용해주세요.", arguments); },
'설명_위치정보를검색하지못했습니다' : function(){ return LOCALIZE.convArguments("위치정보를 검색하지 못했습니다.위치정보 수집기능을 작동시켜주세요", arguments); },
'설명_위치정보검색시간을초과하였습니다' : function(){ return LOCALIZE.convArguments("위치정보 검색 시간을 초과하였습니다.", arguments); },
'설명_위치검색이지원되지않는브라우져입니다' : function(){ return LOCALIZE.convArguments("위치검색이 지원되지 않는 브라우져입니다.", arguments); },
'설명_작성시등록하신비밀번호를입력해주세요' : function(){ return LOCALIZE.convArguments("작성시 등록하신 비밀번호를 입력해주세요.", arguments); },
'설명_테스트결제메시지' : function(){ return LOCALIZE.convArguments("현재 테스트 결제 상태입니다.\n테스트 결제에서는 주문하더라도 실제 과금되지 않으며 실제 주문되진 않습니다.", arguments); },
'설명_접근권한이없습니다' : function(){ return LOCALIZE.convArguments("접근 권한이 없습니다", arguments); },
'설명_최대업로드용량안내' : function(){ return LOCALIZE.convArguments("최대 50MB 까지 업로드 하실 수 있습니다.", arguments); },
'설명_네이버페이찜등록실패' : function(){ return LOCALIZE.convArguments("네이버페이 찜등록 실패 (%1)", arguments); },
'설명_네이버페이상품구매실패' : function(){ return LOCALIZE.convArguments("아직 네이버페이 심사가 진행중(ERR-OR-000001)이거나 연동 오류입니다. (%1)", arguments); },
'설명_성공' : function(){ return LOCALIZE.convArguments("성공", arguments); },
'설명_취소되었습니다' : function(){ return LOCALIZE.convArguments("취소 되었습니다.", arguments); },
'설명_취소요청이접수되었습니다' : function(){ return LOCALIZE.convArguments("취소요청이 접수 되었습니다.", arguments); },
'설명_올바른전화번호를입력하세요' : function(){ return LOCALIZE.convArguments("올바른 전화번호를 입력하세요", arguments); },
'버튼_계속' : function(){ return LOCALIZE.convArguments("계속", arguments); },
'설명_비밀번호변경이완료되었습니다' : function(){ return LOCALIZE.convArguments("비밀번호 변경이 완료되었습니다", arguments); },
'설명_동일한암호로입력하시기바랍니다' : function(){ return LOCALIZE.convArguments("동일한 암호로 입력하시기 바랍니다.", arguments); },
'설명_정상적인암호로입력하시기바랍니다' : function(){ return LOCALIZE.convArguments("정상적인 암호로 입력하시기 바랍니다.(4자이상)", arguments); },
'설명_변경가능시간을초과하였습니다' : function(){ return LOCALIZE.convArguments("변경 가능 시간을 초과 하였습니다.", arguments); },
'설명_비밀번호를입력하세요' : function(){ return LOCALIZE.convArguments("비밀번호를 입력 하세요.", arguments); },
'설명_동의해주세요' : function(){ return LOCALIZE.convArguments("이용약관 및 개인정보 처리방침에 동의하셔야 가입이 가능합니다.", arguments); },
'설명_주소를입력하세요' : function(){ return LOCALIZE.convArguments("주소를 입력하세요", arguments); },
'설명_이미신청중입니다잠시후다시시도하여주시기바랍니다' : function(){ return LOCALIZE.convArguments("이미 신청중입니다. 잠시후 다시 시도하여 주시기 바랍니다.", arguments); },
'설명_거리순정렬이지원되지않습니다' : function(){ return LOCALIZE.convArguments("거리순 정렬이 지원되지 않습니다.", arguments); },
'버튼_상세보기' : function(){ return LOCALIZE.convArguments("상세보기", arguments); },
'설명_생성된그룹이없습니다' : function(){ return LOCALIZE.convArguments("생성된 그룹이 없습니다", arguments); },
'설명_가입되어있지않습니다' : function(){ return LOCALIZE.convArguments("가입되어 있지 않습니다", arguments); },
'설명_개인통관고유부호' : function(){ return LOCALIZE.convArguments("대한민국 법에 따라 일부 해외배송 물품은 개인통관고유부호가 필요합니다. 관세청에서 발급한 개인통관고유부호를 입력해 주세요.", arguments); },
'타이틀_취소환불규정에대한동의를해주세요' : function(){ return LOCALIZE.convArguments("취소/환불 규정에 대한 동의를 해주세요.", arguments); },
'설명_주문자이름을입력해주세요' : function(){ return LOCALIZE.convArguments("주문자 이름을 입력해주세요", arguments); },
'설명_주문자연락처를입력해주세요' : function(){ return LOCALIZE.convArguments("주문자 연락처를 입력해주세요", arguments); },
'설명_이메일을입력해주세요' : function(){ return LOCALIZE.convArguments("이메일을 입력해주세요", arguments); },
'설명_배송지이름을입력해주세요' : function(){ return LOCALIZE.convArguments("배송정보의 수령인 이름을 입력해주세요", arguments); },
'설명_배송지연락처를입력해주세요' : function(){ return LOCALIZE.convArguments("배송정보의 연락처를 입력해주세요", arguments); },
'설명_개인통관고유부호를입력해주세요' : function(){ return LOCALIZE.convArguments("개인통관고유부호를 입력해주세요", arguments); },
'설명_배송지주소를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소를 입력해주세요", arguments); },
'설명_배송지주소City를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소 (City) 를 입력해주세요", arguments); },
'설명_배송지주소State를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소 (State) 를 입력해주세요", arguments); },
'설명_배송지주소Building를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소 (Building) 를 입력해주세요", arguments); },
'설명_배송지주소Street를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소 (Street) 를 입력해주세요", arguments); },
'설명_배송지주소ZipCode를입력해주세요' : function(){ return LOCALIZE.convArguments("배송지 주소 (Zip Code)를 입력해주세요", arguments); },
'설명_수량' : function(){ return LOCALIZE.convArguments("수량", arguments); },
'설명_원' : function(){ return LOCALIZE.convArguments("원", arguments); },
'버튼_저장' : function(){ return LOCALIZE.convArguments("저장", arguments); },
'설명_그룹없음' : function(){ return LOCALIZE.convArguments("그룹없음", arguments); },
'설명_로그인' : function(){ return LOCALIZE.convArguments("로그인", arguments); },
'버튼_삭제' : function(){ return LOCALIZE.convArguments("삭제", arguments); },
'버튼_알림' : function(){ return LOCALIZE.convArguments("알림", arguments); },
'버튼_이미지첨부' : function(){ return LOCALIZE.convArguments("이미지 첨부", arguments); },
'버튼_확인' : function(){ return LOCALIZE.convArguments("확인", arguments); },
'버튼_닫기' : function(){ return LOCALIZE.convArguments("닫기", arguments); },
'버튼_카카오톡' : function(){ return LOCALIZE.convArguments("카카오톡", arguments); },
'버튼_카카오스토리' : function(){ return LOCALIZE.convArguments("카카오스토리", arguments); },
'버튼_라인' : function(){ return LOCALIZE.convArguments("라인", arguments); },
'버튼_밴드' : function(){ return LOCALIZE.convArguments("밴드", arguments); },
'버튼_페이스북' : function(){ return LOCALIZE.convArguments("페이스북", arguments); },
'버튼_트위터' : function(){ return LOCALIZE.convArguments("트위터", arguments); },
'버튼_인스타그램' : function(){ return LOCALIZE.convArguments("인스타그램", arguments); },
'버튼_공유하기' : function(){ return LOCALIZE.convArguments("공유하기", arguments); },
'설명_카카오톡공유는모바일에서만지원합니다' : function(){ return LOCALIZE.convArguments("카카오톡 공유는 모바일에서만 지원합니다.", arguments); },
'설명_라인공유는모바일에서만지원합니다' : function(){ return LOCALIZE.convArguments("라인공유는 모바일에서만 지원합니다.", arguments); },
'설명_필수옵션이모두선택되어있지않습니다' : function(){ return LOCALIZE.convArguments("필수옵션이 모두 선택되어있지 않습니다.", arguments); },
'설명_잘못된접근입니다' : function(){ return LOCALIZE.convArguments("잘못된 접근입니다.", arguments); },
'버튼_메뉴더보기' : function(){ return LOCALIZE.convArguments("더보기", arguments); },
'설명_선택한항목이없습니다' : function(){ return LOCALIZE.convArguments("선택한 항목이 없습니다", arguments); },
'설명_작성권한이없습니다' : function(){ return LOCALIZE.convArguments("작성 권한이 없습니다.", arguments); },
'버튼_더보기' : function(){ return LOCALIZE.convArguments("더보기", arguments); },
'설명_권한이_없습니다' : function(){ return LOCALIZE.convArguments("권한이 없습니다.", arguments); },
'설명_로그인이_필요합니다' : function(){ return LOCALIZE.convArguments("로그인이 필요합니다.", arguments); },
'설명_내용을_입력해주세요' : function(){ return LOCALIZE.convArguments("내용을 입력해주세요", arguments); },
'설명_삭제된_댓글_입니다' : function(){ return LOCALIZE.convArguments("삭제된 댓글입니다.", arguments); },
'설명_비밀번호' : function(){ return LOCALIZE.convArguments("비밀번호", arguments); },
'버튼_취소' : function(){ return LOCALIZE.convArguments("취소", arguments); },
'버튼_로그인' : function(){ return LOCALIZE.convArguments("로그인", arguments); },
'설명_가입승인이_필요한_서비스입니다' : function(){ return LOCALIZE.convArguments("가입승인이 필요한 서비스입니다.", arguments); },
'설명_비밀번호를_입력해주세요' : function(){ return LOCALIZE.convArguments("비밀번호를 입력해주세요.", arguments); },
'타이틀_장바구니' : function(){ return LOCALIZE.convArguments("장바구니", arguments); },
'설명_이메일' : function(){ return LOCALIZE.convArguments("이메일", arguments); },
'설명_주소' : function(){ return LOCALIZE.convArguments("주소", arguments); },
'설명_상세주소' : function(){ return LOCALIZE.convArguments("상세주소", arguments); },
'타이틀_수량' : function(){ return LOCALIZE.convArguments("수량", arguments); },
'설명_품절' : function(){ return LOCALIZE.convArguments("품절", arguments); },
'버튼_주문하기' : function(){ return LOCALIZE.convArguments("주문하기", arguments); },
'설명_장바구니가비어있습니다' : function(){ return LOCALIZE.convArguments("장바구니가 비어있습니다.", arguments); },
'타이틀_총수량' : function(){ return LOCALIZE.convArguments("총수량 <em class=\"text-brand\">%1</em>개", arguments); },
'타이틀_총금액' : function(){ return LOCALIZE.convArguments("총금액", arguments); },
'설명_이미선택된옵션입니다' : function(){ return LOCALIZE.convArguments("이미 선택된 옵션입니다", arguments); },
'설명_택배사또는송장번호가입력되지않았습니다' : function(){ return LOCALIZE.convArguments("택배사 또는 송장번호가 입력되지 않았습니다.", arguments); },
'타이틀_반품교환' : function(){ return LOCALIZE.convArguments("반품/교환", arguments); },
'설명_취소내역이없습니다' : function(){ return LOCALIZE.convArguments("취소 내역이 없습니다.", arguments); },
'설명_주문내역이없습니다' : function(){ return LOCALIZE.convArguments("주문 내역이 없습니다.", arguments); },
'설명_비회원예약안내' : function(){ return LOCALIZE.convArguments("비회원인 경우 예약번호(%1)와 예약자의 연락처번호(%2)로 예약조회가 가능합니다. 꼭 숙지하세요", arguments); },
'설명_정상적으로접수되었습니다' : function(){ return LOCALIZE.convArguments("정상적으로 접수되었습니다", arguments); },
'버튼_응답수정' : function(){ return LOCALIZE.convArguments("응답 수정", arguments); },
'설명_개인정보처리방침에동의하여주시기바랍니다' : function(){ return LOCALIZE.convArguments("개인정보 수집 및 이용에 동의하여 주시기 바랍니다.", arguments); },
'설명_필수항목을입력하여주시기바랍니다' : function(){ return LOCALIZE.convArguments("필수 항목을 입력하여 주시기 바랍니다.", arguments); },
'설명_상세내용이있는경우만입력' : function(){ return LOCALIZE.convArguments("상세 내용이 있는 경우만 입력", arguments); },
'타이틀_하루종일' : function(){ return LOCALIZE.convArguments("하루종일", arguments); },
'설명_검색결과가없습니다' : function(){ return LOCALIZE.convArguments("검색 결과가 없습니다.", arguments); },
'버튼_확인닫기' : function(){ return LOCALIZE.convArguments("확인", arguments); },
'설명_택배사배송정보가업데이트중이거나정보가정확하지않습니다' : function(){ return LOCALIZE.convArguments("택배사 배송정보가 업데이트 중이거나 정보가 정확하지 않습니다.", arguments); },
'설명_해당일정을삭제하시겠습니까' : function(){ return LOCALIZE.convArguments("해당 일정을 삭제하시겠습니까?", arguments); },

}}();