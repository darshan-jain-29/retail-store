function fetchBillData() {
    var d = remote.getGlobal('myGlobalParameters').orderPreviewInvoiceNo;
    document.getElementById("invoiceNo").value = d;
    document.title = "Order Details - Invoice No. " + d;
    connection.query("SELECT * from ordermaster WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        loadValuesInPage(results[0]);
    });

    var tableValues = [];
    connection.query("Select * from orderlineitemdetails WHERE invoiceNumber = '" + d + "';", function (error, results, fields) {
        if (error) throw error;
        tableValues = results;
        loadValuesInTable(tableValues);
    });
}

function loadValuesInPage(data) {
    console.log(data);
    document.getElementById("mobileNo").value = data.mobileNumber;
    document.getElementById("customerName").value = data.customerName;
    document.getElementById("orderDate").value = data.orderDate;
    document.getElementById("totalPiecesFooter").innerHTML = data.totalPieces;
    document.getElementById("totalQuantityFooter").innerHTML = data.totalMeters;
    document.getElementById("discountAmount").value = data.discount;
    document.getElementById("billAmtFooter").innerHTML = data.billAmount;
    document.getElementById("netAmtFooter").innerHTML = parseFloat(data.billAmount) - parseFloat(data.discount);
    document.getElementById("paymentMode").innerHTML = data.paymentMode;
    document.getElementById("paymentStatus").innerHTML = data.paymentStatus;
    document.getElementById("amountPaid").value = data.amountPaid;
    document.getElementById("balanceAmount").value = Math.round((parseFloat(data.billAmount) - parseFloat(data.discount) - parseFloat(data.amountPaid)) * 100) / 100;



    if (data.billAmount == data.amountPaid)
        document.getElementById("displayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paidstamp.png\">";
    else {
        document.getElementById("displayPaymentStatusIcon").innerHTML = "<img src=\"../assets/paymentpending.png\">";
        document.getElementById("paymentDiv").hidden = false;
        //document.getElementById("balanceAmount").innerHTML = (parseFloat(data.billAmount) - parseFloat(data.amountPaid)).toString();
    }
    makeMasterDataBold();
}

function loadValuesInTable(tableValues) {
    var t = "";
    var tableInstance = document.getElementById("orderTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";
    console.log(tableValues);
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
    document.getElementById("billAmtFooter").innerHTML = billTotal;
}

function makeMasterDataBold() {
    document.getElementById("invoiceNo").style.fontWeight = document.getElementById("mobileNo").style.fontWeight = document.getElementById("customerName").style.fontWeight = document.getElementById("orderDate").style.fontWeight = 'bold';
}

document.addEventListener("keydown", event => {

    switch (event.key) {
        case "Escape":
            if (remote.getCurrentWindow()) {
                remote.getCurrentWindow().close();
            }
            break;
    }
});