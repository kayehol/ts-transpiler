interface TokenNode<T extends TokenType> {
  type: T
}

interface TokenValueNode<T extends TokenType> extends TokenNode<T> {
  value: string
}

export enum TokenType {
  VariableDeclaration = 'VariableDeclaration',
  AssignmentOperator = 'AssignmentOperator',
  Literal = 'Literal',
  String = 'String',
  LineBreak = 'LineBreak',
  Log = 'Log'
}


export type Token =
  TokenNode<TokenType.AssignmentOperator> |
  TokenNode<TokenType.VariableDeclaration> |
  TokenNode<TokenType.LineBreak> |
  TokenNode<TokenType.Log> |
  TokenValueNode<TokenType.Literal> |
  TokenValueNode<TokenType.String>
