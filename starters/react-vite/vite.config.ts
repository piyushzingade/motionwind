import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { motionwind } from "motionwind-react/vite";
import config from "./motionwind.config";

export default defineConfig({ plugins: [motionwind(config), react()] });
