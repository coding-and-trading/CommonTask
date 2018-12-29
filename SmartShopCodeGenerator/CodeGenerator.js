/*
 * Author: YeHong Du
 * Date: 2018-11-22
 * Goal: 生成智能门店模块基础代码
 * Detail:
 * 1. 根据指定的"module name", 在
 * 2. 在js/app/page/name/中建立name.js, 建立相应的文件夹和文件, 并填充基础内容。
 * 3. 在js/app/controller/name/中建立nameController.js, 建立相应的文件夹和文件, 并填充基础内容。
 * 4. 在js/app/model/name/中建立nameModel.js, 建立相应的文件夹和文件, 并填充基础内容。
 * 5. 在template中建立div_name.html, 建立相应的文件夹和文件, 并填充基础内容。
 * 6. 在common.js中添加module与file name的匹配。
 * 7. 在js/common/routConfig.js中添加路由。
 * 8. settings.json 示例:
 *    { name: '',  模块名称}
 */

// Start: 加载模块
const ConfigFile = require('requirejs-config-file').ConfigFile,
      fse = require('fs-extra'),
      fs = require('fs'),
      path = require('path');
// End

// Start: 配置
const //settingsPath = './settings.json',
      rootDir = 'F:/smartshop3/Src/SmartShopWeb/',
      commonJS = rootDir + 'js/T/common.js',
      configJS = rootDir + 'js/common/routConfig.js',
      moduleName = 'categorysale';
// End

const fileToGeneration = { 
    controller : rootDir + 'js/app/controller/' + moduleName + '/' + moduleName + '.js',
    model : rootDir + 'js/app/model/' + moduleName + '/' + moduleName + '.js',
    page : rootDir + 'js/app/page/' + moduleName + '/' + moduleName + '.js',
    html: rootDir + 'template/' + moduleName + '/div_' + moduleName + '.html'
};

//let settings = require(settingsPath);

// template settings
const templateSettings = {
    page: 'page.js',
    model: 'model.js',
    controller: 'controller.js',
    html: 'div.html'
};


// Start: 添加文件映射
let config = new ConfigFile(commonJS),
    configSettings = config.read().paths;

// 存在则跳过
if (configSettings[moduleName] == undefined) {
    configSettings[moduleName] = 'js/app/page/' + moduleName + '/' + moduleName;
}

let div = moduleName + '-html';
if (configSettings[div] == undefined) {
    configSettings[div] = 'template/' + moduleName + '/div_' + moduleName + '.html';
}
config.write();
// End

// Start: 添加路由
    fse.readFile(configJS, 'utf8')
        .then(data => {
            let p = new RegExp(moduleName);
            if (!p.test(data)) {
                let updateData = data.replace('})', 
                    ',' + "'" + moduleName + "':'" + moduleName + "'})");
                fse.outputFile(configJS, updateData, 'utf8');
            }
        })
        .catch(err => console.log(err));
// End

// Start: 生成需要生成的文件
for (let key in templateSettings) {
    let destination = fileToGeneration[key];
    if (!fs.exists(destination)) {
        fse.readFile(templateSettings[key], 'utf8')
            .then(data => {
                let updateData = data.replace(/{{moduleName}}/g, moduleName),
                    baseDir =  path.dirname(destination);
                let stats;
                try {
                    stats = fs.lstatSync(baseDir);
                    fse.writeFile(destination, updateData)
                        .catch(err => console.log(err));
                } catch(e){
                    fse.mkdir(baseDir)
                        .then(() => {
                            fse.writeFile(destination, updateData)
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                }
                /*
                if (!stats.isDirectory()) {
                    console.log("directory?");
                    // 不存在则创建目录
                    fse.mkdir(baseDir)
                        .then(() => {
                            fse.writeFile(destination, updateData)
                                .catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                } else {
                    console.log('here?');
                    fse.writeFile(destination, updateData)
                        .catch(err => console.log(err));
                }
                */

            })
            .catch(err => console.log(err));
    }
}
// End