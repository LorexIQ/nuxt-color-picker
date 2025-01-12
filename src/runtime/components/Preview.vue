<script lang="ts" setup>
import { createAlphaSquare } from '../composables/helpers';
import { computed, onMounted, ref, watch } from '#imports';

type Props = {
  color: string;
  oldColor?: string;
};
type Emits = {
  (e: 'select', v: string): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const containerRef = ref<HTMLHtmlElement>();
const containerCanvasRef = ref<HTMLCanvasElement>();
const width = computed(() => containerRef.value?.clientWidth ?? 0);
const height = computed(() => containerRef.value?.clientHeight ?? 0);

watch(() => props.color, () => renderColor());

function renderColor() {
  const canvas = containerCanvasRef.value!;
  const canvasSquare = createAlphaSquare(5);

  const ctx = canvas.getContext('2d')!;
  canvas.width = width.value;
  canvas.height = height.value;

  ctx.fillStyle = ctx.createPattern(canvasSquare, 'repeat')!;
  ctx.fillRect(0, 0, width.value, height.value);

  if (props.oldColor) {
    ctx.fillStyle = props.color;
    ctx.fillRect(0, 0, Math.floor(width.value / 2), height.value);
    ctx.fillStyle = props.oldColor;
    ctx.fillRect(Math.floor(width.value / 2), 0, Math.ceil(width.value / 2), height.value);
  } else {
    ctx.fillStyle = props.color;
    ctx.fillRect(0, 0, width.value, height.value);
  }
}

onMounted(() => {
  renderColor();
});
</script>

<template>
  <div
    ref="containerRef"
    class="CP-preview CP--box-border"
  >
    <canvas ref="containerCanvasRef" />
    <div
      v-if="oldColor"
      class="CP-preview__old"
      @click="emit('select', oldColor)"
    />
  </div>
</template>

<style scoped>
.CP-preview {
  position: relative;
}

.CP-preview__old {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 50%;
  cursor: pointer;
}
</style>
