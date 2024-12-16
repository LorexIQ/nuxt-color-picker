<script setup lang="ts">
import useSandbox from '../composables/useSandbox';
import { ref, watch } from '#imports';
import type { ModuleColorMultiType } from '~/src/runtime/types';

type Props = {
  modelValue?: string;
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: ModuleColorMultiType): void;
  (e: 'close'): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const sandbox = useSandbox();

const innerValue = ref(props.modelValue);

const sharedVariables = {
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
    {
      modelValue: props.modelValue
    },
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
