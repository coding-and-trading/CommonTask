/*
 * Author: 
 * CreateAt: 2017-10-23
 * LastModify: 
 * Goal: 公司常用功能封装
 */

// 将UNIX时间戳转换为易读格式 
function convertToDate(dateStr) {
    var date = new Date(parseFloat(dateStr.substring(6)));
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
}