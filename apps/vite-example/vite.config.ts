import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "motionwind-core": path.resolve(__dirname, "../../packages/motionwind-core/src"),
            "motionwind-tailwind-css": path.resolve(__dirname, "../../packages/motionwind-tailwind-css")
        }
    }
});
