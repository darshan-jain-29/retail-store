const electron = require('electron');
const { ipcRenderer } = electron;

var userN = null;
var pass = null;

function checkLoginDetails() {

    userN = document.getElementById("usrname").value;
    pass = document.getElementById("psword").value;
    connection.query("SELECT * from logincredentials WHERE username = '" + userN + "' AND password ='" + pass + "';"
        , function (error, results, fields) {
            if (error) throw error;
            checkIfUserExist(results);
            //console.log(results);
        });
}

function checkIfUserExist(data) {
    var i = 0;
    for (i = 0; i < data.length; i++) {
        if (data[i].username == userN && data[i].password == pass) {
            //console.log("Matched");
            break;
        }
    }
    if (i < data.length) {
        alert("Welcome " + userN);
        ipcRenderer.send('SUCCESSFUL');
    }
    else {
        //console.log("Nahi hua match");
        document.getElementById("errorMessage").style.display = 'block';
    }
}

function resetErrorMessage() {
    document.getElementById("usrname").value = null;
    document.getElementById("psword").value = null;
    document.getElementById("errorMessage").style.display = 'none';
}