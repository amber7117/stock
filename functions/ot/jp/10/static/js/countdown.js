function countDown() {
  const list = document.querySelectorAll('.webinar-list-sche__item');

  const date_list = [];
  list.forEach(function(elem,index){
    if(!elem.classList.contains('disable')){
      date_list[index] = index;
     }
  });

  const list_last = list[date_list.length - 1];
  const last_date = list_last.lastElementChild.getAttribute('data-entry');

  setInterval(function(){
    const now = new Date();
    const now_year = now.getFullYear();

    const sub_month = last_date.indexOf('月');
    const sub_day = last_date.indexOf('日');
    const sub_hour = last_date.indexOf(':');
    const sub_min = last_date.indexOf('～');

    const month = last_date.substr(0, sub_month);
    const day = last_date.substr(sub_month + 1, sub_day - sub_month - 1);
    const hour = last_date.substr(last_date.indexOf(' ') + 1, (sub_hour - 1) - (last_date.indexOf(' ')));
    const min = last_date.substr(sub_hour + 1, sub_min - (sub_hour + 1));

    const target = new Date(now_year, month - 1, day, hour, min);

    document.querySelectorAll('.count').forEach(function (elem) {
        const remainTime = target - now;

        if(remainTime < 0) return true;

        const difDay = Math.floor(remainTime / 1000 / 60 / 60 / 24) % 365;
        const difHour = Math.floor(remainTime / 1000 / 60 / 60 ) % 24;
        const difMin = Math.floor(remainTime / 1000 / 60) % 60;

        // elem.querySelectorAll('.count--day')[0].innerHTML = `<span class="count__data__inner">${difDay}</span>`;
        elem.querySelectorAll('.count--day')[0].innerHTML = `<span class="count__data__inner">5</span>`;
        elem.querySelectorAll('.count--hour')[0].innerHTML = `<span class="count__data__inner">${difHour}</span>`;
        elem.querySelectorAll('.count--min')[0].innerHTML = `<span class="count__data__inner">${difMin}</span>`;
    });
  }, 1000)
}
countDown();