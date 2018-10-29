var categoryData = null;
var categoryAllowed = false;

function fetchProductCategoriesInModal() {
    connection.query('SELECT * from productCategory ORDER BY productCategory', function (error, results, fields) {
        if (error) throw error;
        categoryData = results;
        loadProductCategoriesInModal(results);
    });
}
function loadProductCategoriesInModal(results) {
    var tableInstance = document.getElementById("productCategoryModalTableBody"), newRow, newCell;
    tableInstance.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
        newRow = document.createElement("tr");
        tableInstance.appendChild(newRow);

        if (results[i] instanceof Array) {
        }
        else
            addValuesToModalTableRows(i, newRow, results[i]);
    }
}

function addValuesToModalTableRows(currentIndex, currentRow, data) {
    var productModalCategory = document.createElement("label");
    productModalCategory.setAttribute("id", "productCodeLabel" + currentIndex);
    productModalCategory.innerHTML = data.productCategory;

    var deleteCategoryModalButton = document.createElement("input");
    deleteCategoryModalButton.setAttribute("id", "deleteCategoryModalButton" + currentIndex);
    deleteCategoryModalButton.setAttribute("type", "image");
    deleteCategoryModalButton.setAttribute("src", "../assets/img/deleteld.png");
    deleteCategoryModalButton.setAttribute("title", "Delete");
    deleteCategoryModalButton.setAttribute("class", "imageButton");
    deleteCategoryModalButton.setAttribute("onclick", "deleteCategoryRow(this)");

    var currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(productModalCategory);

    currentCell = currentRow.insertCell(-1);
    currentCell.appendChild(deleteCategoryModalButton);
}

function checkIfProductCategoryPresent() {
    var newProdC = document.getElementById("newProductCategory").value.trim();
    for (var i = 0; i < categoryData.length; i++) {
        if (categoryData[i].productCategory == newProdC.toUpperCase()) {
            document.getElementById("newProductCategory").style.backgroundColor = "#ff6666";
            categoryAllowed = false;
            break;
        }
        else {
            document.getElementById("newProductCategory").style.backgroundColor = "white";
            categoryAllowed = true;
        }
    }
}

function addProductCategory() {
    var newProdC = document.getElementById("newProductCategory").value.trim();
    if (categoryAllowed) {
        connection.query("Insert into productCategory VALUES ('" + newProdC.toUpperCase() + "')",
            function (err, result) {
                if (err) throw err;
                console.log(result);
            });
        fetchProductCategoriesInModal();
        fetchProductCategoriesForDropdown();
        document.getElementById("newProductCategory").value = "";
    }
}

function deleteCategoryRow(currentContext) {
    var tempID = currentContext.id.split("deleteCategoryModalButton");
    var newProdC = document.getElementById("productCodeLabel" + tempID[1]).innerHTML;

    if (confirm("Are you sure to DELETE the category " + newProdC + " ?", "Parshwamani-IT")) {
        connection.query("DELETE from productCategory WHERE productCategory = '" + newProdC.toUpperCase() + "';",
            function (err, result) {
                if (err) throw err;
                //console.log(result);
            });
        document.getElementById("deletedCategory").style.display = "inline";
        document.getElementById("deletedCategoryName").innerHTML = newProdC.toUpperCase();
        fetchProductCategoriesInModal();
        fetchProductCategoriesForDropdown();
    }
    else
        document.getElementById("deletedCategory").style.display = "none";
}