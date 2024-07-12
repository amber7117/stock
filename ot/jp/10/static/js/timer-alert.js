const alertTimeSecond = 120 * 60 * 1000; // 2時間(120分)
let alertTimeSetting = Date.now() + alertTimeSecond

var alertTimeId = setInterval(() => {
  if(Date.now() > alertTimeSetting) {
    alertTimeSetting = Date.now() + alertTimeSecond

    // モーダルが表示されているかを取得し、表示されていない場合は表示
    const alertModalTarget = document.getElementById('alertModal')
    if(alertModalTarget && alertModalTarget.style.display === 'none') {
      alertModalTarget.style.display = 'block'
    }
  }
}, 60 * 1000)

function afterTimePass() { // メイン処理
  // 基準時間設定
  const nowDate = new Date()
  const nowYear = nowDate.getFullYear() // 20xx
  const nowMonth = nowDate.getMonth() // 0-11
  const nowHour = nowDate.getHours() // 0-23
  const nowMinutes = nowDate.getMinutes() // 0-59
  const threeHourLater = new Date() // 3時間後を設定
  threeHourLater.setHours(nowDate.getHours() + 3)
  const tomorrowLater = new Date() // 翌日の13時を設定
  tomorrowLater.setDate(nowDate.getDate() + 1)
  tomorrowLater.setHours(13, 0, 0)
  const morningLater = new Date() // 当日の13時を指定
  morningLater.setHours(13, 0, 0)

  // 現在時刻が17:30以降かどうか、もしくは13時以前かどうか
  let hourFlag = ''
  if(nowHour >= 18 || (nowHour === 17 && nowMinutes >= 30)) {
    hourFlag = 'tomorrow'
  }else if(nowHour < 13){
    hourFlag = 'morning'
  }

  // 各要素
  const options = document.getElementById('Userseminar').options // 希望日時セレクトボックス（インデックス番号がずれるのでdisabledのものも含める）
  const buttons = document.querySelectorAll('.webinar-list-sche__button') // フォーム上日程選択
  const spOptions = document.querySelectorAll('.entry-sp__menu.js-sp-seminarbutton') // SP希望日時
  Array.from(options).forEach((option, i) => {
    const value = option.value
    if(value) {
      // セミナー開始時間を日付型で取得
      const seminarMonthIndex = value.indexOf('月')
      const seminarDayIndex = value.indexOf('日')
      const seminarMonth = value.slice(0, seminarMonthIndex)
      const seminarDay = value.slice(seminarMonthIndex + 1, seminarDayIndex)
      const seminarYear = nowMonth <= Number(seminarMonth) ? nowYear : nowYear + 1
      const seminarStart = value.slice(value.indexOf('～') - 5, value.indexOf('～'))
      const seminarDate = new Date(`${seminarYear}/${seminarMonth}/${seminarDay} ${seminarStart}`)
      // 3時間後と比較して開始時間が過ぎている、またはflagによって判定し、非表示にする
      if((threeHourLater > seminarDate) || ((hourFlag === 'tomorrow') && (seminarDate < tomorrowLater)) || ((hourFlag === 'morning') && (seminarDate < morningLater))) {
        option.disabled = true
        if(buttons.length > 0) {
          buttons[i - 1].textContent = "満席"
          buttons[i - 1].parentElement.classList.add('disable')
        }
        if(spOptions.length > 0) {
          spOptions[i - 1].classList.add('entry-sp__disable')
        }
      }
    }
  })

  // 日程選択を初期化してスクロール
  // 初期化
  const seminarSelect = document.getElementById('Userseminar').options
  seminarSelect[0].selected = true
  document.querySelector('.entry__area .entry__selectbox .inner .value').innerText = '参加するセミナーを選択してください'

  // スクロール
  const scrollTarget = $('#seminar')
  const position = scrollTarget.offset().top - 80
  $('html, body').animate({ scrollTop: position }, 750)
}

function createAlertModal() { // ページ表示時にモーダルを仕込む + イベント設定
  // モーダルをbodyの最後に作成
  const body = document.body
  const insertHTML = `
  <div id="alertModal" style="display: none; position: fixed; top: 0; left: 0; z-index: 10000; width: 100vw; height: 100vh; overscroll-behavior: contain; overflow-y: scroll">
    <div style="width: 100%; height: calc(100% + 1px); background-color: rgba(0, 0, 0, .7); top: 0; left: 0">
      <div style="position: absolute; width: calc(100% - 40px); top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 2%; background-color: #fff; box-shadow: 3px 3px 0 0 rgba(0, 0, 0, 0.4)">
        <p style="font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 30px;">一定時間が経過しました。<br>日程を再選択してください</p>
        <div style="text-align: center;">
          <button id="alertModalButton" style="appearance: none; width: auto; padding: 5px 30px; font-size: 18px; border: 2px solid #000; border-radius: 5px; cursor: pointer">OK</button>
        </div>
      </div>
    </div>
  </div>
  `
  body.insertAdjacentHTML('beforeend', insertHTML)

  // ボタンにイベントを設定
  document.getElementById('alertModalButton').addEventListener('click', () => {
    document.getElementById('alertModal').style.display = 'none' // モーダルを閉じる
    afterTimePass()
  })
}

// DOM読み込み時にモーダル生成
document.addEventListener('DOMContentLoaded', createAlertModal)