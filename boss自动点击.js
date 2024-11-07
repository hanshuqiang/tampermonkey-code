// ==UserScript==
// @name         boss助手
// @namespace    http://tampermonkey.net/
// @version      2024-07-17
// @description  try to take over the world!
// @author       You
// @match        https://www.zhipin.com/web/geek/*
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
        console.log('初始化...')





        let recJobList = document.getElementsByClassName("rec-job-list")[0];
        // 为 rec-job-list 元素添加点击事件监听器
        recJobList.addEventListener("click", function (event) {

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
    function listionScroll(){
        let jobcardwrap = document.querySelectorAll('.job-card-wrap')

        jobcardwrap && jobcardwrap.forEach(e=>{
            if(e.querySelector('.job-name')){
                let title = e.querySelector('.job-name').innerText
                if(title.indexOf('工程师')==-1
                   && title.toLocaleLowerCase().indexOf('vue')==-1
                   && title.toLocaleLowerCase().indexOf('react')==-1
                   && title.indexOf('程序')==-1
                   && title.indexOf('开发')==-1
                   && title.indexOf('前端')==-1
                   && title.indexOf('后端')==-1
                   && title.toLocaleLowerCase().indexOf('node')==-1

                  ){
                    let jCard = e.querySelector('.job-card-box');
                    jCard.innerHTML=''
                    jCard.style.height='20px'

                }
            }

        })
    }

    setTimeout(liclick, 5000);

    setInterval(listionScroll,1000)

})();
