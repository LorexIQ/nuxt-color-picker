<script setup lang="ts">
import type { Ref } from 'vue';
import useSandbox from '../composables/useSandbox';
import type { ModuleColorMultiType } from '../types';
import { ref, watch } from '#imports';

type Props = {
  modelValue?: string;
  storageKey?: string;
  withAlpha?: boolean;
  withInitialColor?: boolean;
  withEyeDropper?: boolean;
  withHexInput?: boolean;
  withRgbInput?: boolean;
  withColorsHistory?: boolean | number;
  immediateEmit?: boolean;
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: ModuleColorMultiType): void;
  (e: 'close'): void;
};
type Slot = {
  color: Ref<string | undefined>;
  hide: () => void;
  show: (event: MouseEvent) => void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const sandbox = useSandbox();

const innerValue = ref(props.modelValue);

const sharedVariables: Slot = {
  color: innerValue,
  hide,
  show
};

watch(() => props.modelValue, value => innerValue.value = value);

function show(event: MouseEvent) {
  sandbox.value.openComponent(
    {
      x: event.pageX,
      y: event.pageY
    },
    props,
    {
      'update:modelValue': (event) => {
        emit('update:modelValue', event);
      },
      'change': (event) => {
        emit('change', event);
      },
      'close': () => emit('close')
    }
  );
}
function hide() {
  sandbox.value.closeComponent();
}

defineExpose(sharedVariables);
</script>

<template>
  <div class="CP">
    <slot v-bind="sharedVariables" />
  </div>
</template>
