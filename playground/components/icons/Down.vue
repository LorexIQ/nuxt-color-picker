<script lang="ts" setup>
type Props = {
  strokeWidth?: number;
};

withDefaults(defineProps<Props>(), {
  strokeWidth: 4
});
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 48 48"
  >
    <path
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      :stroke-width="strokeWidth"
      d="M36 18L24 30L12 18"
    />
  </svg>
</template>
