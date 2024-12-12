<script lang="ts" setup>
import { createAlphaSquare } from '../composables/helpers';
import { computed, onMounted, ref, watch } from '#imports';

type Props = {
  color: string;
  oldColor: string;
};

const props = defineProps<Props>();

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

  ctx.fillStyle = props.color;
  ctx.fillRect(0, 0, width.value / 2, height.value);

  ctx.fillStyle = props.oldColor;
  ctx.fillRect(width.value / 2, 0, width.value / 2, height.value);
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
  </div>
</template>
