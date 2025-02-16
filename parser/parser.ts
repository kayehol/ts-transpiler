import { Token, TokenType } from "../lexer/types";
import { ASTNode, ASTNodeType } from "./types";

export function toAST(tokens: Token[]): ASTNode {
  let index = 0;

  function process(): ASTNode | null {
    const currentToken = tokens[index];

    if (currentToken.type === TokenType.LineBreak) {
      index++;
      return null;
    }

    if (currentToken.type === TokenType.Literal) {
      index++;

      return {
        type: ASTNodeType.Literal,
        value: currentToken.value
      }
    }

    if (currentToken.type === TokenType.String) {
      index++;

      return {
        type: ASTNodeType.String,
        value: currentToken.value
      }
    }

    if (currentToken.type === TokenType.Log) {
      let nextNode = tokens[index++];
      const children: ASTNode[] = [];

      while (nextNode.type !== TokenType.LineBreak) {
        const next = process();

        if (next)
          children.push(next);

        nextNode = tokens[index];
      }


      return {
        type: ASTNodeType.Log,
        children
      }
    }

    if (currentToken.type === TokenType.VariableDeclaration) {
      index++;

      const variableNameNode = process();
      if (!variableNameNode || variableNameNode.type !== ASTNodeType.Literal)
        throw new Error('Invalid variable node');

      const assignmentNode = tokens[index++];
      if (assignmentNode.type !== TokenType.AssignmentOperator)
        throw new Error('Must use = operator to assign value');

      const variableValueNode = process();
      if (!variableValueNode || !('value' in variableValueNode))
        throw new Error('Invalid variable value');

      return {
        type: ASTNodeType.Assignment,
        name: variableNameNode.value,
        value: variableValueNode
      }
    }

    return null;
  }
  const children: ASTNode[] = [];

  while (index < tokens.length) {
    const next = process();

    if (next)
      children.push(next);
  }

  return {
    type: ASTNodeType.Program,
    children
  }
}
