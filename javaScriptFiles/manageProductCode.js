var tableData = null;
var addRow = false;
var oldEditRowData = [];

function fetchProductCodeTable() {
    connection.query('SELECT * from productcode ORDER BY productCategory, productCode', function (error, results, fields) {
        if (error) throw error;
        clearValuesInForm();
        tableData = results;
        loadValuesInTable(results);
    });

    fetchProductCategoriesForDropdown("addProductCode");
    fetchProductCategoriesForDropdown("editProductCode");
}

function clearValuesInForm() {
    document.getElementById("newProductCode").value = document.getElementById("newProductName").value = document.getElementById("minimumCut").value = document.getElementById("ratePerMeter").value = null;
}

function loadValuesInTable(results) {
    var t = "";
    var tableInstance = document.getElementById("productCodeTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);
        if (results[i] instanceof Array) {
            console.log("andar aaya?");
        } else {
            newCell = document.createElement("td");
            newCell.setAttribute("id", "productCode" + i);
            newCell.textContent = results[i].productCode;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");;
            newCell.setAttribute("id", "productName" + i);
            newCell.textContent = results[i].productValue;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.setAttribute("id", "productCategory" + i);
            newCell.textContent = results[i].productCategory;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.setAttribute("id", "minimumQty" + i);
            newCell.textContent = results[i].minimumCut;
            newRow.appendChild(newCell);

            newCell = document.createElement("td");
            newCell.setAttribute("id", "rpm" + i);
            newCell.textContent = results[i].ratePerMeter;
            newRow.appendChild(newCell);

            newCell = document.createElement("input");
            newCell.setAttribute("id", "editButton" + i);
            newCell.setAttribute("type", "image");
            newCell.setAttribute("src", "../assets/img/editld.png");
            newCell.setAttribute("title", "Edit");
            newCell.setAttribute("class", "imageButton");
            newCell.setAttribute("onclick", "setEditRowContent(this)");
            newCell.setAttribute("data-toggle", "modal");
            newCell.setAttribute("data-target", "#editCategoryModal");
            newRow.appendChild(newCell);

            newCell = document.createElement("input");
            newCell.setAttribute("id", "deleteButton" + i);
            newCell.setAttribute("type", "image");
            newCell.setAttribute("src", "../assets/img/deleteld.png");
            newCell.setAttribute("title", "Delete");
            newCell.setAttribute("class", "imageButton");
            newCell.setAttribute("onclick", "deleteRow(this)");
            newRow.appendChild(newCell);
        }
    }
}

function validatePage() {
    if (document.getElementById('newProductCode').value.trim())
        document.getElementById('newProductCode').style.backgroundColor = "white";
    else {
        document.getElementById('newProductCode').style.backgroundColor = "#ff6666";
        return 0;
    }

    if (document.getElementById('newProductName').value.trim())
        document.getElementById('newProductName').style.backgroundColor = "white";
    else {
        document.getElementById('newProductName').style.backgroundColor = "#ff6666";
        return 0;
    }

    if (document.getElementById('minimumCut').value.trim())
        document.getElementById('minimumCut').style.backgroundColor = "white";
    else {
        document.getElementById('minimumCut').style.backgroundColor = "#ff6666";
        return 0;
    }

    if (document.getElementById('ratePerMeter').value.trim())
        document.getElementById('ratePerMeter').style.backgroundColor = "white";
    else {
        document.getElementById('ratePerMeter').style.backgroundColor = "#ff6666";
        return 0;
    }
}

function fetchProductCategoriesForDropdown(dropDownArea) {
    connection.query('SELECT * from productCategory ORDER BY productCategory', function (error, results, fields) {
        if (error) throw error;
        loadProductCategoriesInDropdown(results, dropDownArea);
    });
}

function loadProductCategoriesInDropdown(results, dropDownArea) {
    var theSelect = null;
    if (dropDownArea == "addProductCode")
        theSelect = document.getElementById("productCategoryDropdown");
    else if (dropDownArea == "editProductCode")
        theSelect = document.getElementById("editProductCategoryDropdown");

    var options = theSelect.getElementsByTagName('option');
    for (var i = 0; i < options.length; i++) {
        if (options[i].value) {
            theSelect.removeChild(options[i]);
            i--;
        }
    }
    for (var i = 0; i < results.length; i++) {
        options = document.createElement("option");
        options.value = i;
        options.text = results[i].productCategory;
        if (results[i].productCategory == "SHIRT" && dropDownArea == "addProductCode")
            options.selected = "true";
        theSelect.add(options);
    }
}

