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

watch(innerValue, newValue => newValue && emit('update:modelValue', newValue));

function show(event: MouseEvent) {
  sandbox.value.openComponent(
    {
      x: event.pageX,
      y: event.pageY
    },
    innerValue
  );
}
function hide() {
  sandbox.value.closeComponent();
}
</script>

<template>
  <div class="CP">
    <slot
      :hide="hide"
      :show="show"
    />
    <button @click="show">
      123
    </button>
  </div>
</template>

<style scoped lang="scss">

</style>
