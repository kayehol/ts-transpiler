interface ASTValueNode<T extends ASTNodeType, V> {
  type: T,
  value: V
}

interface ASTProgramNode {
  type: ASTNodeType.Program,
  children: ASTNode[]
}

interface ASTAssignmentNode {
  type: ASTNodeType.Assignment,
  name: string,
  value: ASTNode
}

interface ASTLogNode {
  type: ASTNodeType.Log,
  children: ASTNode[]
}

export enum ASTNodeType {
  Program = 'Program',
  Literal = 'Literal',
  String = 'String',
  Assignment = 'Assignment',
  Log = 'Log'
}

export type ASTNode =
  ASTValueNode<ASTNodeType.String, string> |
  ASTValueNode<ASTNodeType.Literal, string> |
  ASTProgramNode |
  ASTAssignmentNode |
  ASTLogNode