function checkAgainstDatabase(comingFrom) {
    var newProductC = null;
    var newProductN = null;
    var productCategoryDropdown = null;
    var selectedProductCategory = null;

    if (comingFrom == "editSection") {
        newProductC = document.getElementById("editProductCode").value.trim();
        newProductN = document.getElementById("editProductName").value.trim();
        productCategoryDropdown = document.getElementById("editProductCategoryDropdown");
        selectedProductCategory = productCategoryDropdown.options[productCategoryDropdown.selectedIndex].text;

    } else if (comingFrom == "addSection") {
        newProductC = document.getElementById("newProductCode").value.trim();
        newProductN = document.getElementById("newProductName").value.trim();
        productCategoryDropdown = document.getElementById("productCategoryDropdown");
        selectedProductCategory = productCategoryDropdown.options[productCategoryDropdown.selectedIndex].text;
    }

    var i = 0;

    for (var i = 0; i < tableData.length; i++) {
        if (comingFrom == "addSection") {
            if (tableData[i].productCode == newProductC.toUpperCase()) {
                console.log("andar")
                document.getElementById("newProductCode").style.backgroundColor = "#ff6666";
                addRow = false;
                break;
            }
            else document.getElementById("newProductCode").style.backgroundColor = "white";

            if (tableData[i].productValue == newProductN.toUpperCase() && tableData[i].productCategory == selectedProductCategory.toUpperCase()) {
                document.getElementById("newProductName").style.backgroundColor = "#ff6666";
                document.getElementById("productCategoryDropdown").style.backgroundColor = "#ff6666";
                addRow = false;
                break;
            }
            else {
                document.getElementById("newProductName").style.backgroundColor = "white";
                document.getElementById("productCategoryDropdown").style.backgroundColor = "white";
            }
            addRow = true;
        } else if (comingFrom == "editSection") {
            if (newProductC != oldEditRowData[0] && newProductN != oldEditRowData[1] && selectedProductCategory != oldEditRowData[2]) {
            } else {
                if (tableData[i].productCode == newProductC.toUpperCase()) {
                    document.getElementById("editProductCode").style.backgroundColor = "#ff6666";
                    addRow = false;
                    break;
                }
                else document.getElementById("editProductCode").style.backgroundColor = "white";

                if (tableData[i].productValue == newProductN.toUpperCase() && tableData[i].productCategory == selectedProductCategory.toUpperCase()) {
                    document.getElementById("editProductName").style.backgroundColor = "#ff6666";
                    document.getElementById("editProductCategoryDropdown").style.backgroundColor = "#ff6666";
                    addRow = false;
                    break;
                }
                else {
                    document.getElementById("editProductName").style.backgroundColor = "white";
                    document.getElementById("editProductCategoryDropdown").style.backgroundColor = "white";
                }
            }
            addRow = false;
        }
    }
}

function addNewProductCode() {
    var newProductC = document.getElementById("newProductCode").value.trim();
    var newProductN = document.getElementById("newProductName").value.trim();

    var productCategoryDropdown = document.getElementById("productCategoryDropdown");
    var selectedProductCategory = productCategoryDropdown.options[productCategoryDropdown.selectedIndex].text;

    var minimumCut = Math.round(parseFloat(document.getElementById("minimumCut").value.trim()) * 100) / 100;
    var rpm = document.getElementById("ratePerMeter").value.trim();

    if (checkAgainstDatabase() == 0)
        return;
    if (validatePage() == 0)
        return;
    if (addRow) {
        //invoice number, customer name, date, bill amount, amount paid, discount, totalMeters, totalPieces
        connection.query("Insert into productcode VALUES ('" + newProductC.toUpperCase() + "','" + newProductN.toUpperCase() + "','" + selectedProductCategory.toUpperCase() + "','" + minimumCut + "','" + rpm + "')",
            function (err, result) {
                if (err) throw err;
            });
        fetchProductCodeTable();
    }
}

function deleteRow(currentContext) {
    var tempID = currentContext.id.split("deleteButton");
    var newProdC = document.getElementById("productCode" + tempID[1]).innerHTML;
    var newProdN = document.getElementById("productName" + tempID[1]).innerHTML;
    var newProdCateg = document.getElementById("productCategory" + tempID[1]).innerHTML;
    var nminimumC = document.getElementById("minimumQty" + tempID[1]).innerHTML;
    var rpm = document.getElementById("rpm" + tempID[1]).innerHTML;

    if (confirm("Are you sure to DELETE the category " + newProdC + " - " + newProdN + " - " + newProdCateg + " ? ", "Parshwamani - IT")) {
        connection.query("DELETE from productCode WHERE productCode = '" + newProdC.toUpperCase() + "' AND productValue = '" + newProdN.toUpperCase() + "' AND productCategory = '" + newProdCateg.toUpperCase() + "';",
            function (err, result) {
                if (err) throw err;
                //console.log(result);
            });
        fetchProductCodeTable();
    }
    else
        document.getElementById("deletedCategory").style.display = "none";
}

function setEditRowContent(currentContext) {
    var tempID = currentContext.id.split("editButton");
    document.getElementById("editProductCode").value = document.getElementById("productCode" + tempID[1]).innerHTML;
    document.getElementById("editProductName").value = document.getElementById("productName" + tempID[1]).innerHTML;
    var textToFind = document.getElementById("productCategory" + tempID[1]).innerHTML;
    setOldDropdownvalue(textToFind);
    document.getElementById("editMinimumCut").value = document.getElementById("minimumQty" + tempID[1]).innerHTML;
    document.getElementById("editRPM").value = document.getElementById("rpm" + tempID[1]).innerHTML;

    //set background color white
    document.getElementById("editProductCode").style.backgroundColor = "white";
    document.getElementById("editProductName").style.backgroundColor = "white";
    document.getElementById("productCategory").style.backgroundColor = "white";
    document.getElementById("editMinimumCut").style.backgroundColor = "white";
    document.getElementById("editRPM").style.backgroundColor = "white";
    
    oldEditRowData = [];
    oldEditRowData.push(document.getElementById("productCode" + tempID[1]).innerHTML);
    oldEditRowData.push(document.getElementById("productName" + tempID[1]).innerHTML);
    oldEditRowData.push(document.getElementById("productCategory" + tempID[1]).innerHTML);
    oldEditRowData.push(document.getElementById("minimumQty" + tempID[1]).innerHTML);
    oldEditRowData.push(document.getElementById("rpm" + tempID[1]).innerHTML);
}

function printProductCodes() {

}

function setOldDropdownvalue(textToFind) {
    var dd = document.getElementById('editProductCategoryDropdown');
    var i = 0;
    for (i = 0; i < dd.options.length; i++) {
        if (dd.options[i].text == textToFind) {
            dd.options[i].selected = true;
            return;
        }
    }
    if (i == dd.options.length) {
        //show error message that the category asked for is deleted earlier
    }
}