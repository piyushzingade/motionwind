import { tokenList } from "./token-list";
import fs from "fs";
import path from "path";

export function buildCSS(): string {
    return tokenList
        .map((t) => {
            if (t.css) return `.${t.className} { ${t.css}; }`;
            if (t.property && t.value !== undefined) {
                const unit = t.unit ?? "";
                return `.${t.className} { ${t.property}: ${t.value}${unit}; }`;
            }
            return "";
        })
        .filter(Boolean)
        .join("\n");
}

// write helper to persist into tailwind-css package
export function writeCSSToPackage(outDir = "../motionwind-tailwind-css/css") {
    const css = buildCSS();
    const fullPath = path.join(process.cwd(), outDir, "motionwind.css");
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, css, "utf-8");
    return fullPath;
}
