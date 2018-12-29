define(['knockout',
    'js/app/util/lib',
    'LG',
    'js/app/controller/{{moduleName}}/{{moduleName}}',
    'MQ',
    'cTask',
    'json2',
    'lazyload',
    'layui',
    'kopage'],
    function (ko, lib, LG, controller, mq, cTask, json) {
        var vm = {};
        vm = new controller.{{moduleName}}.ViewModel();

        return vm;
    });