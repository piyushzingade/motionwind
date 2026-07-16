<template>
  <main style="min-height: 1800px; padding: 32px">
    <Motionwind
      as="button"
      data-testid="motionwind-e2e"
      class="animate-hover:scale-105 animate-tap:scale-95 animate-focus:scale-102 animate-duration-80"
    >
      Motionwind + Nuxt
    </Motionwind>

    <Motionwind
      as="div"
      data-testid="motionwind-variant"
      class="animate-variant-hidden:opacity-0 animate-variant-visible:opacity-100 animate-from-hidden animate-to-visible animate-duration-80"
    >
      Variant
    </Motionwind>

    <button data-testid="motionwind-layout-toggle" @click="shifted = !shifted">
      Toggle layout
    </button>
    <Motionwind
      as="div"
      data-testid="motionwind-layout"
      class="animate-layout-position animate-duration-400"
      :style="{
        marginLeft: shifted ? '120px' : '0',
        width: '24px',
        height: '24px',
        background: 'black',
      }"
    />

    <Motionwind
      as="div"
      data-testid="motionwind-drag"
      class="animate-drag-x animate-drag-momentum-false animate-drag:scale-105"
      style="width: 40px; height: 40px; background: royalblue"
    />

    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      aria-label="Motionwind SVG fixture"
    >
      <Motionwind
        as="path"
        data-testid="motionwind-svg"
        d="M4 20 L36 20"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        class="animate-initial:path-length-0 animate-enter:path-length-1 animate-duration-80"
      />
    </svg>

    <div style="height: 1100px" />
    <Motionwind
      as="div"
      data-testid="motionwind-inview"
      class="animate-initial:opacity-0 animate-inview:opacity-100 animate-once animate-amount-50 animate-duration-80"
    >
      In view
    </Motionwind>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

const shifted = ref(false);
</script>
