<script setup lang="ts">
import Pipette from '../icons/Pipette.vue';
import Loader from '../icons/Loader.vue';
import { ref } from '#imports';

type Emits = {
  (e: 'select', v: string): void;
};

const emit = defineEmits<Emits>();

const isDropperOpen = ref(false);
const eyeDropper = new window.EyeDropper!();

async function openDropper() {
  try {
    isDropperOpen.value = true;
    const color = await eyeDropper.open();
    emit('select', color.sRGBHex.toUpperCase());
  } catch { /* empty */ }

  isDropperOpen.value = false;
}
</script>

<template>
  <div class="CP-eye-dropper CP--box-border">
    <Loader v-if="isDropperOpen" />
    <Pipette
      v-else
      class="CP-eye-dropper__pipette"
      @click="openDropper"
    />
  </div>
</template>

<style scoped>
.CP-eye-dropper {
  width: 38px;
  color: var(--colorPickerDropper);
  background: var(--colorPickerDropperBg);
  cursor: pointer;
}
</style>
