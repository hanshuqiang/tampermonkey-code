// ==UserScript==
// @name        Steam求购单导出工具
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Steam求购单导出工具，使用时需要关闭会操作求购单dom的工具，如：Steam价格转换
// @author       You
// @match        https://steamcommunity.com/market/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

        // 在页面上添加一个按钮
    var button = document.createElement("button");
    button.id = "exportButton";
    button.textContent = "导出";
    button.style.padding = "5px 10px";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    document.querySelectorAll('.market_home_listing_table')[1].querySelector('.my_market_header').appendChild(button);

    // 绑定按钮点击事件
    document.getElementById("exportButton").addEventListener("click", exportTableToCSV);

    function exportTableToCSV(){
        let mybuyorder = document.querySelectorAll('.market_home_listing_table')[1]

        let allRows = mybuyorder.querySelectorAll('.market_recent_listing_row')
        let data = [];
        for(var i = 0 ; i<allRows.length; i++){
            let name = allRows[i].querySelector('.market_listing_item_name_link').href.replace('https://steamcommunity.com/market/listings/730/','');
            let zh_name = allRows[i].querySelector('.market_listing_item_name_link').innerText;
            let my_price = allRows[i].querySelector('.market_listing_my_price').innerText;
            let num = allRows[i].querySelector('.market_listing_buyorder_qty').innerText;

            data.push([decodeURI(name),zh_name,my_price,num])
        }
        // 将数据转换为CSV格式
        var csvContent = "data:text/csv;charset=utf-8,";
        data.forEach(function(rowArray) {
            var row = rowArray.join(",");
            csvContent += row + "\n";
        });
        // 创建一个下载链接并触发下载
        var encodedUri = encodeURI(csvContent);
        var link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "table_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

 
})();
