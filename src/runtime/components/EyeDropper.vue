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
  <div class="CP-eye-dropper">
    <Loader v-if="isDropperOpen" />
    <Pipette
      v-else
      class="CP-eye-dropper__pipette"
      @click="openDropper"
    />
  </div>
</template>

<style scoped lang="scss">
.CP-eye-dropper {
  width: 38px;
  border-radius: 2px;
  color: #9099a4;
  background: #eceef0;
  box-shadow:  0 0 1px 0.5px rgba(0, 0, 0, 0.2) inset;
  cursor: pointer;
  transition: .3s;
  overflow: hidden;
}
</style>
