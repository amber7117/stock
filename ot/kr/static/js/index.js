window.addEventListener('load', function() {
    //获取左右箭头
    var leftArrow = this.document.querySelector('.left');
    var rightArrow = this.document.querySelector('.right');
 
    // 获取图片 和 小点
    var imgs = this.document.querySelectorAll('.img');
    var dots = this.document.querySelector('.dots').querySelectorAll('span');

    // 给图片添加index 属性，方便判断当前的图片是哪一张
    for (let i = 0; i < imgs.length; i++) {
        imgs[i].setAttribute('data-index', i);
    }
 
    // 获取当前图片 和 图片的数组下标
    var current = this.document.querySelector('.current');
    var currentIndex = current.getAttribute('data-index');
 
    // 左箭头的点击事件，点击了就返回前一张图片 
    // 如果当前图片为第一张那么需要更换到最后一张图片也就是第四张
    leftArrow.addEventListener('click', function() {
        if (currentIndex > 0) {
            imgs[currentIndex].classList.remove('current');
            dots[currentIndex].classList.remove('square');
            imgs[--currentIndex].classList.add('current');
            dots[currentIndex].classList.add('square');
        } else {
            imgs[currentIndex].classList.remove('current');
            dots[currentIndex].classList.remove('square');
            currentIndex = 4;
            imgs[currentIndex].classList.add('current');
            dots[currentIndex].classList.add('square');
        }
    });
 
    // 点击右箭头下一张图片切换
    // 如果当前为第五张图片，那么切换回第一张图片
    rightArrow.addEventListener('click', changeImage);
    //2秒切换一张照片
    var timer = this.setInterval(changeImage, 2000);

    function changeImage(){
        if (currentIndex < 4) {
            imgs[currentIndex].classList.remove('current');
            dots[currentIndex].classList.remove('square');
            imgs[++currentIndex].classList.add('current');
            dots[currentIndex].classList.add('square');
        } else {
            imgs[currentIndex].classList.remove('current');
            dots[currentIndex].classList.remove('square');
            currentIndex = 0;
            imgs[currentIndex].classList.add('current');
            dots[currentIndex].classList.add('square');
        }
    }
 
 
    // 小圆点的点击事件
    for (let k = 0; k < dots.length; k++) {
        dots[k].setAttribute('data-index', k);
        dots[k].addEventListener('click', function() {
            var index = this.getAttribute('data-index');
            if (index != currentIndex) {
                imgs[currentIndex].classList.remove('current');
                dots[currentIndex].classList.remove('square');
                imgs[index].classList.add('current');
                dots[index].classList.add('square');
                currentIndex = index;
            }
 
        })
    }
 
});
