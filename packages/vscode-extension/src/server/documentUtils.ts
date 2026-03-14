import { TextDocument, Position, Range } from "vscode-languageserver-textdocument";

export interface ClassToken {
  value: string;
  range: Range;
}

export interface ClassNameRegion {
  value: string;
  range: Range;
  quoteChar: string;
}

/**
 * Find all className/class attribute value regions in a document.
 * Handles: className="...", className='...', className={`...`}, class="..."
 */
export function findClassNameRegions(
  document: TextDocument,
  classAttributes: string[] = ["className", "class"],
): ClassNameRegion[] {
  const text = document.getText();
  const regions: ClassNameRegion[] = [];

  for (const attr of classAttributes) {
    // Match attr="..." or attr='...'
    const doubleQuotePattern = new RegExp(`${attr}\\s*=\\s*"([^"]*)"`, "g");
    let match: RegExpExecArray | null;

    while ((match = doubleQuotePattern.exec(text)) !== null) {
      const valueStart = match.index + match[0].indexOf('"') + 1;
      const value = match[1]!;
      regions.push({
        value,
        range: {
          start: document.positionAt(valueStart),
          end: document.positionAt(valueStart + value.length),
        },
        quoteChar: '"',
      });
    }

    const singleQuotePattern = new RegExp(`${attr}\\s*=\\s*'([^']*)'`, "g");
    while ((match = singleQuotePattern.exec(text)) !== null) {
      const valueStart = match.index + match[0].indexOf("'") + 1;
      const value = match[1]!;
      regions.push({
        value,
        range: {
          start: document.positionAt(valueStart),
          end: document.positionAt(valueStart + value.length),
        },
        quoteChar: "'",
      });
    }

    // Match attr={`...`} (template literal)
    const templatePattern = new RegExp(`${attr}\\s*=\\s*\\{\\s*\`([^\`]*)\``, "g");
    while ((match = templatePattern.exec(text)) !== null) {
      const valueStart = match.index + match[0].indexOf("`") + 1;
      const value = match[1]!;
      regions.push({
        value,
        range: {
          start: document.positionAt(valueStart),
          end: document.positionAt(valueStart + value.length),
        },
        quoteChar: "`",
      });
    }
  }

  return regions;
}

/**
 * Tokenize a className value string into individual class tokens with ranges.
 * The regionStart is the document position where the value string begins.
 */
export function tokenizeClassValue(
  document: TextDocument,
  value: string,
  regionStart: Position,
): ClassToken[] {
  const tokens: ClassToken[] = [];
  const regionOffset = document.offsetAt(regionStart);

  let i = 0;
  while (i < value.length) {
    // Skip whitespace
    while (i < value.length && /\s/.test(value[i]!)) i++;
    if (i >= value.length) break;

    const start = i;
    while (i < value.length && !/\s/.test(value[i]!)) i++;

    const tokenValue = value.slice(start, i);
    tokens.push({
      value: tokenValue,
      range: {
        start: document.positionAt(regionOffset + start),
        end: document.positionAt(regionOffset + i),
      },
    });
  }

  return tokens;
}

/**
 * Find the class token at the given cursor position.
 */
export function getTokenAtPosition(
  document: TextDocument,
  position: Position,
  classAttributes?: string[],
): ClassToken | null {
  const regions = findClassNameRegions(document, classAttributes);
  const offset = document.offsetAt(position);

  for (const region of regions) {
    const regionStartOffset = document.offsetAt(region.range.start);
    const regionEndOffset = document.offsetAt(region.range.end);

    if (offset < regionStartOffset || offset > regionEndOffset) continue;

    const tokens = tokenizeClassValue(document, region.value, region.range.start);
    for (const token of tokens) {
      const tokenStart = document.offsetAt(token.range.start);
      const tokenEnd = document.offsetAt(token.range.end);
      if (offset >= tokenStart && offset <= tokenEnd) {
        return token;
      }
    }
  }

  return null;
}

/**
 * Check if the cursor is inside a className region and get the current typing prefix.
 * Returns the partial text being typed and the region context.
 */
export function getCursorContext(
  document: TextDocument,
  position: Position,
  classAttributes?: string[],
): { prefix: string; region: ClassNameRegion; inRegion: true } | { inRegion: false } {
  const regions = findClassNameRegions(document, classAttributes);
  const offset = document.offsetAt(position);

  for (const region of regions) {
    const regionStartOffset = document.offsetAt(region.range.start);
    const regionEndOffset = document.offsetAt(region.range.end);

    if (offset < regionStartOffset || offset > regionEndOffset) continue;

    // Get text from region start to cursor
    const textBeforeCursor = document.getText({
      start: region.range.start,
      end: position,
    });

    // Find the start of the current token (last whitespace boundary)
    const lastSpace = textBeforeCursor.lastIndexOf(" ");
    const prefix = lastSpace === -1 ? textBeforeCursor : textBeforeCursor.slice(lastSpace + 1);

    return { prefix, region, inRegion: true };
  }

  return { inRegion: false };
}
