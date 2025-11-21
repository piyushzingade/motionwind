#!/usr/bin/env bun
import { writeCSSToPackage } from "../css/utilities";

try {
    const out = writeCSSToPackage();
    console.log(" Wrote CSS to:", out);
} catch (err) {
    console.error(" Failed to generate CSS:", err);
    process.exit(1);
}
