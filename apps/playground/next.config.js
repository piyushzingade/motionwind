import withMotionwind from "motionwind-react/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default withMotionwind(nextConfig);
