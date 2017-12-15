/*
 * Author: 
 * CreateAt: 2017-10-23
 * LastModify: 2017-12-11 
 * Goal: 公司常用功能封装
 * 1. eventHelper, 事件辅助方法
 * 2. ajaxHelper, Ajax辅助方法
 * 3. dateHelper, 时间辅助方法
 * 4. ligerHelper, ligerUI辅助方法
 * 5. financialHelper, 与财务相关的辅助方法
 * 6. strategies, 验证相关的方法
 * 7. testHelper, 测试相关
 * 8. mathHelper, 数学运算
 * 9. ioHelper, 导入和导出 
 * 10. image, 与image相关的常用操作
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

    // 根据传入的url和key使用Ajax获取值并填充到知道id
    var ajaxInsertSingleValue = function (url, key, tag, info, callback) {
        $.ajax({
            type: "post",
            url: url,
            data: info === undefined ? null : info,
            success: function (data) {
                var resultObj = $.parseJSON(data);
                $("#" + tag).text(resultObj.Rows[0][key]);
                if (callback) {
                    callback(resultObj.Rows[0][key]);
                }
            }
        });
    };

    return {
        getSingleValue: getSingleValue,
        ajaxInsertSingleValue: ajaxInsertSingleValue
    };
})();

var dateHelper = (function () {
    var getDateObj, getDateFromString, getDateTime, getCurrentDate;
    // 根据传入的dateTime String(例如: 2017/08/31 11:59:59)返回date(例如: 2017-08-31)
    getDateObj = function (dateStr) {
        if (null == dateStr || undefined == dateStr) {
            return null;
        }

        // dateStr format, see more: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date
        // Todo: add support like '/Date(1328423451489)/, see one way of implement: line 7296 of ligerui.all.js

        return new Date(dateStr);
    };

    getDateFromString = function (dateStr) {
        var date = getDateObj(dateStr);
        return date ? null: date.getFullYear() + '-' + (date.getMonth() + 1) 
                                    + '-' + date.getDate();
    };


    // 根据传入的dateTime String(例如: 2017/08/31 11:59:59)返回date(例如: 2017-08-31 11:59:59)
    getDateTime = function (dateStr) {
        var date = getDateObj(dateStr);
        
        return date ? null: date.getFullYear() + '-' 
                                    + (date.getMonth() + 1) + '-' 
                                    + date.getDate() + ' ' 
                                    + date.getHours() + ':' 
                                    + date.getMinutes() + ':' 
                                    + date.getSeconds();

    };

     // 返回当前时间
     getCurrentDate = function () {
        var date1 = new Date();
        return date1.getFullYear() + '-' + (date1.getMonth()+1) + '-' + date1.getDate() + ' '
                    + date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
     };

    return {
        getDateFromString: getDateFromString,
        getDateTime: getDateTime,
        getCurrentDate: getCurrentDate
    };
})();

// 与ligerUI相关的辅助方法
var ligerHelper = (function () {
    var getSingleFilter, getMultiFilter;
    // 返回ligerUI的单个条件限制
    getSingleFilter = function (key, value, op) {
        return {
            op: 'AND',
            rules: [
                { field: key, value: value, op: op }
            ]
        };
    };

    // 返回ligerUI的多个条件限制
    // getMultiFilter([{key:"", value:"", op:""}...])
    getMultiFilter = function(info) {
        var rule = [];
        for (var i=0; i<info.length; i++) {
            rule.push({ 
                field: info[i].key, 
                value: info[i].value,
                op: info[0].op });
        }
        
        return {
            op: 'AND',
            rules: rule
        };
    };

    return {
        getSingleFilter: getSingleFilter,
        getMultiFilter: getMultiFilter
    };
})();


// 与财务相关的辅助方法
var financialHelper = (function () {
    var convertCurrency;

    convertCurrency = function (money) {
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'), //汉字的数字
            cnIntRadice = new Array('', '拾', '佰', '仟'),        //基本单位
            cnIntUnits = new Array('', '万', '亿', '兆'),         //对应整数部分扩展单位
            cnDecUnits = new Array('角', '分', '毫', '厘'),       //对应小数部分单位
            cnInteger = '整',            //整数金额时后面跟的字符
            cnIntLast = '元',           //整型完以后的单位
            maxNum = 999999999999999.9999,      //最大处理的数字
            integerNum,         //金额整数部分
            decimalNum,         //金额小数部分
            chineseStr = '',    //输出的中文金额字符串
            parts;              //分离金额后用的数组，预定义

        if (money == '') { return ''; }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    }

    return {
        convertCurrency: convertCurrency
    }
})();

// 验证相关的方法
var strategies = {
    isNumber: function (value) {
       return /^[0-9\.]+$/.test(value); 
    }
};

// assert
var testHelper = {
    assert: function (value, msg) {
        if (!value) {
            throw(msg || (value + " does not equal true"));
        }
    },
    assertEqual: function (val1, val2, msg) {
        if (val1 !== val2) {
            throw(msg || (val1 + " does not equal " + val2));
        }
    }
};

var mathHelper = {
    guid : function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        }).toUpperCase();
    }
};

// 处理涉及IO的操作
var ioHelper = (function() {
    var excelExport;
     // 导出Excel
     excelExport = function(rule, url, spName) {
         var form = $("<form>"); //定义一个form表单
         form.attr("style", "display:none");
         form.attr("id", "form1");
         form.attr("target", "");
         form.attr("method", "post");
         form.attr("action", url);

         var input1 = $("<input>");
         input1.attr("type", "hidden");
         input1.attr("name", "view");
         input1.attr("value", spName);

         var input2 = $("<input>");
         input2.attr("type", "hidden");
         input2.attr("name", "where");
         input2.attr("value", JSON2.stringify(rule));

         $("body").append(form); //将表单放置在web中
         form.append(input1);
         form.append(input2);

         form.submit(); //表单提交 
     }

     return {
        excelExport: excelExport
     };
}) ();

var image = (function() {
    var imageView;
    // 弹出图片浏览框
    imageView = function(obj) {
        var url = $(obj).attr("url");
        $.ligerDialog.open({ 
            title: "查看单据图片", 
            target: "<div><img src='" + url + "' style='width:450px;height:450px;'/></div>", 
            height: 500, 
            width: 500 
        });
    }

    return {
        imageView: imageView
    }
})();