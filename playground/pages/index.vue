<script setup lang="ts">
const color = ref('#FF0000');
</script>

<template>
  <div class="index-page">
    {{ color }}
    <color-picker v-model="color" />
  </div>
</template>

<style lang="scss" scoped>
.index-page {
  display: flex;
  justify-content: flex-end;
}
</style>
