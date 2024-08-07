// ==UserScript==
// @name        Steam求购单导出工具
// @namespace    http://tampermonkey.net/
// @version      2024-08-05
// @description  Steam求购单导出工具，使用时需要关闭会操作求购单dom的工具，如：Steam价格转换
// @author       You
// @match       https://steamcommunity.com/market/*
// @match       https://www.baidu.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        GM_notification
// @grant       GM.getResourceText
// @grant       GM.xmlHttpRequest
// @grant       GM.openInTab
// @grant       GM.addValueChangeListener
// @grant        GM.getTab
// @resource myTxt1 file:///D:/data1.csv
// @resource myTxt file:///D:/data.csv
// ==/UserScript==

(function() {
    'use strict';




    function convertToUnicode(str) {
        let unicodeStr = '';
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            unicodeStr += "\\u" + charCode.toString(16).padStart(4, '0');
        }
        return unicodeStr;
    }


    async  function initBuyMarket(){

        if( localStorage.getItem('o')){
            let item = JSON.parse( localStorage.getItem('o'));
            Market_ShowBuyOrderPopup( 730, item[0],item[1] );
            await new Promise(resolve => setTimeout(resolve,  3 *1000));

            // 在新标签页的 DOM 上进行操作
            document.getElementById('market_buy_commodity_input_price').value=item[2];
            document.getElementById('market_buy_commodity_input_quantity').value=item[3];
            document.getElementById('market_buyorder_dialog_accept_ssa').click();
            document.getElementById("market_buyorder_dialog_purchase").click()//提交

            // await new Promise(resolve => setTimeout(resolve, 5 *1000));
            function closePage(){
                if(document.getElementById('market_buy_commodity_status').innerText ||document.getElementById('market_buyorder_dialog_error_text').innerText){
                    localStorage.removeItem('o');
                    localStorage.setItem('k','go');

                }
            }
            setTimeout(closePage,500)



        }
    }
    initBuyMarket();

    if(! document.querySelectorAll('.market_home_listing_table')[1].querySelector('.my_market_header')){
        return false;
    }


    // 在页面上添加一个按钮
    var button = document.createElement("button");
    button.id = "exportButton";
    button.textContent = "导出";
    button.style.padding = "5px 10px";
    button.style.margin = " 0 5px 0 0 ";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "4px";
    button.style.cursor = "pointer";
    document.querySelectorAll('.market_home_listing_table')[1].querySelector('.my_market_header').appendChild(button);

    var button2 = document.createElement("button");
    button2.id = "exportButto2n";
    button2.textContent = "导入";
    button2.style.padding = "5px 10px";
    button2.style.margin = " 0 5px 0 0 ";
    button2.style.backgroundColor = "#4CAF50";
    button2.style.color = "white";
    button2.style.border = "none";
    button2.style.borderRadius = "4px";
    button2.style.cursor = "pointer";
    document.querySelectorAll('.market_home_listing_table')[1].querySelector('.my_market_header').appendChild(button2);


    var button3 = document.createElement("button");
    button3.id = "exportButton3";
    button3.textContent = "清空缓存";
    button3.style.padding = "5px 10px";
    button3.style.backgroundColor = "#4CAF50";
    button3.style.color = "white";
    button3.style.border = "none";
    button3.style.borderRadius = "4px";
    button3.style.cursor = "pointer";
    document.querySelectorAll('.market_home_listing_table')[1].querySelector('.my_market_header').appendChild(button3);



    // 绑定按钮点击事件
    document.getElementById("exportButton").addEventListener("click", exportTableToCSV);
    document.getElementById("exportButto2n").addEventListener("click", uploadfile);
    document.getElementById("exportButton3").addEventListener("click", clearCarce);

    function clearCarce(){
        localStorage.removeItem('o');
        localStorage.removeItem('k');
    }

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
        GM_notification({
            text: "导出成功，请在下载文件中查看",
            title: "提示",
            timeout: 3000, // 消失时间, 单位毫秒
            onClick: function() {
                console.log("用户点击了提示");
            }
        });
    }
    function convertCSVtoArray(csvData) {
        var lines = csvData.trim().split("\n");
        var result = [];

        for (var i = 0; i < lines.length; i++) {
            var cells = lines[i].split(",");
            result.push(cells);
        }

        return result;
    }
    function uploadfile(){
        // 读取 CSV 文件
        GM.getResourceText("myTxt1")
            .then(async csvData => {
            let arr = convertCSVtoArray(csvData);
            console.log("CSV data:", arr);

            let curIndex = 0;
            let tableInstent = null;
            function openNTab(){

                let item = arr[curIndex];
                console.log('当前饰品：',item)
                let newTabUrl = 'https://steamcommunity.com/market/listings/730/'+encodeURI(item[0])
                localStorage.setItem('o',JSON.stringify(item))
                tableInstent =  GM.openInTab(newTabUrl,false);
                curIndex +=1;
            }


            function checkLocalStorageValue() {
                if (localStorage.getItem('k') === 'go') {

                    if(tableInstent){

                        tableInstent.then(r=>{
                            console.log(r)
                            tableInstent = null

                            r.close()
                        })

                    }else{
                        localStorage.removeItem('k');
                        openNTab();
                    }

                } else {
                    console.log('Value of "k" is not "go"');
                }


                let checkLocalStorageValue_TIME = setTimeout(checkLocalStorageValue, 3000);
                if(arr.length === curIndex){
                    console.log('清除checkLocalStorageValue')
                    clearTimeout(checkLocalStorageValue_TIME);

                    if(tableInstent){

                        tableInstent.then(r=>{
                            console.log(r)
                            tableInstent = null

                            r.close()
                        })

                    }

                    GM_notification({
                        text: "订单已导入完成，可能有部分因为网络问题导入失败，请再次核对",
                        title: "提示",
                        timeout: 10  * 1000, // 消失时间, 单位毫秒
                        onClick: function() {
                            console.log("用户点击了提示");
                        }
                    });
                }
            }
            openNTab();
            // 启动函数
            checkLocalStorageValue();





        })
            .catch(error => {
            console.error("Error reading CSV:", error);
        });


    }

})();
