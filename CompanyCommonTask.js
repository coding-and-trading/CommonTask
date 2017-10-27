/*
 * Author: 
 * CreateAt: 2017-10-23
 * LastModify: 
 * Goal: 公司常用功能封装
 * 1. eventHelper, 事件辅助方法
 * 2. ajaxHelper, Ajax辅助方法
 * 3. dateHelper, 时间辅助方法
 * 4. ligerHelper, ligerUI辅助方法
 */

var eventHelper = (function () {
    // 对指定的元素绑定回车事件触发另一指定元素的click事件
    // 通常对页面绑定回车触发搜索按钮
    var pageBindEnter = function (dom, bindElement) {
        $(dom).keydown(function () {
            if (event.keyCode == "13") {//keyCode=13是回车键
                $(bindElement).click();
            }
        });
    };

    return {
        pageBindEnter: pageBindEnter
   }
})();

var ajaxHelper = (function () {
    // 根据传入的url和key使用Ajax获取单个值并返回
    var getSingleValue = function (url, key, info) {
        var result = '';
        $.ajax({
            type: "post",
            url: url,
            async: false, //是否异步
            data: info === undefined ? null : info,
            success: function (data) {
                var resultObj = $.parseJSON(data);
                result = resultObj.Rows[0][key];
            }
        });
        return result;
    };

    return {
        getSingleValue: getSingleValue
    };
})();

var dateHelper = (function () {
    // 根据传入的dateTime String(例如: 2017/08/31 11:59:59)返回date(例如: 2017-08-31)
    var getDateObj = function (dateStr) {
        if (null == dateStr || undefined == dateStr) {
            return null;
        }

        // dateStr format, see more: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date
        // Todo: add support like '/Date(1328423451489)/, see one way of implement: line 7296 of ligerui.all.js

        return new Date(dateStr);
    };

    var getDateFromString = function (dateStr) {
        var date = getDateObj(dateStr);
        return date ? null: date.getFullYear() + '-' + (date.getMonth() + 1) 
                                    + '-' + date.getDate();
    };


    // 根据传入的dateTime String(例如: 2017/08/31 11:59:59)返回date(例如: 2017-08-31 11:59:59)
    var getDateTime = function (dateStr) {
        var date = getDateObj(dateStr);
        
        return date ? null: date.getFullYear() + '-' 
                                    + (date.getMonth() + 1) + '-' 
                                    + date.getDate() + ' ' 
                                    + date.getHours() + ':' 
                                    + date.getMinutes() + ':' 
                                    + date.getSeconds();

    };

    return {
        getDateFromString: getDateFromString,
        getDateTime: getDateTime
    };
})();

// 与ligerUI相关的辅助方法
var ligerHelper = (function () {
    // 返回ligerUI的单个条件限制
    var getSingleFilter = function (key, value, op) {
        return {
            op: 'AND',
            rules: [
                { field: key, value: value, op: op }
            ]
        };
    };

    return {
        getSingleFilter: getSingleFilter
    };
})();