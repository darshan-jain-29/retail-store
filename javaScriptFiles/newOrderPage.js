var invoiceNo = null;
var customerName = null;
var orderDate = null;
var mobileNo = null;
var table = document.getElementById("orderTable");
var mobileNoNotPresent = 0;
var discount = 0;
var amountPaid = 0;
var amountBalance = 0;

function fetchInvoiceNumberSeries() {
    flushAllFields();
    connection.query("SELECT seriesValue from seriesnumber WHERE seriesName = 'orderseries' ", function (error, results, fields) {
        if (error) throw error;
        invoiceNo = document.getElementById("invoiceNo").value = results[0].seriesValue;
    });
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

function getCurrentDate() {
    Date.prototype.toDateInputValue = (function () {
        var local = new Date(this);
        local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
        return local.toJSON().slice(0, 10);
    });
    document.getElementById('orderDate').value = new Date().toDateInputValue();
}

// delete row from the pproduct line item table
function delete_row(context) {
    var tempID = context.id.split("deleteButton");
    var data = getQueryData(tempID[1]);
    if (data[2])
        document.getElementById("totalQuantityFooter").innerHTML = (parseFloat(document.getElementById("totalQuantityFooter").innerHTML) - parseFloat(data[2])).toString();
    if (data[3])
        document.getElementById("totalPiecesFooter").innerHTML = (parseFloat(document.getElementById("totalPiecesFooter").innerHTML) - parseFloat(data[3])).toString();
    var _row = context.parentElement.parentElement;
    document.getElementById('orderTable').deleteRow(_row.rowIndex);
    calculateBillTotal();
    calculateTotalQty();
}

function calculateBillTotal() {
    var billT = 0
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tablePieces = table.rows[r].cells[5].getElementsByTagName("input")[0].value;
        if (tablePieces >= 0) {
            billT = billT + parseFloat(tablePieces);
        }
    }
    document.getElementById("netAmtFooter").innerHTML = document.getElementById("grossAmtFooter").innerHTML = Math.round(parseFloat(billT) * 100) / 100;
    if (billT > 0) {
        document.getElementById("paymentDiv").hidden = false;
        document.getElementById("balanceAmount").value = billT;
    }
    else {
        document.getElementById("paymentDiv").hidden = true;
        document.getElementById("balanceAmount").value = "0";
    }
    calculateDiscount();
    calculateBalanceAmount();
    setpaymentStatus();
}

function calculateDiscount() {
    if (document.getElementById("discountAmount").value && document.getElementById("grossAmtFooter").innerHTML != "0") {
        if (document.getElementById("discountAmount").value > 0) {
            document.getElementById("netAmtFooter").innerHTML = Math.round((parseFloat(document.getElementById("grossAmtFooter").innerHTML) - parseFloat(document.getElementById("discountAmount").value)) * 100) / 100;
            document.getElementById("amountPaying").value = document.getElementById("balanceAmount").value = document.getElementById("netAmtFooter").innerHTML;
            document.getElementById("paymentStatus").selectedIndex = document.getElementById("paymentMode").selectedIndex = 0;
        }
        else {
            document.getElementById("discountAmount").value = "";
            document.getElementById("netAmtFooter").innerHTML = Math.round(parseFloat(document.getElementById("grossAmtFooter").innerHTML) * 100) / 100;
            document.getElementById("balanceAmount").value = document.getElementById("netAmtFooter").innerHTML;
        }
    } else {
        document.getElementById("discountAmount").value = "";
        document.getElementById("netAmtFooter").innerHTML = Math.round(parseFloat(document.getElementById("grossAmtFooter").innerHTML) * 100) / 100;
        document.getElementById("balanceAmount").value = document.getElementById("netAmtFooter").innerHTML;
    }
    calculateBalanceAmount();
}

function calculateQtyRpm(context) {
    var tempID = []
    if (context.id.includes("orderQuantity")) {
        tempID = context.id.split("orderQuantity");
        calculateTotalQty();
    }
    else if (context.id.includes("rpm"))
        tempID = context.id.split("rpm");
    else if (context.id.includes("pieces"))
        tempID = context.id.split("pieces");

    if (document.getElementById("orderQuantity" + tempID[1]).value && document.getElementById("rpm" + tempID[1]).value && document.getElementById("orderQuantity" + tempID[1]).value >= 0 && document.getElementById("rpm" + tempID[1]).value >= 0) {
        var compute = Math.round(parseFloat(document.getElementById("orderQuantity" + tempID[1]).value) * parseFloat(document.getElementById("rpm" + tempID[1]).value * parseFloat(document.getElementById("pieces" + tempID[1]).value)) * 100) / 100;
        document.getElementById("subtotal" + tempID[1]).value = compute;
    }
    else document.getElementById("subtotal" + tempID[1]).value = "0.00";
    calculateBillTotal();
}

