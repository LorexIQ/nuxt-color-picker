<script setup lang="ts">
import useSandbox from '../composables/useSandbox';
import { ref, watch } from '#imports';

type Props = {
  modelValue?: string;
};
type Emits = {
  (e: 'update:modelValue', value: string): void;
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

watch(innerValue, newValue => newValue && emit('update:modelValue', newValue));

function show(event: MouseEvent) {
  sandbox.value.openComponent(
    {
      x: event.pageX,
      y: event.pageY
    },
    {
      modelValue: innerValue.value
    },
    {
      'update:modelValue': event => innerValue.value = event
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

<style scoped lang="scss">

</style>
