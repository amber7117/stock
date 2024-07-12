
    (function() {
      var baseURL = "https://cdn.shopify.com/shopifycloud/checkout-web/assets/";
      var scripts = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/runtime.esm.en.1bfa9031b20b036abeed.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/362.esm.en.6a8d23a511138abfaef9.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/750.esm.en.efe6a5bc769c2756b2f3.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/598.esm.en.d312a628c9178663d75b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.esm.en.5d629e768b54dfe9701b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/731.esm.en.cb6b141fdd0e9091a359.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.esm.en.3022099dda4c706e9e03.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/465.esm.en.e955bffd06cf4169566b.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/844.esm.en.07cf81422d5259dc4e42.js","https://cdn.shopify.com/shopifycloud/checkout-web/assets/OnePage.esm.en.9d5d30513281120c1a41.js"];
      var styles = ["https://cdn.shopify.com/shopifycloud/checkout-web/assets/362.esm.en.4cdd9f218b2d3e8993a8.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/app.esm.en.add66e9102ede3337ae8.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/958.esm.en.54c4465ca29d17e976ed.css","https://cdn.shopify.com/shopifycloud/checkout-web/assets/74.esm.en.0e40cab168b5db7dfebb.css"];
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
  