function calculatePieceTotal(context) {
    //calculateQtyRpm(context);
    if (context.value <= 0)
        context.value = "0";
    calculateTotalPieces();
    calculateQtyRpm(context);
}

function setpaymentStatus() {
    if (document.getElementById("paymentStatus").value == "0") {
        document.getElementById("amountPaying").value = document.getElementById("netAmtFooter").innerHTML;
        document.getElementById("balanceAmount").value = "0";
    }
    else {
        document.getElementById("amountPaying").value = "";
        document.getElementById("balanceAmount").value = document.getElementById("netAmtFooter").innerHTML;
    }
}

function calculateBalanceAmount() {
    var currentPay = document.getElementById("amountPaying").value;
    if (currentPay >= 0) {
        var remainingP = Math.round((parseFloat(document.getElementById("netAmtFooter").innerHTML) - currentPay) * 100) / 100;
        amountBalance = remainingP;
        if (amountBalance >= 0) {
            document.getElementById('amountPaying').style.backgroundColor = "white";
            document.getElementById("balanceAmount").value = remainingP;
        }
        else {
            document.getElementById("amountPaying").value = "";
            document.getElementById("amountPaying").focus();
            document.getElementById("amountPaying").style.backgroundColor = "#ff6666";
            document.getElementById("balanceAmount").value = document.getElementById("netAmtFooter").innerHTML;
        }
    }
    else {
        document.getElementById("amountPaying").value = 0;
        amountBalance = document.getElementById("netAmtFooter").innerHTML;
    }
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
    if (document.getElementById('amountPaying').value == '' || document.getElementById('amountPaying').value == null || document.getElementById('amountPaying').value < 0) {
        document.getElementById('amountPaying').style.backgroundColor = "#ff6666";
        return 0;
    } else document.getElementById('amountPaying').style.backgroundColor = "white";

    return 1;
}

