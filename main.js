"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = require("./lexer/lexer");
const parser_1 = require("./parser/parser");
const DSL = `
new hello = 'world'
print hello
`;
const tokens = (0, lexer_1.tokenise)(DSL);
console.log({ tokens });
const AST = (0, parser_1.toAST)(tokens);
console.log({ AST });
