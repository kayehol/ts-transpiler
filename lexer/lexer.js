"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenise = tokenise;
const types_1 = require("./types");
const tokenStringMap = [
    { key: '\n', value: { type: types_1.TokenType.LineBreak } },
    { key: 'new', value: { type: types_1.TokenType.VariableDeclaration } },
    { key: '=', value: { type: types_1.TokenType.AssignmentOperator } },
    { key: 'print', value: { type: types_1.TokenType.Log } },
];
function tokenise(input) {
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
                type: types_1.TokenType.String,
                value: bucket.join('')
            });
            currentPosition += bucket.length + 1;
            continue;
        }
        if (literalRegex.test(currentToken)) {
            const bucket = lookahead(literalRegex, literalRegexNext);
            out.push({
                type: types_1.TokenType.Literal,
                value: bucket.join('')
            });
            currentPosition += bucket.length;
            continue;
        }
        throw new Error(`Unknown input character: ${currentToken}`);
    }
    return out;
}
