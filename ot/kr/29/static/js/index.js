var _addCart = 1;

// 加入购物车事件
function addToCart() {
    if (_addCart <= 0) {
        return false;
    }
    fbq('track', 'AddToCart');
    _addCart--;
}

