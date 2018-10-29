

// validate mobile number against presenccein teh database
function validateMobileNumberLength(context) {
    mobileNo = context.value;
    if (mobileNo.length <= 9 || mobileNo.length > 10) {
        context.style.backgroundColor = "#ff6666";
    }
    else context.style.backgroundColor = "white";

    if (mobileNo) {
        connection.query("SELECT customerName from customerdetails WHERE mobileNumber = '" + mobileNo + "';", function (error, results, fields) {
            try {
                document.getElementById("customerName").value = results[0].customerName;
                totalPurchase = results[0].totalPurchase;
                outstandingAmount = results[0].outstandingAmount;
                mobileNoNotPresent = 0;
            }
            catch (err) {
                document.getElementById("customerName").value = "";
                mobileNoNotPresent = 1;
            }
        });
    }
    else document.getElementById("customerName").value = "";
}

//add new row in the product line item table
function add_row(context) {

    if (checkOrderDetails(table) == 0)
        return;

    var currentIndex = table.rows.length - 2;
    var currentRow = table.insertRow(currentIndex + 1);

    var productCodeBox = document.createElement("input");
    productCodeBox.setAttribute("id", "productCode" + currentIndex);
    productCodeBox.setAttribute("onkeyup", "retrieveProductName(this)");
    productCodeBox.setAttribute("style", "width: 6em; text-align: center;");

    var productNameBox = document.createElement("input");
    productNameBox.setAttribute("id", "productName" + currentIndex);
    productNameBox.setAttribute("onchange", "checkProductPresentInDatabase(this)");
    productNameBox.setAttribute("style", "width: 18em; text-align: center;");

    var orderQuantityBox = document.createElement("input");
    orderQuantityBox.setAttribute("id", "orderQuantity" + currentIndex);
    orderQuantityBox.setAttribute("onchange", "calculateQtyRpm(this)");
    orderQuantityBox.setAttribute("type", "number");
    orderQuantityBox.setAttribute("style", "width: 5em; text-align: center;");

    var piecesBox = document.createElement("input");
    piecesBox.setAttribute("id", "pieces" + currentIndex);
    piecesBox.setAttribute("onchange", "calculatePieceTotal(this)");
    piecesBox.setAttribute("type", "number");
    piecesBox.setAttribute("style", "width: 5em; text-align: center;");
    piecesBox.setAttribute("value", "1");

    var rpmBox = document.createElement("input");
    rpmBox.setAttribute("id", "rpm" + currentIndex);
    rpmBox.setAttribute("onchange", "calculateQtyRpm(this)");
    rpmBox.setAttribute("type", "number");
    rpmBox.setAttribute("style", "width: 7em; text-align: center;");

    var subtotalBox = document.createElement("input");
    subtotalBox.setAttribute("id", "subtotal" + currentIndex);
    subtotalBox.setAttribute("type", "number");
    subtotalBox.setAttribute("style", "width: 8em; text-align: center;");
    subtotalBox.setAttribute("value", "0.00");
    subtotalBox.setAttribute("readonly", "true");

    var addRowBox = document.createElement("input");
    addRowBox.setAttribute("type", "button");
    addRowBox.setAttribute("value", "Add");
    addRowBox.setAttribute("id", "addButton" + currentIndex);
    addRowBox.setAttribute("onclick", "add_row();");
    addRowBox.setAttribute("class", "btn btn-info btn-sm");

    var addDeleteBox = document.createElement("input");
    addDeleteBox.setAttribute("type", "button");
    addDeleteBox.setAttribute("value", "Del");
    addDeleteBox.setAttribute("id", "deleteButton" + currentIndex);
    addDeleteBox.setAttribute("onclick", "delete_row(this);");
    addDeleteBox.setAttribute("class", "btn btn-danger btn-sm");

    var currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(productCodeBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(productNameBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(orderQuantityBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(piecesBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(rpmBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.setAttribute("style", "text-align: center;")
    currentCell.appendChild(subtotalBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(addRowBox);

    currentCell.appendChild(addDeleteBox);
}

// product line item table validations
function checkOrderDetails(table) {
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {

        if (table.rows[r].cells[1].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[1].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return 0;
        }
        else table.rows[r].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "white";

        if (table.rows[r].cells[2].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[2].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return 0;
        }
        else table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";

        if (table.rows[r].cells[3].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[3].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return 0;
        }
        else table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";

        if (table.rows[r].cells[4].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[4].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return 0;
        }
        else table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";

        if (table.rows[r].cells[5].getElementsByTagName("input")[0].value == '' || table.rows[r].cells[4].getElementsByTagName("input")[0].value == null) {
            table.rows[r].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "#ff6666";
            return 0;
        }
        else table.rows[r].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "white";
    }
    return 1;
}


//get data in the array form
function getQueryData(id) {
    var data = [];
    data.push(document.getElementById("productCode" + id).value);
    data.push(document.getElementById("productName" + id).value);
    data.push(document.getElementById("orderQuantity" + id).value);
    data.push(document.getElementById("pieces" + id).value);
    data.push(document.getElementById("rpm" + id).value);
    data.push(document.getElementById("subtotal" + id).value);
    return data;
}

function checkCustomerDetails(invoiceNo, customerName, mobileNo) {
    if (invoiceNo == null || invoiceNo == '') {
        document.getElementById('invoiceNo').style.backgroundColor = "#ff6666";

    }
    else document.getElementById('invoiceNo').style.backgroundColor = "white";

    if (mobileNo == null || mobileNo == '') {
        document.getElementById('mobileNo').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('mobileNo').style.backgroundColor = "white";

    if (customerName == null || customerName == '') {
        document.getElementById('customerName').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('customerName').style.backgroundColor = "white";

    return 1;
}

function calculateTotalQty() {
    var qtyT = 0
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tablePieces = table.rows[r].cells[2].getElementsByTagName("input")[0].value;
        if (tablePieces) {
            qtyT = Math.round((qtyT + parseFloat(tablePieces)) * 100) / 100;
            //console.log(tablePieces, qtyT);
        }
    }
    document.getElementById("totalQuantityFooter").innerHTML = qtyT;
}

function calculateTotalPieces() {
    var totalP = 0
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tablePieces = table.rows[r].cells[3].getElementsByTagName("input")[0].value;
        if (tablePieces) {
            totalP = totalP + parseFloat(tablePieces);
        }
    }
    document.getElementById("totalPiecesFooter").innerHTML = totalP;
}

function calculateLineSubtotal(table) {
    // validations of the table line items
    var grossTotal = 0;
    checkOrderDetails(table);

    //console.log(table.rows.length);
    for (var r = 1; r < table.rows.length - 1; r++) {
        console.log(table.rows[r].cells[1].getElementsByTagName("input")[0].id);
        var tempRowIndex = table.rows[r].cells[1].getElementsByTagName("input")[0].id.split("productName");

        if (document.getElementById("orderQuantity" + tempRowIndex[1]).value && document.getElementById("rpm" + tempRowIndex[1]).value && document.getElementById("orderQuantity" + tempRowIndex[1]).value >= 0 && document.getElementById("rpm" + tempRowIndex[1]).value >= 0) {
            var compute = Math.round(parseFloat(document.getElementById("orderQuantity" + tempRowIndex[1]).value) * parseFloat(document.getElementById("rpm" + tempRowIndex[1]).value * parseFloat(document.getElementById("pieces" + tempRowIndex[1]).value)) * 100) / 100;
            document.getElementById("subtotal" + tempRowIndex[1]).value = compute;
            grossTotal = grossTotal + parseFloat(compute);
        }
        else document.getElementById("subtotal" + tempRowIndex[1]).value = "0.00";
    }

    //setting gross value
    document.getElementById("grossAmtFooter").innerHTML = Math.round(grossTotal * 100) / 100;
    calculateNetTotal();
}

function makeTableElementsBackgroundWhite(table) {
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        table.rows[r].cells[1].getElementsByTagName("input")[0].style.backgroundColor = "white";
        table.rows[r].cells[2].getElementsByTagName("input")[0].style.backgroundColor = "white";
        table.rows[r].cells[3].getElementsByTagName("input")[0].style.backgroundColor = "white";
        table.rows[r].cells[4].getElementsByTagName("input")[0].style.backgroundColor = "white";
        table.rows[r].cells[5].getElementsByTagName("input")[0].style.backgroundColor = "white";
    }
}

function calculateNetTotal() {
    if (document.getElementById("discountAmount").value) {
        document.getElementById("balanceAmount").value = Math.round((parseFloat(document.getElementById("grossAmtFooter").innerHTML) - parseFloat(document.getElementById("discountAmount").value) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)) * 100) / 100;
        document.getElementById("netAmtFooter").innerHTML = Math.round((parseFloat(document.getElementById("grossAmtFooter").innerHTML) - parseFloat(document.getElementById("discountAmount").value)) * 100) / 100;
    }
    else
        document.getElementById("netAmtFooter").innerHTML = Math.round((parseFloat(document.getElementById("grossAmtFooter").innerHTML)) * 100) / 100;

    if (parseFloat(document.getElementById("balanceAmount").value) < 0) {
        document.getElementById("refundDiv").hidden = false;
        document.getElementById("refundAmtLabel").innerHTML = Math.round(document.getElementById("balanceAmount").value);

        var theSelect = document.getElementById("paymentStatus");
        theSelect.style.backgroundColor = "#9393ff";
        var options = theSelect.getElementsByTagName('option');
        for (var i = 0; i < options.length; i++) {
            if (options[i].value) {
                theSelect.removeChild(options[i]);
                i--;
            }
        }
        options = document.createElement("option");
        options.value = "2";
        options.text = "Pay full refund";
        options.selected = "true";
        theSelect.add(options);

        // options = document.createElement("option");
        // options.value = "3";
        // options.text = "Pay refund later";
        // theSelect.add(options);
    }
    else {
        document.getElementById("refundDiv").hidden = true;
        var theSelect = document.getElementById("paymentStatus");
        theSelect.style.backgroundColor = "white";

        var options = theSelect.getElementsByTagName('option');
        for (var i = 0; i < options.length; i++) {
            if (options[i].value) {
                theSelect.removeChild(options[i]);
                i--;
            }
        }
        options = document.createElement("option");
        options.value = "0";
        options.text = "Full Payment";
        options.selected = "true";
        theSelect.add(options);

        options = document.createElement("option");
        options.value = "1";
        options.text = "Part Payment";
        theSelect.add(options);
    }
    setpaymentStatus();
}

function takeBackup() {
    var mysqldump = require('mysqldump');
    var datetime = new Date();
    var folderName = (new Date(Date.now()).getDate() + "." + (new Date(Date.now()).getMonth() + 1) + "." + new Date(Date.now()).getFullYear()).toString();
    var backupDate = folderName;
    var backupTime = new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes() + ":" + new Date(Date.now()).getSeconds();
    var fs = require('fs');
    var dir = 'C:\\appbackup\\' + folderName;
    var fileName = folderName + "@" + new Date(Date.now()).getHours() + "." + new Date(Date.now()).getMinutes() + "." + new Date(Date.now()).getSeconds();;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    mysqldump({
        connection: {
            host: 'localhost',
            user: 'root',
            password: 'darshanjain@123',
            database: 'clothretaildesktopapplication'
        },
        dumpToFile: 'C:\\appbackup\\' + folderName + '/' + fileName + 'backup.sql',
    })

    // update backup datetime in the database
    connection.query("UPDATE seriesnumber SET seriesValue = (case when seriesName = 'backupDate' then '" + backupDate + "' when seriesName = 'backupTime' then '" + backupTime + "' end) WHERE seriesName in ('backupDate', 'backupTime', 'admin');",
        function (err, result) {
            if (err) throw err;
        });
    alert("We have successfully taken backup", "Parshwamani-IT");
    loadLastBackupDetails();
}

function loadLastBackupDetails() {
    connection.query("SELECT seriesValue from seriesnumber WHERE seriesName = 'backupDate' OR seriesName = 'backupTime';", function (error, results, fields) {
        if (error) throw error;
        document.getElementById("backupTimeLabel").innerHTML = results[0].seriesValue + " @ " + results[1].seriesValue;

    });
}