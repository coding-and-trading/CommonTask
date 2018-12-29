define(['knockout', 'lib/LG', 'json2', 'MQ', 'ModularReminder', 'kopage', 'layui'],
    function (ko, LG, JSON, mq, ModularReminder) {
        var model = {}, layer,
            layTable, layform, laydate;
        
        layui.use(['layer', 'table', 'form', 'laydate'], function () {
            layer = layui.layer;
            layTable = layui.table;
            layform = layui.form;
            laydate = layui.laydate;
        });

        //主要Model
        model.ViewModel = function () {
            var self = this;

            self.ModularReminder = new ModularReminder("{{moduleName}}"); // 温馨提示

			// 初始化页面中的form, grid
            self.initPage = function () {
                // 初始化form
                layform.render();
            }; 
        };

        model.ViewModel.prototype = {
            afterRender: function (vm) {
                this.initPage();
			},
            init: function () {} 
        };

        return model;
});
