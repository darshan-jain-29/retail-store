var mysqldump = require('mysqldump');

function takeBackup() {
    var datetime = new Date();
    var mo = new Date(Date.now()).getMonth() + 1;
    var folderName = (new Date(Date.now()).getDate() + "" + mo + "" + new Date(Date.now()).getFullYear()).toString();

    var fs = require('fs');
    var dir = 'C:\\appbackup\\' + folderName;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'darshanjain@123',
            database: 'linenlaurasinglepageapplication'
        },
        dumpToFile: 'C:\\appbackup\\' + folderName + '/' + folderName + 'backup.sql',
    })
    alert("We have successfully taken backup");
}