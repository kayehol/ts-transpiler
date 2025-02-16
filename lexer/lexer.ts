import { Token, TokenType } from "./types";

const tokenStringMap: Array<{
  key: string,
  value: Token
}> = [
    { key: '\n', value: { type: TokenType.LineBreak } },
    { key: 'new', value: { type: TokenType.VariableDeclaration } },
    { key: '=', value: { type: TokenType.AssignmentOperator } },
    { key: 'print', value: { type: TokenType.Log } },
  ];

export function tokenise(input: string): Token[] {
  let currentPosition = 0;

  function lookaheadString(str: string): boolean {
    const parts = str.split('');

    for (let i = 0; i < parts.length; i++) {
      if (input[currentPosition + i] !== parts[i])
        return false;
    }
    return true;
  }

  function lookahead(match: RegExp, matchNext?: RegExp): string[] {
    const bucket: string[] = [];

    while (true) {
      const nextIndex = currentPosition + bucket.length;
      const nextToken = input[nextIndex];

      if (!nextToken)
        break;

      let m: string | RegExp = match

      if (matchNext && bucket.length)
        m = matchNext;

      if (m && !m.test(nextToken))
        break;

      bucket.push(nextToken);
    }

    return bucket;
  }

  const out: Token[] = [];

  while (currentPosition < input.length) {
    const currentToken = input[currentPosition];
    const literalRegex = /[a-zA-Z]/
    const literalRegexNext = /[a-zA-Z0-9]/

    if (currentToken === ' ') {
      currentPosition++;
      continue;
    }

    let didMatch: boolean = false;

    for (const { key, value } of tokenStringMap) {
      if (!lookaheadString(key))
        continue;

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

      currentPosition += bucket.length

      continue;
    }

    throw new Error(`Unknown input character: ${currentToken}`);
  }

  return out;
}
