function InitContent(generationNumber) {
  const target =
    typeof generationNumber != "undefined" && generationNumber
      ? document.querySelector(`#generation_content_${generationNumber}`)
      : document;
  const accordionList = target.querySelector(".accordion-list");
  if (accordionList) {
    accordionList.addEventListener("click", (event) => {
      const allAccordionItems =
        accordionList.querySelectorAll(".accordion-item");

      for (const accordionItem of allAccordionItems) {
        accordionItem.classList.remove("active");
      }

      let targetElem;
      if (event.target.classList.contains(".accordion-item")) {
        targetElem = event.target;
      } else if (event.target.closest(".accordion-item")) {
        targetElem = event.target.closest(".accordion-item");
      } else {
        targetElem = null;
      }
      if (targetElem) {
        targetElem.classList.add("active");
      }
    });
  }
  if (target.querySelector(".edit-center-list")) {
    new Swiper(target.querySelector(".edit-center-list"), {
      slidesPerView: "auto",
      centeredSlides: true,
      loop: true,
    });
  }
  if (target.querySelector(".carousel-list")) {
    new Swiper(target.querySelector(".carousel-list"), {
      slidesPerView: "auto",
    });
  }

  const toggleBoxs = target
    .querySelectorAll(".qna-toggle-list .box")
    .forEach((toggleBox) => {
      toggleBox.addEventListener("click", (event) => {
        if (toggleBox.classList.contains("active")) {
          toggleBox.classList.remove("active");
        } else {
          toggleBox.classList.add("active");
        }
      });
    });

  if (target.querySelector(".review-swiper-list")) {
    new Swiper(target.querySelector(".review-swiper-list"), {
      slidesPerView: "auto",
      breakpoints: {
        970: {
          slidesPerView: 3,
        },
      },
    });
  }
  if (!target.querySelector("#course_effect")) {
    if (target.querySelector(".course-tab-item[target*=course_effect]")) {
      target
        .querySelector(".course-tab-item[target*=course_effect]")
        .classList.add("dp-hidden");
    }
  }
  bodymovin.loadAnimation({
    container: target.querySelector("#lottie_arrow"), // Required
    path: "https://lottie.host/845a5524-8f9d-4cce-9f3f-01cbb0cb4405/yLCafSq1Do.json", // URL 직접 입력
    //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
    renderer: "svg", // Required
    loop: true, // Optional
    autoplay: true, // Optional
  });

  bodymovin.loadAnimation({
    container: target.querySelector("#lottie_check"), // Required
    path: "https://lottie.host/5db787ab-644a-430e-af36-dc602e9619ef/K47OrHd7P4.json", // URL 직접 입력
    //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
    renderer: "svg", // Required
    loop: true, // Optional
    autoplay: true, // Optional
  });

  bodymovin.loadAnimation({
    container: target.querySelector("#lottie_time"), // Required
    path: "https://lottie.host/88c7d4c1-5d18-4a1c-bccb-549feca519c5/F7LPRyV8Zj.json", // URL 직접 입력
    //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
    renderer: "svg", // Required
    loop: true, // Optional
    autoplay: true, // Optional
  });

  bodymovin.loadAnimation({
    container: target.querySelector("#lottie_info"), // Required
    path: "https://lottie.host/6ba067f5-a991-4522-be86-e6b8ac8ef7e0/BeJxMY4mXu.json", // URL 직접 입력
    //path: 'data.json', // 실제 사용 폴더 지정 ex) data.json
    renderer: "svg", // Required
    loop: true, // Optional
    autoplay: true, // Optional
  });
}
