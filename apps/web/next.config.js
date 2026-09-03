import withMotionwind from "motionwind-react/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
};

export default withMotionwind(nextConfig);
