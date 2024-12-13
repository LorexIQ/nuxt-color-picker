<script setup lang="ts">
const test = ref('#FF0000');
</script>

<template>
  <div class="index-page">
    {{ test }}
    <color-picker
      v-slot="{ show, color }"
      v-model="test"
    >
      <button
        :style="`background-color: ${color.value}`"
        @click="show"
      >
        123
      </button>
    </color-picker>
  </div>
</template>

<style lang="scss" scoped>
.index-page {
  display: flex;
  justify-content: flex-end;
}
</style>