function saveDetails() {
    // perform validations
    customerName = document.getElementById("customerName").value.trim();
    invoiceNo = document.getElementById("invoiceNo").value.trim();
    mobileNo = document.getElementById("mobileNo").value.trim();

    if (checkCustomerDetails(invoiceNo, customerName, mobileNo) == 0)
        return;

    if (checkOrderDetails(table) == 0)
        return;

    if (checkPaymentDetails() == 0)
        return;

    orderDate = document.getElementById("orderDate").value;
    var tempDateArray = orderDate.split("-");
    orderDate = tempDateArray[2] + "-" + tempDateArray[1] + "-" + tempDateArray[0];
    var totalPieces = Math.round(parseFloat(document.getElementById("totalPiecesFooter").innerHTML) * 100) / 100;
    var totalMeters = Math.round(parseFloat(document.getElementById("totalQuantityFooter").innerHTML) * 100) / 100;
    var grossAmt = Math.round(parseFloat(document.getElementById("grossAmtFooter").innerHTML) * 100) / 100;
    discount = Math.round(parseFloat(discount) * 100) / 100;
    var netAmt = Math.round(parseFloat(document.getElementById("netAmtFooter").innerHTML) * 100) / 100;
    amountPaid = Math.round(parseFloat(amountPaid) * 100) / 100;
    amountBalance = Math.round(parseFloat(amountBalance) * 100) / 100;

    var paymentModeVal = "Cash";
    var paymentStatusVal = "Full Payment";
    if (document.getElementById("paymentStatus").value == "1")
        paymentStatusVal = "Part Payment";
    if (document.getElementById("paymentMode").value == "1")
        paymentModeVal = "Card";

    //invoice number, customer name, date, bill amount, amount paid, discount, totalMeters, totalPieces
    connection.query("Insert into ordermaster VALUES ('" + invoiceNo.toUpperCase() + "','" + customerName.toUpperCase() + "','" + mobileNo + "','" + orderDate + "','" + totalPieces + "','" + totalMeters + "','" + grossAmt + "','" + discount + "','" + netAmt + "','" + amountPaid + "','" + amountBalance + "','" + paymentModeVal + "','" + paymentStatusVal + "','" + "NO" + "')",
        function (err, result) {
            if (err) throw err;
        });

    // save line item in the database - invoice no,productcode, product name, qty, pcs, rate, stubtotal
    for (var r = 1, n = table.rows.length - 1; r < n; r++) {
        var tableProductCode = table.rows[r].cells[0].getElementsByTagName("input")[0].value.trim();
        var tableProductName = table.rows[r].cells[1].getElementsByTagName("input")[0].value.trim();
        var tableQuantity = Math.round(parseFloat(table.rows[r].cells[2].getElementsByTagName("input")[0].value) * 100) / 100;
        var tablePieces = Math.round(parseFloat(table.rows[r].cells[3].getElementsByTagName("input")[0].value) * 100) / 100;
        var tableRate = Math.round(parseFloat(table.rows[r].cells[4].getElementsByTagName("input")[0].value) * 100) / 100;
        var tableSubtotal = Math.round(parseFloat(table.rows[r].cells[5].getElementsByTagName("input")[0].value) * 100) / 100;

        connection.query("Insert into orderlineitemdetails VALUES ('" + invoiceNo.toUpperCase() + "','" + tableProductCode.toUpperCase() + "','" + tableProductName.toUpperCase() + "','" + tableQuantity + "','" + tablePieces + "','" + tableRate + "','" + tableSubtotal + "')",
            function (err, result) {
                if (err) throw err;
            });
    }

    //fetch customer details and add total purchase
    connection.query("UPDATE customerdetails as t1, (select totalPurchase, outstandingAmount from customerdetails where customerName = '" + customerName.toUpperCase() + "' AND mobileNumber = '" + mobileNo + "' ) as t2 set t1.totalPurchase = t1.totalPurchase +" + netAmt + ", t1.outstandingAmount = t1.outstandingAmount +" + amountBalance + " where t1.customerName = '" + customerName.toUpperCase() + "' AND t1.mobileNumber = '" + mobileNo + "';",
        function (err, result) {
            if (err) throw err;
            //console.log(result);
        });

    // save mobile number against new customer name
    if (mobileNoNotPresent == 1) {
        connection.query("Insert into customerdetails VALUES ('" + customerName.toUpperCase() + "','" + mobileNo + "','" + netAmt + "','" + amountBalance + "')",
            function (err, result) {
                if (err) throw err;
            });
    }

    // save payment mode details in the payment table
    connection.query("Insert into payment VALUES ('" + invoiceNo + "','" + orderDate + "','" + amountPaid + "','" + paymentModeVal + "','" + "INWARD" + "')",
        function (err, result) {
            if (err) throw err;
        });

    // update invoice number
    connection.query("UPDATE seriesnumber as t1, (select seriesValue from seriesnumber where seriesName = 'orderseries' ) as t2 set t1.seriesValue = t1.seriesValue + 1 where t1.seriesName = 'orderseries';",
        function (err, result) {
            if (err) throw err;
            //console.log(result);
        });

    //reload the page
    alert("Order Details Saved!");
    fetchInvoiceNumberSeries();
    //resetInvoice();
}

function flushAllFields() {
    document.getElementById("invoiceNo").value = null;
    document.getElementById("mobileNo").value = null;
    document.getElementById("customerName").value = null;
    getCurrentDate();
    document.getElementById("productCode0").value = null;
    document.getElementById("productName0").value = null;
    document.getElementById("orderQuantity0").value = "0.00";
    document.getElementById("pieces0").value = "1";
    document.getElementById("rpm0").value = null;
    document.getElementById("subtotal0").value = "0";

    while (table.rows.length != 3) {
        table.deleteRow(table.rows.length - 2);
    }

    document.getElementById("totalQuantityFooter").innerHTML = "00.00";
    document.getElementById("totalPiecesFooter").innerHTML = "1";
    document.getElementById("grossAmtFooter").innerHTML = "00.00";
    document.getElementById("discountAmount").value = null;
    document.getElementById("netAmtFooter").innerHTML = "00.00";

    document.getElementById("paymentMode").selectedIndex = 0;
    document.getElementById("paymentStatus").selectedIndex = 0;
    document.getElementById("amountPaying").value = null;
    document.getElementById("balanceAmount").value = "0";
    document.getElementById("paymentDiv").hidden = true;

}