
    (function() {
      var baseURL = "https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/runtime.esm.en.0b745e92b4d3aa997dda.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/512.esm.en.11914180e30dee039c42.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/750.esm.en.efe6a5bc769c2756b2f3.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/598.esm.en.204d3a9ad96eabcc4506.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/app.esm.en.5d391c8e6aea42a425af.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/731.esm.en.cb6b141fdd0e9091a359.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/958.esm.en.31704f22b90e7547723c.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/465.esm.en.e955bffd06cf4169566b.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/844.esm.en.07cf81422d5259dc4e42.js","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/Redesign.esm.en.dd5ff0b0a81742bb8e42.js"];
      var styles = ["https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/512.esm.en.529087c9dc80cb4ad686.css","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/app.esm.en.4f985f12761b60fdbbe8.css","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/958.esm.en.54c4465ca29d17e976ed.css","https://cdn.shopifycdn.net/shopifycloud/checkout-web/assets/661.esm.en.458b7b5a1910698c92ca.css"];
      var fontPreconnectUrls = [];
      var fontPrefetchUrls = [];
      var imgPrefetchUrls = [];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [baseURL].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res[0], next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        })();
      }

      function onLoaded() {
        preconnectAssets();
        prefetchAssets();
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  