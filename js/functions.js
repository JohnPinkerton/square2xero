var output = [];
var outputLength;

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    var file = files[0];

    // read the file metadata
    var output = ''
        output += '<span style="font-weight:bold;">' + escape(file.name) + '</span><br />\n';
        output += ' - FileType: ' + (file.type || 'n/a') + '<br />\n';
        output += ' - FileSize: ' + file.size + ' bytes<br />\n';
        output += ' - LastModified: ' + (file.lastModifiedDate ? file.lastModifiedDate.toLocaleDateString() : 'n/a') + '<br />\n';

    // read the file contents
    printTable(file);

    // post the results
    $('#list').append(output);
}

function printTable(file) {
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(event){
        var csv = event.target.result;
        output = $.csv.toArrays(csv);

        changeCSVHeaders();
    };
    
    reader.onerror = function(){ alert('Unable to read ' + file.fileName); };
}

function getConversion() {
    var input = $("textarea#csvInput").val();
    if(input === "") {
        alert("You've not input any CSV");
        return;
    }

    output = CSVtoArray(input);
    
    showOutput();
    //changeCSVHeaders();
}

function changeCSVHeaders() {
    outputLength = output.length;
    var notesIndex = output.indexOf("Notes");
    var firstEntry = notesIndex + 1;

    //Find Date and change to InvoiceDate
    changeItem("Date", "InvoiceDate");
    changeDate(1, 0);
    
    //Find Time and change to ContactName
    changeItem("Time", "ContactName");
    forEachIndex(1, 1, "SquareUp");

    //Find Detail and change to Description
    changeItem("Details", "Description");

    //Find Payment ID and change to Reference
    changeItem("Payment ID", "Refrence");

    //Find Device Name and change to InvoiceNumber
    changeItem("Device Name", "InvoiceNumber");

    //Find Category Name and change to AccountCode
    changeItem("Category Name", "AccountCode");
    forEachIndex(1, 5, "210");

    //Find Item Name and change it to Inventory Item Code
    changeItem("Item Name", "InventoryItemCode");

    //Find Price and change it to UnitAmount
    changeItem("Price", "UnitAmount");

    //Convert Discount from $ to %
    changeDiscount(1, 9);

    //Find Sales Tax and change it to TaxType
    changeItem("Sales Tax", "TaxType");
    forEachIndex(1, 10, "Tax on Sales");



    showOutput();
    array2CSV();
}

function getIndex(filter) {
    for (var i=0, len=output.length; i<len; i++) {
        for (var j=0, len2=output[i].length; j<len2; j++) {
          if (output[i][j] === filter) { var location = "[" + i + "][" + j + "]"; return location; }
        }
    }
    return -1;
}

function changeItem(filter, result) {
    for (var i=0, len=output.length; i<len; i++) {
        for (var j=0, len2=output[i].length; j<len2; j++) {
          if (output[i][j] === filter) { output[i][j] = result; }
        }
    }
}

function forEachIndex(arrayNumber, indexNumber, result) {
    var i = arrayNumber;
    var j = indexNumber;

    while(i < output.length) {
        output[i][j] = result;
        i = i + 1;
    }
}

function changeDate(arrayNumber, indexNumber) {
    var i = arrayNumber;
    var j = indexNumber;

    while(i < output.length) {
        output[i][4] = output[i][4] + "-" + output[i][j];
        var sDate = output[i][j].split("-"); //  Formatted As: YYYY-MM-DD
        var yyyy = sDate[0];
        var mm = sDate[1];
        var dd = sDate[2];

        var xDate = mm + "/" + dd + "/" + yyyy;
        output[i][j] = xDate;

        i = i + 1;
    }
}

function changeDiscount(arrayNumber, indexNumber) {
    var i = arrayNumber;
    var j = indexNumber;

    while(i < output.length) {
            var squareDiscount = output[i][j].split(".");
            var squareOriginal = output[i][j-1].split(".");

            var sqDiscountInt = parseFloat(squareDiscount[0].substring(2) + "." + squareDiscount[1].substring(0,2));
            var sqOriginalInt = parseFloat(squareOriginal[0].substring(1) + "." + squareOriginal[1].substring(0,2));

            var xeroDiscount = (sqDiscountInt / sqOriginalInt) * 100;

            output[i][j] = xeroDiscount;

        if(output[i][j] !== "$0.00000") {

        }

        i = i + 1;
    }
}

function showOutput() {
    var html = '';
    for(var row in output) {
        html += '<tr>\r\n';
        for(var item in output[row]) {
            html += '<td>' + output[row][item] + '</td>\r\n';
        }
        html += '</tr>\r\n';
    }
    $('#contents').html(html);
}

function array2CSV() {
    var csvContent = "data:text/csv;charset=utf-8,";

    output.forEach(function(infoArray, index) {
        dataString = infoArray.join(",");
        csvContent += index < output.length ? dataString + "\n" : dataString;
    });

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "xeroInvoice.csv");
    link.click();
}

function errorHandler(e) {
    console.log("There was an error: " + e.toString());
}
