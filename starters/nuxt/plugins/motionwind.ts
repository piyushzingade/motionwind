import { MotionwindPlugin } from "motionwind-vue";
import motionwindConfig from "../motionwind.config";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MotionwindPlugin, motionwindConfig);
});
