# motionwind-vue v2

Use the shared Motionwind utility language in Vue 3 and Nuxt through Motion for
Vue.

```bash
npm install motionwind-vue@2 motion-v @vueuse/core motionwind-core@2
```

For Vue/Vite, configure the static template transform and install the runtime
plugin with the same project config:

```ts
import vue from "@vitejs/plugin-vue";
import { createMotionwindTransform } from "motionwind-vue/vite";

vue({
  template: {
    compilerOptions: {
      nodeTransforms: [createMotionwindTransform(config)],
    },
  },
});
```

```ts
import { MotionwindPlugin } from "motionwind-vue";

createApp(App).use(MotionwindPlugin, config).mount("#app");
```

Static native elements can use plain classes. Dynamic classes and the tested
Nuxt integration use the runtime component:

```vue
<Motionwind
  as="button"
  class="animate-hover:scale-110 animate-tap:scale-90 animate-spring"
>
  Save
</Motionwind>
```

Exports include `Motionwind`, `mw`, `useMotionwind`, `MotionwindPlugin`, adapter
capabilities, and the shared parser/config helpers. Continuous
`animate-scroll:*` is not implemented in the Vue adapter and reports a warning;
use Motion for Vue's scroll composables directly.

Compatibility: https://motionwind.xyz/docs/compatibility

MIT
