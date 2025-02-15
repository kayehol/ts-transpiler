"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokeniser = tokeniser;
var TokenType;
(function (TokenType) {
    TokenType["VariableDeclaration"] = "VariableDeclaration";
    TokenType["AssignmentOperator"] = "AssignmentOperator";
    TokenType["Literal"] = "Literal";
    TokenType["String"] = "String";
    TokenType["LineBreak"] = "LineBreak";
    TokenType["Log"] = "Log";
})(TokenType || (TokenType = {}));
function tokeniser(input) {
    let currentPosition = 0;
    function lookaheadString(str) {
        const parts = str.split('');
        for (let i = 0; i < parts.length; i++) {
            if (input[currentPosition + i] !== parts[i]) {
                return false;
            }
        }
        return true;
    }
    function lookahead(match, matchNext) {
        const bucket = [];
        while (true) {
            const nextIndex = currentPosition + bucket.length;
            const nextToken = input[nextIndex];
            if (!nextToken) {
                break;
            }
            let m = match;
            if (matchNext && bucket.length) {
                m = matchNext;
            }
            if (m && !m.test(nextToken)) {
                break;
            }
            bucket.push(nextToken);
        }
        return bucket;
    }
    const out = [];
    while (currentPosition < input.length) {
        const currentToken = input[currentPosition];
        const literalRegex = /[a-zA-Z]/;
        const literalRegexNext = /[a-zA-Z0-9]/;
        if (currentToken === ' ') {
            currentPosition++;
            continue;
        }
        let didMatch = false;
        for (const { key, value } of tokenStringMap) {
            if (!lookaheadString(key)) {
                continue;
            }
            out.push(value);
            currentPosition += key.length;
            didMatch = true;
        }
        if (didMatch)
            continue;
        if (currentToken === "'") {
            currentPosition++;
            const bucket = lookahead(/[^']/);
            out.push({
                type: TokenType.String,
                value: bucket.join('')
            });
            currentPosition += bucket.length + 1;
            continue;
        }
        if (literalRegex.test(currentToken)) {
            const bucket = lookahead(literalRegex, literalRegexNext);
            out.push({
                type: TokenType.Literal,
                value: bucket.join('')
            });
            currentPosition += bucket.length;
            continue;
        }
        throw new Error(`Unknown input character: ${currentToken}`);
    }
    return out;
}
const tokenStringMap = [
    { key: '\n', value: { type: TokenType.LineBreak } },
    { key: 'new', value: { type: TokenType.VariableDeclaration } },
    { key: '=', value: { type: TokenType.AssignmentOperator } },
    { key: 'print', value: { type: TokenType.Log } },
];
console.log(tokeniser(`
new hello = 'world'
print hello
`));
