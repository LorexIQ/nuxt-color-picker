<script lang="ts" setup>
import { onUnmounted } from 'vue';
import { any2hex, createAlphaSquare } from '../composables/helpers';
import { computed, onMounted, reactive } from '#imports';

type Props = {
  oldColor: string;
  color: string;
  colorsDefault: string[];
  storageKey: string;
  withAlpha: boolean;
};
type Emits = {
  (e: 'select', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const storageKey = computed(() => `nuxt-color-picker:${props.storageKey}`);
const countOfColors = computed(() => props.colorsDefault.length);
const colorsHistory = reactive([...props.colorsDefault]);
const imgAlphaBase64 = `url(${createAlphaSquare(4).toDataURL()})`;

function readStorage() {
  const storageData = localStorage.getItem(storageKey.value);

  try {
    if (storageData) {
      const preparedStorageData = JSON.parse(storageData).map((color: string) => any2hex(color, props.withAlpha));

      const uniqueColors: string[] = [];
      for (const color of [...(preparedStorageData || []), ...colorsHistory]) {
        if (uniqueColors.length >= countOfColors.value) continue;
        if (!uniqueColors.includes(color)) uniqueColors.push(color);
      }

      colorsHistory.splice(0);
      colorsHistory.push(...uniqueColors);
    }
  } catch (e) {
    console.error(e);
  }
}
function saveStorage() {
  const color = props.color;
  const oldColor = props.oldColor;

  if (!color || color === oldColor) return;

  const colors = colorsHistory;
  const index = colors.indexOf(color);

  if (index !== -1) colors.splice(index, 1);

  colors.splice(countOfColors.value);
  colors.unshift(color);

  localStorage.setItem(storageKey.value, JSON.stringify(colors));
}
function select(color: string) {
  emit('select', color);
}

onMounted(() => {
  readStorage();
});
onUnmounted(() => {
  saveStorage();
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
    display: flex;
    justify-content: space-between;
    width: 100%;
    gap: 8px;

    &__item {
      position: relative;
      width: 100%;
      height: 16px;
      border-radius: 0;
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
