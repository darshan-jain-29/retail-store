// const electron = require('electron').remote;
// const { BrowserWindow } = electron;
var table = document.getElementById("orderTable");
var oldCustomerName = null;
var oldMobileNumber = null;
var oldNetAmount = null;
var oldOutstandingAmount = null;
var jsPDF = require('jspdf');
require('jspdf-autotable');

function fetchTableData() {
    document.getElementById("refundDiv").hidden = true;
    document.getElementById("tabularViewOfAllBills").hidden = false;
    document.getElementById("orderBillPreview").hidden = true;
    document.getElementById("billEdit").hidden = true;

    var tableValues = [];
    connection.query('Select * from ordermaster ORDER BY invoiceNumber DESC;', function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}

//master table
function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("orderTableMasterBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    //console.log(tableValues);
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");

        tableInstance.appendChild(newRow);
        if (tableValues[i] instanceof Array) {
        } else {
            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].invoiceNumber;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].customerName;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].mobileNumber;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].orderDate;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].totalPieces;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].totalMeters;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].grossBillAmount;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].balanceAmount;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style = "padding-top: 5px; border-color: white;";
            btn.id = tableValues[i].invoiceNumber;
            btn.value = "View";
            btn.onclick = (function () {
                return function () {
                    openOrderBill(this.id);
                }
            })();
            newRow.appendChild(btn);
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style = "padding-top: 5px; background-color: #9393ff; border-color: white;";
            btn.id = tableValues[i].invoiceNumber;
            btn.value = "Edit";
            btn.onclick = (function () {
                return function () {
                    editOrderBill(this.id);
                }
            })();
            newRow.appendChild(btn);
        }
    }
}

function openOrderBill(d) {
    document.getElementById("tabularViewOfAllBills").hidden = true;
    document.getElementById("orderBillPreview").hidden = false;
    document.getElementById("billEdit").hidden = true;

    document.getElementById("billPreviewInvoiceNo").value = d;
    document.getElementById("billPreviewHeading").innerHTML = "Order Details - Invoice No. " + d;
    connection.query("SELECT * from ordermaster WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        loadValuesInBillPreviewPage(results[0]);
    });

    var tableValues = [];
    connection.query("Select * from orderlineitemdetails WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInBillPreviewTable(tableValues);
    });
}

function loadValuesInBillPreviewPage(data) {
    console.log(data);
    document.getElementById("billPreviewMobileNo").value = data.mobileNumber;
    document.getElementById("billPreviewCustomerName").value = data.customerName;
    document.getElementById("billPreviewOrderDate").value = data.orderDate;
    document.getElementById("billPreviewTotalPiecesFooter").innerHTML = data.totalPieces;
    document.getElementById("billPreviewTotalQuantityFooter").innerHTML = data.totalMeters;
    document.getElementById("billPreviewGrossAmtFooter").innerHTML = data.grossBillAmount;
    document.getElementById("billPreviewDiscountAmount").value = data.discount;
    document.getElementById("billPreviewNetAmtFooter").innerHTML = data.netAmount;
    document.getElementById("billPreviewPaymentMode").innerHTML = data.paymentMode;
    document.getElementById("billPreviewPaymentStatus").innerHTML = data.paymentStatus;
    document.getElementById("billPreviewAmountPaid").value = data.amountPaid;
    document.getElementById("billPreviewBalanceAmount").value = data.balanceAmount;
    //Math.round((parseFloat(data.billAmount) - parseFloat(data.discount) - parseFloat(data.amountPaid)) * 100) / 100;

    if (data.balanceAmount <= 0)
        document.getElementById("billPreviewDisplayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paidstamp.png\">";
    else {
        document.getElementById("billPreviewDisplayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paymentpending.png\">";
        document.getElementById("billPreviewPaymentDiv").hidden = false;
        //document.getElementById("balanceAmount").innerHTML = (parseFloat(data.billAmount) - parseFloat(data.amountPaid)).toString();
    }
}


function loadValuesInBillPreviewTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("billPreviewOrderTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    //console.log(tableValues);
    var billTotal = 0;
    for (var i = 0; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);

        if (tableValues[i] instanceof Array) {
        } else {
            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].productCode;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].productName;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].quantity;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].pieces;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].rate;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.textContent = tableValues[i].subtotal;
            newCell.style = "text-align: center;";
            newRow.appendChild(newCell);
            billTotal = billTotal + parseFloat(tableValues[i].subtotal);
        }
    }
    //document.getElementById("grossAmtFooter").innerHTML = billTotal;
}

