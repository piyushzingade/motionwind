"use client";

/**
 * Explicit client component references for motionwind runtime components.
 * These override plain HTML elements in MDX so that animate-* classes
 * get parsed into Motion props at runtime.
 */
import { mw } from "motionwind";

export const MWDiv = mw.div;
export const MWButton = mw.button;
export const MWSpan = mw.span;
export const MWInput = mw.input;
