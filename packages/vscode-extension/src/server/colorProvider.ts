import {
  Color,
  ColorInformation,
  ColorPresentation,
  ColorPresentationParams,
  DocumentColorParams,
} from "vscode-languageserver/node.js";
import { TextDocument } from "vscode-languageserver-textdocument";
import {
  findClassNameRegions,
  tokenizeClassValue,
} from "./documentUtils.js";

/** Parse a hex color string to RGBA Color (0-1 range) */
function hexToColor(hex: string): Color | null {
  // Remove # prefix
  const h = hex.startsWith("#") ? hex.slice(1) : hex;

  let r: number, g: number, b: number, a = 1;

  if (h.length === 3) {
    r = parseInt(h[0]! + h[0], 16) / 255;
    g = parseInt(h[1]! + h[1], 16) / 255;
    b = parseInt(h[2]! + h[2], 16) / 255;
  } else if (h.length === 6) {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
  } else if (h.length === 8) {
    r = parseInt(h.slice(0, 2), 16) / 255;
    g = parseInt(h.slice(2, 4), 16) / 255;
    b = parseInt(h.slice(4, 6), 16) / 255;
    a = parseInt(h.slice(6, 8), 16) / 255;
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b) || isNaN(a)) return null;

  return { red: r, green: g, blue: b, alpha: a };
}

/** Convert Color (0-1 range) back to hex string */
function colorToHex(color: Color): string {
  const r = Math.round(color.red * 255).toString(16).padStart(2, "0");
  const g = Math.round(color.green * 255).toString(16).padStart(2, "0");
  const b = Math.round(color.blue * 255).toString(16).padStart(2, "0");

  if (color.alpha < 1) {
    const a = Math.round(color.alpha * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}${a}`;
  }

  return `#${r}${g}${b}`;
}

/** Color property prefixes to scan */
const COLOR_PREFIXES = ["bg-#", "text-#", "border-#"];

/** Map prefix to the class prefix used in reconstruction */
const PREFIX_MAP: Record<string, string> = {
  "bg-#": "bg-",
  "text-#": "text-",
  "border-#": "border-",
};

/**
 * Extract color information from motionwind color classes.
 */
export function handleDocumentColors(
  params: DocumentColorParams,
  document: TextDocument,
  classAttributes: string[],
): ColorInformation[] {
  const colors: ColorInformation[] = [];
  const regions = findClassNameRegions(document, classAttributes);

  for (const region of regions) {
    const tokens = tokenizeClassValue(document, region.value, region.range.start);

    for (const token of tokens) {
      if (!token.value.startsWith("animate-")) continue;

      const rest = token.value.slice(8);
      const colonIdx = rest.indexOf(":");
      if (colonIdx === -1) continue;

      const propValue = rest.slice(colonIdx + 1);

      for (const prefix of COLOR_PREFIXES) {
        if (propValue.startsWith(prefix)) {
          const hexStr = propValue.slice(prefix.length - 1); // Keep the #
          const color = hexToColor(hexStr);
          if (color) {
            colors.push({ range: token.range, color });
          }
        }
      }
    }
  }

  return colors;
}

/**
 * Handle color presentation requests (when user picks a color from the picker).
 */
export function handleColorPresentation(
  params: ColorPresentationParams,
  document: TextDocument,
): ColorPresentation[] {
  const hex = colorToHex(params.color);
  const currentText = document.getText(params.range);

  // Reconstruct the full class with the new color
  if (currentText.startsWith("animate-")) {
    const rest = currentText.slice(8);
    const colonIdx = rest.indexOf(":");
    if (colonIdx !== -1) {
      const gesturePrefix = rest.slice(0, colonIdx);
      const propValue = rest.slice(colonIdx + 1);

      for (const [colorPrefix, classPrefix] of Object.entries(PREFIX_MAP)) {
        if (propValue.startsWith(colorPrefix)) {
          const newClass = `animate-${gesturePrefix}:${classPrefix}${hex}`;
          return [{ label: hex, textEdit: { range: params.range, newText: newClass } }];
        }
      }
    }
  }

  return [{ label: hex }];
}
