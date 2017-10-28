document.getElementById('btn-generate-autocompletefiles').onclick = function (event) {
    var content = document.getElementById('txt-autocomplete-content').value;
    if (content === '') {
        alert('Please enter some content in the text box');
        return;
    }
    debugger;
    var prefixTree = new PrefixTree();
    Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        step: function (row) {
            if (!row.data[0]["SearchTerm"]) {
                alert('Please use a valid CSV, one column must be "SearchTerm"');
                throw 'csv-missing-column';
            }

            var searchTerm = row.data[0]["SearchTerm"].trim();
            delete row.data[0]['SearchTerm'];

            prefixTree.addWord(searchTerm, row.data[0]);
        },
        complete: function () {
            var allNodePathsForAutocomplete = prefixTree.getAllFullWords();
            saveStaticAutocompleteContent(allNodePathsForAutocomplete);
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