import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { motionwindTransform } from "motionwind-vue/vite";

export default defineConfig({
  plugins: [
    vue({
      template: { compilerOptions: { nodeTransforms: [motionwindTransform] } },
    }),
  ],
});
