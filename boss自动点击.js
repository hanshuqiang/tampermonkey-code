// ==UserScript==
// @name         boss助手
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/web/geek/job-recommend
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhipin.com
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
  
    function liclick() {
      console.log('初始化中...')
      let recJobList = document.getElementsByClassName("rec-job-list")[0];
      // 为 rec-job-list 元素添加点击事件监听器
      recJobList.addEventListener("click", function (event) {
         console.log('点击item',event.target.tagName)
          
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
  
