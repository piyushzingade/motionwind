import withMotionwind from "motionwind-react/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default withMotionwind(nextConfig);
