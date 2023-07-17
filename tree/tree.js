class TreeNode {
    constructor(id, namePerson, role) {
        this.id = id;
        this.namePerson = namePerson;
        this.role = role;
        this.children = [];
    }
}

class Tree {
    constructor() {
        this.root = null;
    }
}
function addNode(id, namePerson, role, parentId) {
    const newNode = new TreeNode(id, namePerson, role);

    if (!this.root) {
        // If the tree is empty, set the new node as the root
        this.root = newNode;
    } else {
        // Find the parent node based on parentId
        const parentNode = this.findNodeById(parentId, this.root);
        if (parentNode) {
            // Add the new node as a child of the parent node
            parentNode.children.push(newNode);
        } else {
            console.error("Parent node not found.");
        }
    }
}

function findNodeById(id, node) {
    if (node.id === id) {
        return node;
    } else {
        // Recursively search for the node in the children
        for (let childNode of node.children) {
            const foundNode = this.findNodeById(id, childNode);
            if (foundNode) {
                return foundNode;
            }
        }
    }
    return null; // Node not found
}

const myTree = new Tree();

// Adding nodes
myTree.addNode(1, "Admin", "administrator", null);
myTree.addNode(2, "Boss", "boss", 1);
myTree.addNode(3, "Subordinate 1", "regular user", 2);
myTree.addNode(4, "Subordinate 2", "regular user", 2);

class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
