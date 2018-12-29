const ConfigFile = require('requirejs-config-file').ConfigFile,
      fs = require('fs'),
      fse = require('fs-extra'),
      path = require('path');

const fileName = './controller.js',
    distnation = './controller2.js',
    moduleName = 'lossList';
fse.readFile(fileName, 'utf8')
    .then(data => {
        let updateData = data.replace(/{{moduleName}}/g, moduleName),
            baseName = path.dirname(distnation); 
        console.log(baseName);
        if (!fs.exists(baseName)) {
            fse.mkdir(baseName);
        }
        fse.writeFile(distnation, updateData)
            .catch(err => console.log(err));
    })
    .catch(err => console.log(err));