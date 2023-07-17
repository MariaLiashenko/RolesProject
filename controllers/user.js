import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import fs from "fs";

dotenv.config();

const JWT = process.env.JWT;
const filePath = "tree.json";

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

    AddNode(id, namePerson, role, parentId) {
        const newNode = new TreeNode(id, namePerson, role);

        if (!this.root) {
            this.root = newNode;
        } else {
            const parentNode = this.findNodeById(parentId, this.root);
            if (parentNode) {
                parentNode.children.push(newNode);
            } else {
                console.error("Parent node not found.");
            }
        }
    }

    findNodeById(id, node) {
        if (node.id === id) {
            return node;
        } else {
            for (let childNode of node.children) {
                const foundNode = this.findNodeById(id, childNode);
                if (foundNode) {
                    return foundNode;
                }
            }
        }
        return null;
    }

    printTree() {
        if (this.root) {
            this.printNode(this.root);
        } else {
            console.log("Tree is empty.");
        }
    }

    printNode(node, indent = 0) {
        const indentation = " ".repeat(indent);
        console.log(`${indentation}- ${node.namePerson} (${node.role})`);

        for (let childNode of node.children) {
            this.printNode(childNode, indent + 2);
        }
    }

    findNodeAndChildren(id) {
        if (!this.root) {
            console.log("ddddd");
            return [];
        }

        const queue = new Queue();
        queue.enqueue(this.root);

        const indexes = [];

        while (queue.size !== 0) {
            const currentNode = queue.dequeue().value;

            if (currentNode.id === id) {
                indexes.push(currentNode.id);
                this.getChildrenIndexes(currentNode, indexes);
                break;
            }

            for (let childNode of currentNode.children) {
                queue.enqueue(childNode);
            }
        }

        return indexes;
    }

    getChildrenIndexes(node, indexes) {
        if (node.children.length === 0) {
            return;
        }

        for (let childNode of node.children) {
            indexes.push(childNode.id);
            this.getChildrenIndexes(childNode, indexes);
        }
    }

    changeUserBoss(userId, oldBossId, newBossId) {
        const userNode = this.findNodeById(userId, this.root);
        const oldBossNode = this.findNodeById(oldBossId, this.root);
        const newBossNode = this.findNodeById(newBossId, this.root);

        if (!userNode || !oldBossNode || !newBossNode) {
            console.error("Invalid user or boss ID.");
            return;
        }

        if (oldBossNode.role !== "boss" || newBossNode.role !== "boss") {
            console.error("Both old boss and new boss must have the role of 'boss'.");
            return;
        }

        if (!this.isBossOfUser(oldBossNode, userNode)) {
            console.error("Old boss is not the boss of the user.");
            return;
        }

        const userIndex = oldBossNode.children.findIndex((child) => child.id === userId);
        if (userIndex !== -1) {
            oldBossNode.children.splice(userIndex, 1);
        }

        newBossNode.children.push(userNode);

        console.log(`User with ID ${userId} has been reassigned to a new boss.`);
    }

    isBossOfUser(bossNode, userNode) {
        if (userNode === bossNode) {
            return true;
        }

        for (let childNode of bossNode.children) {
            if (this.isBossOfUser(childNode, userNode)) {
                return true;
            }
        }

        return false;
    }

    readTreeFromJSONFile(filePath) {
        const json = fs.readFileSync(filePath, "utf8");
        const newTree = JSON.parse(json);
        this.root = this.buildTreeFromObject(newTree.root);
        console.log("Tree has been updated from JSON file.");
    }

    buildTreeFromObject(nodeObject) {
        const node = new TreeNode(nodeObject.id, nodeObject.namePerson, nodeObject.role);

        for (let childObject of nodeObject.children) {
            const childNode = this.buildTreeFromObject(childObject);
            node.children.push(childNode);
        }

        return node;
    }
}
function writeTreeToJSONFile(tree, filePath) {
    const json = JSON.stringify(tree);
    fs.writeFileSync(filePath, json);
}

class QueueNode {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Queue {
    constructor() {
        this.first = null;
        this.last = null;
        this.size = 0;
    }

    enqueue(value) {
        const newNode = new QueueNode(value);
        if (this.size === 0) {
            this.first = newNode;
            this.last = newNode;
        } else {
            this.last.next = newNode;
            this.last = newNode;
        }
        this.size++;
        return this;
    }

    dequeue() {
        if (this.size === 0) return false;
        const dequeuedNode = this.first;
        const newFirst = this.first.next;
        if (!newFirst) {
            this.last = newFirst;
        }
        this.first = newFirst;
        dequeuedNode.next = null;
        this.size--;
        return dequeuedNode;
    }
}
const UsersTree = new Tree();

export const register = async (req, res, next) => {
    try {
        const { username, role, email, password, parentId } = req.body;

        if (!(username && role && email && password)) {
            res.status(400).send("All input is required");
        }
        const oldUser = await User.findOne({ email });
        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(password, salt);

        const user = await User.create({
            username,
            role,
            email: email.toLowerCase(),
            password: hash,
        });

        UsersTree.AddNode(user._id.toString(), username, role, parentId);
        writeTreeToJSONFile(UsersTree, filePath);

        UsersTree.printTree();
        const token = jwt.sign({ user_id: user._id, email }, JWT, {
            expiresIn: "30d",
        });
        user.token = token;
        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            return res.status(400).send("All input is required");
        }
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ user_id: user._id, email }, JWT, {
                expiresIn: "30d",
            });
            user.token = token;
            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials");
    } catch (err) {
        next(err);
    }
};

export const list = async (req, res, next) => {
    try {
        let node = [];
        UsersTree.readTreeFromJSONFile("tree.json");
        node = UsersTree.findNodeAndChildren(req.user.user_id.toString());
        const result = [];
        for (const index of node) {
            const user = await User.findById(index);
            if (user) {
                result.push(user);
            }
        }
        writeTreeToJSONFile(UsersTree, filePath);
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

export const changeBoss = async (req, res, next) => {
    try {
        UsersTree.readTreeFromJSONFile("tree.json");
        const { userId, newBossId } = req.body;

        UsersTree.changeUserBoss(userId, req.user.user_id.toString(), newBossId);
        writeTreeToJSONFile(UsersTree, filePath);
        UsersTree.printTree();
        res.status(200).send("boss successfully  changed");
    } catch (err) {
        next(err);
    }
};