function openOrderBilltttttt(btId) {
    // remote.getGlobal('myGlobalParameters').orderPreviewInvoiceNo = btId;

    // let openOrderBillPreview = new BrowserWindow({
    //     width: 1250,
    //     height: 625,
    //     minimizable: false,
    //     maximizable: false,
    //     closable: true,
    //     //frame: false,
    //     // alwaysOnTop: true, 
    //     resizable: false,
    //     globals: { id: btId }
    // });

    // let url = require('url').format({
    //     protocol: 'file',
    //     slashes: true,
    //     pathname: require('path').join(__dirname, '../webFiles/orderBillPreview.html')
    // })

    // openOrderBillPreview.loadURL(url)
    // openOrderBillPreview.setMenu(null);
    // openOrderBillPreview.webContents.openDevTools();
}

function editOrderBill(d) {
    deleteTableRowsFromSecondRowOnwards(table);
    document.getElementById("tabularViewOfAllBills").hidden = true;
    document.getElementById("orderBillPreview").hidden = true;
    document.getElementById("billEdit").hidden = false;

    document.getElementById("invoiceNo").value = d;
    document.getElementById("billEditHeading").innerHTML = "Edit Order Details - Invoice No. " + d;
    connection.query("SELECT * from ordermaster WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        loadValuesInEditBillPage(results[0]);
    });

    var tableValues = [];
    connection.query("Select * from orderlineitemdetails WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInEditBillTable(tableValues);
    });
}

