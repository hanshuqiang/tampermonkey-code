// ==UserScript==
// @name         boss助手
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/web/geek/job-recommend
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// ==/UserScript==

// ==UserScript==
// @name         Auto Scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically scroll the page
// @author       Your Name
// @match        https://www.example.com/*
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
  
    function liclick() {
      let recJobList = document.getElementsByClassName("rec-job-list")[0];
      // 为 rec-job-list 元素添加点击事件监听器
      recJobList.addEventListener("click", function (event) {
           console.log('2112',event.target.tagName)
         console.log('22')
          setTimeout(() => {
            if (
              document.getElementsByClassName("op-btn-chat")[0].innerText !==
              "继续沟通"
            ) {
              document.getElementsByClassName("op-btn-chat")[0].click();
              setTimeout(() => {
                document.getElementsByClassName("cancel-btn")[0].click();
              }, 500);
            }
          }, 500);
      });
    }
  
    setTimeout(liclick, 5000);
  
    function autoScroll() {
      document.getElementsByClassName("cancel-btn")[0].click();
    }
  
    // 延迟 2 秒后开始自动滚动
    // setInterval(()=>{
    //   autoScroll()
  
    //  },500)
  })();
  
