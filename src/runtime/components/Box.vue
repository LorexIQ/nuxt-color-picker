<script lang="ts" setup>
import { computed } from '#imports';

type Props = {
  name: string;
  color: string;
};
type Emits = {
  (e: 'inputColor', v: string): void;
  (e: 'inputFocus', v: boolean): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const modelColor = computed({
  get: () => props.color || '',
  set: value => emit('inputColor', value)
});

function handleFocus(status: boolean) {
  emit('inputFocus', status);
}
</script>

<template>
  <div class="CP-box CP--box-border">
    <span class="CP-box__name">
      {{ name }}
    </span>
    <input
      :id="name"
      v-model="modelColor"
      type="text"
      class="CP-box__value"
      @focusin="handleFocus(true)"
      @focusout="handleFocus(false)"
    >
  </div>
</template>

<style lang="scss">
.CP-box {
  display: flex;
  font-size: 12px;

  &__name {
    display: flex;
    justify-content: center;
    align-items: center;
    float: left;
    width: 60px;
    height: 30px;
    color: var(--color-picker-input-title);
    background: var(--color-picker-input-title-bg);
    user-select: none;
  }
  &__value {
    flex: 1;
    min-width: 100px;
    height: 30px;
    padding: 0 12px;
    border: 0;
    color: var(--color-picker-input-text);
    background: var(--color-picker-input-text-bg);
    cursor: text;

    &:focus {
      outline: none;
    }
  }
}
</style>