function loadValuesInEditBillPage(data) {
    oldMobileNumber = document.getElementById("mobileNo").value = data.mobileNumber;
    oldCustomerName = document.getElementById("customerName").value = data.customerName;
    document.getElementById("orderDate").value = data.orderDate.slice(6, 10) + "-" + data.orderDate.slice(3, 5) + "-" + data.orderDate.slice(0, 2);

    document.getElementById("totalQuantityFooter").innerHTML = data.totalMeters;
    document.getElementById("totalPiecesFooter").innerHTML = data.totalPieces;
    document.getElementById("grossAmtFooter").innerHTML = data.grossBillAmount;
    document.getElementById("discountAmount").value = data.discount;
    document.getElementById("amountPaidLabel").innerHTML = data.amountPaid;
    oldNetAmount = document.getElementById("netAmtFooter").innerHTML = data.netAmount;
    oldOutstandingAmount = data.balanceAmount;

    if (data.paymentMode == "Card") {
        document.getElementById("paymentMode").selectedIndex = 1;
    }

    // if (data.paymentStatus == "Part Payment") {
    //     document.getElementById("paymentStatus").selectedIndex = 1;
    // }

    document.getElementById("amountPaying").value = "";
    document.getElementById("balanceAmount").value = data.balanceAmount;
    //Math.round((parseFloat(data.billAmount) - parseFloat(data.discount) - parseFloat(data.amountPaid)) * 100) / 100;

    if (data.billAmount == data.amountPaid)
        document.getElementById("billPreviewDisplayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paidstamp.png\">";
    else {
        document.getElementById("billPreviewDisplayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paymentpending.png\">";
        document.getElementById("billPreviewPaymentDiv").hidden = false;
    }
    setpaymentStatus();
}

function loadValuesInEditBillTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("orderTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    // fill data in the first row of the table
    document.getElementById("productCode0").value = tableValues[0].productCode;
    document.getElementById("productName0").value = tableValues[0].productName;
    document.getElementById("orderQuantity0").value = tableValues[0].quantity;
    document.getElementById("pieces0").value = tableValues[0].pieces;
    document.getElementById("rpm0").value = tableValues[0].rate;
    document.getElementById("subtotal0").value = tableValues[0].subtotal;

    for (var i = 1; i < tableValues.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);

        if (tableValues[i] instanceof Array) {
        } else {
            addElementsToRowWithValuesFromDatabase(i, newRow, tableValues[i]);
        }
    }
}

function deleteTableRowsFromSecondRowOnwards(data) {
    while (data.rows.length != 3) {
        data.deleteRow(data.rows.length - 2);
    }

    // for (var r = 2, n = data.rows.length - 1; r < n; r++) {
    //     data.deleteRow(r);
    // }
}

function addElementsToRowWithValuesFromDatabase(currentIndex, currentRow, data) {
    //console.log(data);
    var productCodeBox = document.createElement("input");
    productCodeBox.setAttribute("id", "productCode" + currentIndex);
    productCodeBox.setAttribute("onkeyup", "retrieveProductName(this)");
    productCodeBox.setAttribute("style", "width: 6em; text-align: center;");
    productCodeBox.setAttribute("value", data.productCode);

    var productNameBox = document.createElement("input");
    productNameBox.setAttribute("id", "productName" + currentIndex);
    productNameBox.setAttribute("onchange", "checkProductPresentInDatabase(this)");
    productNameBox.setAttribute("style", "width: 18em; text-align: center;");
    productNameBox.setAttribute("value", data.productName);

    var orderQuantityBox = document.createElement("input");
    orderQuantityBox.setAttribute("id", "orderQuantity" + currentIndex);
    orderQuantityBox.setAttribute("onchange", "calculateQtyRpm(this)");
    orderQuantityBox.setAttribute("type", "number");
    orderQuantityBox.setAttribute("style", "width: 5em; text-align: center;");
    orderQuantityBox.setAttribute("value", data.quantity);

    var piecesBox = document.createElement("input");
    piecesBox.setAttribute("id", "pieces" + currentIndex);
    piecesBox.setAttribute("onchange", "calculateQtyRpm(this)");
    piecesBox.setAttribute("type", "number");
    piecesBox.setAttribute("style", "width: 5em; text-align: center;");
    piecesBox.setAttribute("value", "0");
    piecesBox.setAttribute("value", data.pieces);

    var rpmBox = document.createElement("input");
    rpmBox.setAttribute("id", "rpm" + currentIndex);
    rpmBox.setAttribute("onchange", "calculateQtyRpm(this)");
    rpmBox.setAttribute("type", "number");
    rpmBox.setAttribute("style", "width: 7em; text-align: center;");
    rpmBox.setAttribute("value", data.rate);

    var subtotalBox = document.createElement("input");
    subtotalBox.setAttribute("id", "subtotal" + currentIndex);
    subtotalBox.setAttribute("type", "number");
    subtotalBox.setAttribute("style", "width: 8em; text-align: center;");
    subtotalBox.setAttribute("value", "0.00");
    subtotalBox.setAttribute("readonly", "true");
    subtotalBox.setAttribute("value", data.subtotal);

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
    currentCell.appendChild(productCodeBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(productNameBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(orderQuantityBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(piecesBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(rpmBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(subtotalBox);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(addRowBox);

    currentCell.appendChild(addDeleteBox);
}

//retrieve product name against product code entered
function retrieveProductName(context) {
    var productCode = context.value;
    var tempID = []
    tempID = context.id.split("productCode");

    if (productCode) {
        connection.query("SELECT * from productcode WHERE productCode = '" + productCode + "';", function (error, results, fields) {
            try {
                document.getElementById("productName" + tempID[1]).value = results[0].productValue + " - " + results[0].productCategory;
                document.getElementById("orderQuantity" + tempID[1]).value = results[0].minimumCut;
                calculateTotalQty();
            }
            catch (err) {
                document.getElementById("productName" + tempID[1]).value = "";
            }
        });
    }
    else document.getElementById("productName" + tempID[1]).value = "";
}

function calculateQtyRpm(context) {
    calculateTotalQty();
    calculateTotalPieces();
    calculateLineSubtotal(table);
    makeTableElementsBackgroundWhite(table);
    if (checkOrderDetails(table) == 0)
        return;

    if (context.id.includes("orderQuantity")) {
        tempID = context.id.split("orderQuantity");
        document.getElementById("orderQuantity" + tempID[1]).style.backgroundColor = "#9393ff";
        document.getElementById("subtotal" + tempID[1]).style.backgroundColor = "#9393ff";
    }
    else if (context.id.includes("rpm")) {
        tempID = context.id.split("rpm");
        document.getElementById(context.id).style.backgroundColor = "#9393ff";
        document.getElementById("subtotal" + tempID[1]).style.backgroundColor = "#9393ff";
    }
    else if (context.id.includes("pieces")) {
        tempID = context.id.split("pieces");
        document.getElementById(context.id).style.backgroundColor = "#9393ff";
        document.getElementById("subtotal" + tempID[1]).style.backgroundColor = "#9393ff";
    }
    setpaymentStatus();
}

// delete row from the pproduct line item table
function delete_row(context) {
    var tempID = context.id.split("deleteButton");
    var data = getQueryData(tempID[1]);
    if (data[2])
        document.getElementById("totalQuantityFooter").innerHTML = Math.round((parseFloat(document.getElementById("totalQuantityFooter").innerHTML) - parseFloat(data[2])) * 100) / 100;
    if (data[3])
        document.getElementById("totalPiecesFooter").innerHTML = Math.round((parseFloat(document.getElementById("totalPiecesFooter").innerHTML) - parseFloat(data[3])) * 100) / 100;
    if (data[5])
        document.getElementById("grossAmtFooter").innerHTML = Math.round((parseFloat(document.getElementById("grossAmtFooter").innerHTML) - parseFloat(data[5])) * 100) / 100;
    calculateNetTotal();
    var _row = context.parentElement.parentElement;
    document.getElementById('orderTable').deleteRow(_row.rowIndex);
    setpaymentStatus();
}

function calculatePieceTotal(context) {
    calculateTotalPieces();
}

function setpaymentStatus() {
    if (document.getElementById("paymentStatus").value == "0") {
        document.getElementById("amountPaying").value = Math.round(parseFloat(document.getElementById("netAmtFooter").innerHTML) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)) * 100 / 100;
        document.getElementById("balanceAmount").value = "0";
        document.getElementById("amountPaying").style.backgroundColor = "white";
        document.getElementById("amountPaying").disabled = false;
        document.getElementById("balanceAmount").disabled = false;
    }
    else if (document.getElementById("paymentStatus").value == "1") {
        document.getElementById("amountPaying").value = "";
        document.getElementById("balanceAmount").value = Math.round(parseFloat(document.getElementById("netAmtFooter").innerHTML) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)) * 100 / 100;
        document.getElementById("amountPaying").style.backgroundColor = "white";
        document.getElementById("amountPaying").disabled = false;
        document.getElementById("balanceAmount").disabled = false;
    }
    else if (document.getElementById("paymentStatus").value == "2") {
        document.getElementById("amountPaying").value = 0;
        document.getElementById("amountPaying").value = Math.round(parseFloat(document.getElementById("netAmtFooter").innerHTML) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)) * 100 / 100;
        document.getElementById("balanceAmount").value = "0";
        document.getElementById("balanceAmount").disabled = true;
        document.getElementById("amountPaying").disabled = true;

    }
}

function calculateBalanceAmount() {
    var currentPay = document.getElementById("amountPaying").value;
    if (currentPay >= 0) {
        var remainingP = Math.round((parseFloat(document.getElementById("netAmtFooter").innerHTML) - currentPay - parseFloat(document.getElementById("amountPaidLabel").innerHTML)));
        if (remainingP >= 0) {
            document.getElementById('amountPaying').style.backgroundColor = "white";
            document.getElementById("balanceAmount").value = remainingP;
        }
        else {
            document.getElementById("amountPaying").value = "";
            document.getElementById("amountPaying").focus();
            document.getElementById("amountPaying").style.backgroundColor = "#ff6666";
            document.getElementById("balanceAmount").value = Math.round((parseFloat(document.getElementById("netAmtFooter").innerHTML) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)));
        }
    }
    else {
        document.getElementById("amountPaying").value = 0;
        amountBalance = Math.round((parseFloat(document.getElementById("netAmtFooter").innerHTML) - parseFloat(document.getElementById("amountPaidLabel").innerHTML)));
    }
}

function deleteBill() {

}

function checkPaymentDetails() {

    if (document.getElementById('discountAmount').value == null || document.getElementById('discountAmount').value == '') {
        discount = document.getElementById('discountAmount').value = "0";
    } else discount = document.getElementById('discountAmount').value;

    if (document.getElementById('netAmtFooter').innerHTML == null || document.getElementById('netAmtFooter').innerHTML == '' || document.getElementById('netAmtFooter').innerHTML == '0') {
        document.getElementById('netAmtFooter').style.backgroundColor = "#ff6666";
        return 0;
    }
    else document.getElementById('netAmtFooter').style.backgroundColor = "white";

    if (document.getElementById("paymentStatus").value == "1") {
        amountPaid = document.getElementById("amountPaying").value;
    }
    else {
        amountPaid = document.getElementById('netAmtFooter').innerHTML;
        amountBalance = 0;
    }
    if (document.getElementById('amountPaying').value == '' || document.getElementById('amountPaying').value == null) {
        document.getElementById('amountPaying').style.backgroundColor = "#ff6666";
        return 0;
    } else if (document.getElementById('amountPaying').value < 0) {
        document.getElementById('amountPaying').style.backgroundColor = "#ff6666";
    }
    else document.getElementById('amountPaying').style.backgroundColor = "white";

    return 1;
}
function updateBill() {
    // perform full page validations
    var invoiceNumber = document.getElementById("invoiceNo").value;

    var updatedOrderDate = document.getElementById("orderDate").value;
    var tempDateArray = updatedOrderDate.split("-");
    updatedOrderDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];

    var updatedMobileNumber = document.getElementById("mobileNo").value;
    var updatedCustomerName = document.getElementById("customerName").value;
    var updatedTotalPieces = document.getElementById("totalPiecesFooter").innerHTML;
    var updatedTotalMeters = document.getElementById("totalQuantityFooter").innerHTML;
    var updatedGrossAmount = document.getElementById("grossAmtFooter").innerHTML;
    var updatedDiscount = document.getElementById("discountAmount").value;
    var updatedNetAmount = document.getElementById("netAmtFooter").innerHTML;
    var updatedAmountPaid = Math.round(parseFloat(document.getElementById("amountPaidLabel").innerHTML) + parseFloat(document.getElementById("amountPaying").value)) * 100 / 100;
    var updatedAmountPaying = Math.round(parseFloat(document.getElementById("amountPaying").value)) * 100 / 100;
    var updatedAmountBalance = document.getElementById("balanceAmount").value;
    var updatedPaymentMode = "Cash";
    var updatedPaymentStatus = "Full Payment";

    if (checkCustomerDetails(invoiceNumber, updatedCustomerName, updatedMobileNumber) == 0)
        return;

    if (checkOrderDetails(table) == 0)
        return;

    if (checkPaymentDetails() == 0)
        return;

    if (document.getElementById("paymentStatus").value == "1")
        updatedPaymentStatus = "Part Payment";
    else if (document.getElementById("paymentStatus").value == "2")
        updatedPaymentStatus = "Full Refund";

    if (document.getElementById("paymentMode").value == "1")
        updatedPaymentMode = "Card";

    // edit customer name, mobile number and order date
    connection.query("UPDATE ordermaster as t1, (select * from ordermaster where invoiceNumber = '" + invoiceNumber + "' ) as t2 set t1.customerName = '" + updatedCustomerName + "', t1.mobileNumber = '" + updatedMobileNumber + "', t1.orderDate = '" + updatedOrderDate + "', t1.totalPieces = '" + updatedTotalMeters + "', t1.totalPieces = '" + updatedTotalPieces + "', t1.totalMeters = '" + updatedTotalMeters + "', t1.grossBillAmount = '" + updatedGrossAmount + "', t1.discount = '" + updatedDiscount + "', t1.netAmount = '" + updatedNetAmount + "', t1.amountPaid = '" + updatedAmountPaid + "', t1.balanceAmount = '" + updatedAmountBalance + "', t1.paymentMode = '" + updatedPaymentMode + "', t1.paymentStatus = '" + updatedPaymentStatus + "' where t1.customerName = '" + oldCustomerName.toUpperCase() + "' AND t1.mobileNumber = '" + oldMobileNumber + "' AND t1.invoiceNumber = '" + invoiceNumber + "';",
        function (err, result) {
            if (err) throw err;
        });

    // delete rows from the orderlineitem table
    connection.query("DELETE from orderlineitemdetails WHERE invoiceNumber = '" + invoiceNumber + "';",
        function (err, result) {
            if (err) throw err;
            console.log(result);
        });

    // insert again in the orderlineitem table
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tableProductCode = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tableProductName = table.rows[r].cells[1].getElementsByTagName("input")[0].value.trim();
        var tableQuantity = Math.round(parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) * 100) / 100;
        var tablePieces = Math.round(parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) * 100) / 100;
        var tableRate = Math.round(parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value) * 100) / 100;
        var tableSubtotal = Math.round(parseFloat(table.rows[r].cells[5].getElementsByTagName("input")[0].value) * 100) / 100;

        connection.query("Insert into orderlineitemdetails VALUES ('" + invoiceNumber + "','" + tableProductCode.toUpperCase() + "','" + tableProductName.toUpperCase() + "','" + tableQuantity + "','" + tablePieces + "','" + tableRate + "','" + tableSubtotal + "')",
            function (err, result) {
                if (err) throw err;
            });
    }

    // edit customerdetails table
    if (oldCustomerName == document.getElementById("customerName").value && oldMobileNumber == document.getElementById("mobileNo").value) {
        connection.query("UPDATE customerdetails as t1, (select totalPurchase, outstandingAmount from customerdetails where customerName = '" + oldCustomerName.toUpperCase() + "' AND mobileNumber = '" + oldMobileNumber + "' ) as t2 set t1.totalPurchase = t1.totalPurchase +" + "-" + oldNetAmount + "+" + updatedNetAmount + ", t1.outstandingAmount = t1.outstandingAmount +" + "-" + oldOutstandingAmount + "+" + updatedAmountBalance + " where t1.customerName = '" + oldCustomerName.toUpperCase() + "' AND t1.mobileNumber = '" + oldMobileNumber + "';",
            function (err, result) {
                if (err) throw err;
                //console.log(result);
            });
    }
    else {
        connection.query("Insert into customerdetails VALUES ('" + updatedCustomerName.toUpperCase() + "','" + updatedMobileNumber + "','" + updatedNetAmount + "','" + updatedAmountBalance + "')",
            function (err, result) {
                if (err) throw err;
            });
    }
    var amountFlow = "INWARD";
    if (updatedAmountPaying < 0)
        amountFlow = "OUTWARD";
    // save payment mode details in the payment table
    connection.query("Insert into payment VALUES ('" + invoiceNumber + "','" + updatedOrderDate + "','" + updatedAmountPaying + "','" + updatedPaymentMode + "','" + amountFlow + "')",
        function (err, result) {
            if (err) throw err;
        });

    alert("Order Details Updated!", "Cancel");
    fetchTableData();
}

