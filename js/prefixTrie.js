class PrefixTreeNode {
    constructor(value) {
        this.children = {};
        this.endWord = null;
        this.value = value;
        this.additionalInfo = null;
    }
}

class PrefixTree extends PrefixTreeNode {
    constructor() {
        super(null);
    }

    addWord(word, additionalInfo) {
        const addWordHelper = (node, str) => {
            if (!node.children[str[0]]) {
                node.children[str[0]] = new PrefixTreeNode(str[0]);
            }

            if (str.length === 1) {
                node.children[str[0]].endWord = 1; //set the end word, even if a longer word exists already
                node.children[str[0]].additionalInfo = additionalInfo;
            } else if (str.length > 1) {
                addWordHelper(node.children[str[0]], str.slice(1));
            }
        };
        addWordHelper(this, word);
    }

    getAllFullWords() {
        const getAllSeqentialPermutations = (strArray) => {
            var permutations = [];
            var partialStringSoFar = '';
            strArray.forEach(s => {
                partialStringSoFar += s;
                permutations.push(partialStringSoFar.slice());
            });
            return permutations;
        }

        var nodePaths = {};
        const traverse = (n, nodesOnThisPath) => {
            if (n.value) {
                nodesOnThisPath.push(n.value);

                if (n.endWord) {
                    var permutations = getAllSeqentialPermutations(nodesOnThisPath);
                    permutations.forEach(p => {
                        if (nodePaths[p]) {
                            nodePaths[p].push({
                                results: nodesOnThisPath.join(''),
                                additionalInfo: n.additionalInfo
                            });
                        }
                        else {
                            nodePaths[p] = [{
                                results: nodesOnThisPath.join(''),
                                additionalInfo: n.additionalInfo
                            }];
                        }
                    });
                }
            }

            if (n.children) {
                for (let k in n.children) {
                    traverse(n.children[k], nodesOnThisPath.slice());
                }
            }
        };

        traverse(this, []);
        return nodePaths;
    }
}