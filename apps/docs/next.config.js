import withMotionwind from "motionwind-react/next";
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {};

const withMDX = createMDX();

export default withMDX(withMotionwind(nextConfig));
