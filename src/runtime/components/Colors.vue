<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { createAlphaSquare } from '../composables/helpers';
import { onMounted, reactive } from '#imports';

type Props = {
  color: string;
  colorsDefault: string[];
};
type Emits = {
  (e: 'select', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const maxStorageColors = 9;
const storageKey = 'nuxt-color-picker:history';
const colorsHistory = reactive([...props.colorsDefault]);
const imgAlphaBase64 = `url(${createAlphaSquare(4).toDataURL()})`;

function readStorage() {
  const storageData = localStorage.getItem(storageKey);

  if (storageData) colorsHistory.unshift(...(JSON.parse(storageData) || []));

  colorsHistory.splice(maxStorageColors);
}
function saveStorage() {
  const color = props.color;

  if (!color) return;

  const colors = colorsHistory;
  const index = colors.indexOf(color);

  if (index !== -1) colors.splice(index, 1);

  colors.splice(maxStorageColors);
  colors.unshift(color);

  localStorage.setItem(storageKey, JSON.stringify(colors));
}
function select(color: string) {
  emit('select', color);
}

onMounted(() => {
  readStorage();
});
onUnmounted(() => {
  // saveStorage();
});
</script>

<template>
  <div class="CP-colors">
    <div
      class="CP-colors__items"
      :style="{ '--alpha': imgAlphaBase64 }"
    >
      <div
        v-for="item in colorsHistory"
        :key="item"
        class="CP-colors__items__item CP--box-border"
        :style="{ '--color': item }"
        @click="select(item)"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.CP-colors {
  width: 100%;
  overflow: hidden;

  &__items {
    display: grid;
    grid-template-columns: repeat(auto-fit, 16px);
    justify-content: space-between;

    &__item {
      position: relative;
      width: 16px;
      height: 16px;
      transition: .3s;
      cursor: pointer;

      &::before, &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      &::before {
        background: var(--alpha);
      }
      &::after {
        background: var(--color);
      }
    }
  }
}
</style>
