"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAST = toAST;
const types_1 = require("../lexer/types");
const types_2 = require("./types");
function toAST(tokens) {
    let index = 0;
    function process() {
        const currentToken = tokens[index];
        if (currentToken.type === types_1.TokenType.LineBreak) {
            index++;
            return null;
        }
        if (currentToken.type === types_1.TokenType.Literal) {
            index++;
            return {
                type: types_2.ASTNodeType.Literal,
                value: currentToken.value
            };
        }
        if (currentToken.type === types_1.TokenType.String) {
            index++;
            return {
                type: types_2.ASTNodeType.String,
                value: currentToken.value
            };
        }
        if (currentToken.type === types_1.TokenType.Log) {
            let nextNode = tokens[index++];
            const children = [];
            while (nextNode.type !== types_1.TokenType.LineBreak) {
                const next = process();
                if (next)
                    children.push(next);
                nextNode = tokens[index];
            }
            return {
                type: types_2.ASTNodeType.Log,
                children
            };
        }
        if (currentToken.type === types_1.TokenType.VariableDeclaration) {
            index++;
            const variableNameNode = process();
            if (!variableNameNode || variableNameNode.type !== types_2.ASTNodeType.Literal)
                throw new Error('Invalid variable node');
            const assignmentNode = tokens[index++];
            if (assignmentNode.type !== types_1.TokenType.AssignmentOperator)
                throw new Error('Must use = operator to assign value');
            const variableValueNode = process();
            if (!variableValueNode || !('value' in variableValueNode))
                throw new Error('Invalid variable value');
            return {
                type: types_2.ASTNodeType.Assignment,
                name: variableNameNode.value,
                value: variableValueNode
            };
        }
        return null;
    }
    const children = [];
    while (index < tokens.length) {
        const next = process();
        if (next)
            children.push(next);
    }
    return {
        type: types_2.ASTNodeType.Program,
        children
    };
}
