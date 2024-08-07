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
// ==/UserScript==

(function() {
    'use strict';
    let div =  `
<div class="col" style="border: 0;">
                <div class="info">
                    <div class="f_12px" style="margin-bottom: 6px">
                    余额-支付宝
<a href="javascript:;" class="j_tips_handler" data-title="支付宝汇总" data-content="指定时间段的支付宝余额汇总，提示作用" data-direction="right"><i class="icon icon_qa"></i></a>
                    </div>
                    <div style="margin-top: 4px;"><strong class="f_Strong f_18px" id="frozen_amount_zfb" style="color: #4886FF" >加载中...</strong></div>
                </div>
            </div>
            `
    let zfb_dom = document.createElement('div');
    zfb_dom.innerHTML = div;
    document.querySelector('.user-header > div').appendChild(zfb_dom);

    function fetchAllPageData() {
        let currentPage = 1;
        let totalPages = 1;
        let allData = [];

        function fetchPageData() {
            const timestamp = Date.now(); // 动态生成时间戳参数
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://buff.163.com/api/asset/settle/log/?page_num=${currentPage}&pay_category=alipay_zft&_=${timestamp}`,
                onload: (response) => {
                    const data = JSON.parse(response.responseText);
                    allData = allData.concat(data.data.items);
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

    fetchAllPageData();

})();
