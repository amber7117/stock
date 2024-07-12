// function zpname(params) {
//   console.log("name++++++++++++++++");
// }

// module.exports = { zpname };

// export { name };

// common.js

window.GlobalConst = {
  // eventNames: ["Contact", "Lead", "AnotherEvent"],
  eventNames: [
    { value: "Contact", label: "Contact" },
    { value: "Lead", label: "Lead" },
    { value: "AddToCart", label: "Add To Cart" },
    { value: "Purchase", label: "Purchase" },
  ],
};

// 定义 zpname 函数并绑定到全局对象 window
window.zpname = function () {
  // 函数逻辑
  console.log("终于可以了");
};

window.decodeEntities = (encodedString) => {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = encodedString;
  let decodedString = textArea.value;
  // 删除textarea元素
  textArea.remove();
  const json = JSON.parse(decodedString);
  return json;
};

const isValidJSON = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

window.isValidJSON = isValidJSON;

window.addFBPixel = function (fbPixelsString) {
  // 获取先前创建的 script 元素
  const facebookPixelScript = document.getElementById("facebook-pixel-script");

  // 获取带有 id 的 noscript 元素
  const facebookPixelNoscript = document.getElementById(
    "facebook-pixel-noscript"
  );

  let fbPixels = fbPixelsString;
  if (isValidJSON(fbPixelsString)) {
    fbPixels = JSON.parse(fbPixelsString);
  }
  // 遍历 fbPixels 数组，为每个值创建 dynamicScript
  fbPixels.forEach((fb) => {
    // 创建一个包含动态值的新脚本
    const dynamicScript = document.createElement("script");
    dynamicScript.innerHTML = `
    !(function(f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );
    fbq("init", "${fb.pixelId}");
    fbq("track", "PageView");
  `;

    // 将动态脚本插入到先前创建的 script 元素之前
    facebookPixelScript.parentNode.insertBefore(
      dynamicScript,
      facebookPixelScript
    );

    // 将备用内容设置为 noscript 元素的内容，适用于每个值
    const noscriptContent = `
    <img
      height="1"
      width="1"
      src="https://www.facebook.com/tr?id=${fb.pixelId}&ev=PageView&noscript=1"
    />
  `;
    // 创建一个包含备用内容的新 noscript 元素
    const noscriptElement = document.createElement("noscript");
    noscriptElement.innerHTML = noscriptContent;

    // 将新的 noscript 元素插入到先前创建的 noscript 元素之前
    facebookPixelNoscript.parentNode.insertBefore(
      noscriptElement,
      facebookPixelNoscript
    );
  });
};
