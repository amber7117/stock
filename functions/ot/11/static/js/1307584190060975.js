

function hello() {
    fbq('track', 'ViewContent', {
        content_name: 'View content in 10 seconds',
        value: 1.00,
    });
}
var t1 = window.setTimeout(hello, 1000);
var t2 = window.setTimeout("hello()", 10000);
window.clearTimeout(t1);

function ClickLink() {
    fbq('track', 'AddToCart');
    fbq('track', 'Purchase', { value: 30.00, currency: 'USD' });
    window.location.href = "https://tw.izhengu.top/kf";
}

window.addEventListener('DOMContentLoaded', function (event) {
    document.querySelectorAll("[href^='https://tw.izhengu.top/kf']").forEach(function (e) {
        e.addEventListener('click', function (e) {
            fbq('track', "Lead", {
                content_name: 'Jump to LINE',
                content_category: 'voucher',
                value: 1.00,
            });
        });
    })
});
