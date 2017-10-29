document.getElementById('fileupload-csv').onchange = function (event) {
    var columnToBeUsedInSearch = document.getElementById('txt-column-tobeused-by-autocomplete').value;
    if (columnToBeUsedInSearch === '') {
        alert('Please type the column you would like to be used in the autocomplete');
    }
    debugger;
    var prefixTree = new PrefixTree();
    Papa.parse(event.target.files[0], {
        header: true,
        skipEmptyLines: true,
        step: function (row) {
            if (!row.data[0][columnToBeUsedInSearch]) {
                alert('Please use a valid CSV, one column must be: ' + columnToBeUsedInSearch);
                throw 'csv-missing-column';
            }

            var searchTerm = row.data[0][columnToBeUsedInSearch].trim().toUpperCase();
            delete row.data[0][columnToBeUsedInSearch];

            prefixTree.addWord(searchTerm, row.data[0]);
        },
        complete: function () {
            var allNodePathsForAutocomplete = prefixTree.getAllFullWords();
            saveStaticAutocompleteContent(allNodePathsForAutocomplete);
            event.target.value = '';
        }
    });
}

function saveStaticAutocompleteContent(nodePaths) {
    var zip = new JSZip();
    var searchTerms = Object.getOwnPropertyNames(nodePaths);
    var zipFilename = "staticAutocompleteContent.zip";

    for (var i = 0; i < searchTerms.length; i++) {
        var searchTerm = searchTerms[i];
        var fileContent = JSON.stringify(nodePaths[searchTerm]);
        zip.file(searchTerm + '.json', fileContent);
    }

    zip.generateAsync({ type: "blob" })
        .then(function (content) {
            saveAs(content, "autocomplete-static-files.zip");
        });
}