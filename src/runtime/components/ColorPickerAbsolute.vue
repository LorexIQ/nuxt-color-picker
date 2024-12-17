<script setup lang="ts">
import type { ModuleColorMultiType, ModuleSandboxSize, ModuleStylesXY } from '../types';
import ColorPickerBlock from './ColorPickerBlock.vue';
import { computed, onMounted, ref } from '#imports';

type Props = {
  sandboxSize: ModuleSandboxSize;
  position: ModuleStylesXY;
  modelValue?: string;
  storageKey?: string;
  withAlpha?: boolean;
  withColorsHistory?: boolean | number;
  withInitialColor?: boolean;
  withEyeDropper?: boolean;
  immediateEmit?: boolean;
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: ModuleColorMultiType): void;
  (e: 'close'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const sandboxSize = props.sandboxSize;

let clickBridgeTime = 0;
const componentRef = ref();
const componentBoundingRect = ref<DOMRect>();
const componentPosition = computed(() => {
  const componentRect = componentBoundingRect.value;
  const left = componentRect && componentRect.right > sandboxSize.width ? sandboxSize.width - componentRect.width : props.position.x;
  const top = componentRect && componentRect.bottom > sandboxSize.height ? sandboxSize.height - componentRect.height : props.position.y;

  return {
    left: left + 'px',
    top: top + 'px'
  };
});

function regClickBridgeTime() {
  clickBridgeTime = Date.now();
}
function verifyClickBridge() {
  if (Date.now() - clickBridgeTime < 500) {
    emit('close');
  }
}

onMounted(() => {
  if (componentRef.value) {
    componentBoundingRect.value = componentRef.value.containerRef.getBoundingClientRect();
  }
});
</script>

<template>
  <div
    class="CP-absolute"
    @mousedown.self="regClickBridgeTime"
    @mouseup.self="verifyClickBridge"
  >
    <color-picker-block
      ref="componentRef"
      class="CP-absolute__component"
      :style="componentPosition"
      v-bind="props"
      @update:model-value="emit('update:modelValue', $event)"
      @change="emit('change', $event)"
    />
  </div>
</template>

<style scoped lang="scss">
.CP-absolute {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  user-select: none;

  &__component {
    position: absolute;
  }
}
</style>