function generateBillListPrint() {

    var doc = new jsPDF();
    var table = document.getElementById("orderTableMaster");
    var ths = table.getElementsByTagName("th");
    var headarr = [];
    var text = "Hi How are you",
        xOffset = (doc.internal.pageSize.width / 2) - (doc.getStringUnitWidth(text) * doc.internal.getFontSize() / 2);
    doc.text('Sonu Traders: All Orders', 70, 10);
    var bodyData = [];
    for (var s = 0; s <= 7; s++) {
        headarr.push(ths[s].innerHTML);
    }

    for (var r = 1; r < table.rows.length - 1; r++) {
        var temp = [table.rows[r].cells[0].innerHTML, table.rows[r].cells[1].innerHTML, table.rows[r].cells[2].innerHTML, table.rows[r].cells[3].innerHTML, table.rows[r].cells[4].innerHTML, table.rows[r].cells[5].innerHTML, table.rows[r].cells[6].innerHTML, table.rows[r].cells[7].innerHTML];
        bodyData.push(temp);
    }
    doc.autoTable({
        head: [['INVOICE NO', 'CUSTOMER NAME', 'MOBILE NO', 'ORDER DT', 'TOTAL PCS', 'TOTAL MTRS', 'BILL AMT', 'BALANCE AMT']],
        body: bodyData
    });
    var pageCount = doc.internal.getNumberOfPages();

    for (i = 0; i < pageCount; i++) {
        doc.setPage(i);
        doc.text(150, 285, doc.internal.getCurrentPageInfo().pageNumber + "/" + pageCount + " page");
    }
    var m = (new Date(Date.now()).getMonth()) + 1;
    var folderName = (new Date(Date.now()).getDate() + "" + m + "" + new Date(Date.now()).getFullYear()).toString();
    doc.save(folderName + '-Sonu-Traders-All-Orders-List.pdf');
}


// search function
function searchInTable() {
    // Declare variables 
    var input, filter, table, tr, td, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("orderTableMaster");
    tr = table.getElementsByTagName("tr");

    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
        for (j = 0; j <= 4; j++) {
            td = tr[i].getElementsByTagName("td")[j];
            //console.log(td);
            if (td) {
                if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    if (filter.trim() == "" || filter.trim() == null)
        document.getElementById("printButton").disabled = false;
    else if (i == tr.length - 1)
        document.getElementById("printButton").disabled = true;
    else document.getElementById("printButton").disabled = false;
}
