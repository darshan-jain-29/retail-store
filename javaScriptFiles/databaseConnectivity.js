var dbValues = null;
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'darshanjain@123',
    database: 'clothretaildesktopapplication',
    insecureAuth: true
});
connection.connect();

const remote = require("electron").remote;
// document.addEventListener("keydown", event => {

//     switch (event.key) {
//         case "Escape":
//             if (remote.getCurrentWindow()) {
//                 remote.getCurrentWindow().close();
//             }
//             break;
//     }
// });

// handle the security warning
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';