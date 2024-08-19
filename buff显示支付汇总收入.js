// ==UserScript==
// @name         Buff显示支付宝汇总余额
// @namespace    http://tampermonkey.net/
// @version      2024-08-07
// @description  try to take over the world!
// @author       You
// @match        https://buff.163.com/user-center/asset/
// @match        https://buff.163.com/user-center/asset/recharge/
// @match        https://buff.163.com/user-center/asset/withdraw/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.4/jquery.min.js
// ==/UserScript==

GM_addStyle(`
  .my-popup {
  width:200px;
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .my-popup input {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 8px 0;
    border: 1px solid #ccc;
    border-radius: 3px;
  }

  .my-popup button {
    padding: 8px 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
  }
`);


(function() {
    'use strict';
    let div =  `
<div class="col" style="border: 0;">
                <div class="info">
                    <div class="f_12px" style="margin-bottom: 6px">
                    余额-支付宝

<a href="javascript:;" id="btn_zfb_config" class="j_tips_handler" data-title="设置" data-content="设置指定时间段的支付宝余额汇总，提示作用" data-direction="right"><i class="icon icon_menu icon_menu_setting"></i></a>
                    </div>
                    <div style="margin-top: 4px;"><strong class="f_Strong f_18px" id="frozen_amount_zfb" style="color: #4886FF" >加载中...</strong></div>
                </div>
            </div>
            `
    let zfb_dom = document.createElement('div');
    zfb_dom.innerHTML = div;
    document.querySelector('.user-header > div').appendChild(zfb_dom);

    function initDialogZfb(){
        // 创建弹框
        let popup = document.createElement('div');
        popup.classList.add('my-popup');
        popup.innerHTML = `
    开始日期： <input type="date" id="btn_zfb_config_start" placeholder="开始日期">
  结束日期：  <input type="date" id="btn_zfb_config_end" placeholder="结束日期">
    <button id="save-button">保存</button>
  `;

        // 点击div显示弹框
        document.getElementById('btn_zfb_config').addEventListener('click', function() {
            popup.style.display = 'block';
        });

        // 保存按钮点击事件
        popup.addEventListener('click', function(event) {
            if (event.target.id === 'save-button') {
                // 获取输入框的值
                let value1 = document.getElementById('btn_zfb_config_start').value;
                let value2 = document.getElementById('btn_zfb_config_end').value;

                // 保存到本地存储
                GM_setValue("btn_zfb_config_start", value1);
                GM_setValue("btn_zfb_config_end", value2);

                // 关闭弹框
                popup.style.display = 'none';
                fetchAllPageData();
            }
        });

        // 将弹框添加到页面
        document.body.appendChild(popup);

        let value1 = GM_getValue("btn_zfb_config_start");
        let value2 = GM_getValue("btn_zfb_config_end");
        document.getElementById('btn_zfb_config_start').value = value1;
        document.getElementById('btn_zfb_config_end').value = value2;
    }



    function fetchAllPageData() {
        let currentPage = 1;
        let totalPages = 1;
        let allData = [];
        document.getElementById('frozen_amount_zfb').innerText='加载中...';
        function fetchPageData() {
            let btn_zfb_config_start = GM_getValue("btn_zfb_config_start");
            let btn_zfb_config_end = GM_getValue("btn_zfb_config_end");
            const timestamp = Date.now(); // 动态生成时间戳参数
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://buff.163.com/api/asset/settle/log/?page_num=${currentPage}&pay_category=alipay_zft&_=${timestamp}`,
                onload: (response) => {
                    const data = JSON.parse(response.responseText);
                    if(Array.isArray(data?.data?.items)){
                        data?.data?.items.forEach(item=>{


                            const dateS = new Date(btn_zfb_config_start).getTime()/1000;
                            const dateE = new Date(btn_zfb_config_end).getTime()/1000;



                            if(item.created_at>dateS &&item.created_at <dateE ){
                                allData.push(item)
                            }
                        })
                    }
                    // allData = allData.concat(data.data.items);
                    totalPages = data.data.total_page;

                    if (currentPage < totalPages) {
                        currentPage++;
                        fetchPageData();
                    } else {
                        // 所有数据获取完成

                        const totalAmount = allData.reduce((acc, item) => {
                            return acc + parseFloat(item.amount);
                        }, 0);
                        document.getElementById('frozen_amount_zfb').innerText="￥"+totalAmount.toFixed(2)
                    }
                }
            });
        }

        fetchPageData();
    }
    initDialogZfb();
    fetchAllPageData();

})();
