var conversation = null;
var testData = [
    {
        'options': [0, 1, 2],
        'nodes': [
            {
                'label': 'What is this?',
                'read': false,
                'response': 'Well can\'t you see what this is?',
                'targetTreeIndex': 0
            },
            {
                'label': 'Who am this?',
                'read': false,
                'response': 'dunno, mate',
                'targetTreeIndex': 0
            },
            {
                'label': 'wut?',
                'read': false,
                'response': 'huh?',
                'targetTreeIndex': 0
            }
        ]
    }
];

window.onload = function () {
    'use strict';
    try {
        conversation = new Conversation(document.getElementById('woo'), testData);
        conversation.startConversation(0);
    } catch (e) {
        console.error(e.message);
    }
};


// Constructor
function Conversation(textarea, json) {
    'use strict';
    this.structure = json;
    this.currentTree = null;
    this.el = textarea;
}


// Sets the current tree property to the selected index.
Conversation.prototype.setCurrentTree = function setCurrentTree(treeIndex) {
    'use strict';
    if (treeIndex >= this.structure.length) {
        throw new Error('treeIndex is out of bounds.');
    } else {
        this.currentTree = treeIndex;
    }
};


// Starts a conversation at a given tree index
Conversation.prototype.startConversation = function startConversation(treeIndex) {
    'use strict';
    if (this.structure === null) {
        throw new Error('Failed to start conversation as you have not loaded a json dialog structure using setStructure()');
    } else if (treeIndex === undefined) {
        throw new Error('Failed to start conversation as treeIndex is undefined.');
    } else {
        this.setCurrentTree(treeIndex);
        var options = this.structure[this.currentTree].nodes;
        for (var i = 0; i < options.length; i++) {
            this._printLn((i + 1) + ': ' + this.getLabel(i) + ' (' + options[i].read + ')');
        }
    }
};


// Gets the treeIndex to move onto after a response.
Conversation.prototype.getFollowupTree = function getFollowupTree(nodeId) {
    'use strict';
    if (nodeId === undefined) {
        throw new Error('You must provide a nodeId when calling getFollupTree().');
    } else if (nodeId >= this.structure[this.currentTree].nodes.length) {
        throw new Error('nodeId out of bounds for treeIndex ' + this.currentTree);
    } else {
        return this.structure[this.currentTree].nodes[nodeId].targetTreeIndex;
    }
};


// Gets the requested response by node id.
Conversation.prototype.getResponse = function getResponse(nodeId) {
    'use strict';
    if (nodeId === undefined) {
        throw new Error('You must provide a nodeId when calling getFollupTree().');
    } else if (nodeId >= this.structure[this.currentTree].nodes.length) {
        throw new Error('nodeId out of bounds for treeIndex ' + this.currentTree);
    } else {
        this.structure[this.currentTree].nodes[nodeId].read = true;
        return this.structure[this.currentTree].nodes[nodeId].response;
    }
};


// Gets the label text for selected node id.
Conversation.prototype.getLabel = function getLabel(nodeId) {
    'use strict';
    if (nodeId === undefined) {
        throw new Error('You must provide a nodeId when calling getFollupTree().');
    } else if (nodeId >= this.structure[this.currentTree].nodes.length) {
        throw new Error('nodeId out of bounds for treeIndex ' + this.currentTree);
    } else {
        return this.structure[this.currentTree].nodes[nodeId].label;
    }
};


// Selects a dialog option by node id.
Conversation.prototype.actOnSelection = function actOnSelection(nodeId) {
    'use strict';
    if (nodeId === undefined) {
        throw new Error('You must provide a nodeId when calling getFollupTree().');
    } else if (nodeId >= this.structure[this.currentTree].nodes.length) {
        throw new Error('nodeId out of bounds for treeIndex ' + this.currentTree);
    } else {
        var response = this.getResponse(nodeId);
        var followup = this.getFollowupTree(nodeId);
        this._printLn('\n' + response);
        this._printLn('\n\n');
        this.startConversation(followup);
    }
};


// Ends the current conversation. And resets the conversation.
Conversation.prototype.endConversation = function endConversation() {
    'use strict';
    this._printLn('\nConversation end.');
    this.currentTree = null;
};


// Private function to output a line of text.
// Outputs to a textarea for now, this is where implementation into
// game framework is necessary.
Conversation.prototype._printLn = function _printLn(text) {
    'use strict';
    this.el.innerHTML += text + '\n';
};
