import { tokenise } from "./lexer/lexer";
import { toAST } from "./parser/parser";

const DSL = `
new hello = 'world'
print hello
`;

const tokens = tokenise(DSL);

console.log({ tokens });

const AST = toAST(tokens);

console.log({ AST });
