<script lang="ts" setup>
import { rgb2rgbHue } from '../composables/helpers';
import type { ModuleRGBH, ModuleStylesY } from '../types';
import CanvasPicker from './CanvasPicker.vue';
import { ref, watch } from '#imports';

type Props = {
  rgbh: ModuleRGBH;
};
type Emits = {
  (e: 'select', v: ModuleRGBH): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const pickerRef = ref();

watch(props.rgbh, () => {
  const _pickerRef = pickerRef.value;
  if (!_pickerRef.isDrag) _pickerRef.renderSlider();
});

function bgGenerator(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0.01, '#FF0000');
  gradient.addColorStop(0.17, '#FF00FF');
  gradient.addColorStop(0.17 * 2, '#0000FF');
  gradient.addColorStop(0.17 * 3, '#00FFFF');
  gradient.addColorStop(0.17 * 4, '#00FF00');
  gradient.addColorStop(0.17 * 5, '#FFFF00');
  gradient.addColorStop(0.99, '#FF0000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}
function selectGenerator(ctx: CanvasRenderingContext2D, width: number, height: number, { y }: ModuleStylesY) {
  const imgData = ctx.getImageData(0, Math.min(y, height - 1), 1, 1);
  const [r, g, b] = imgData.data as unknown as [number, number, number];
  return rgb2rgbHue({ r, g, b });
}
function sliderXYGenerator(width: number, height: number): ModuleStylesY {
  return {
    y: (1 - props.rgbh.h / 360) * height - 2
  };
}
</script>

<template>
  <CanvasPicker
    ref="pickerRef"
    mode="y"
    :bg-generator="bgGenerator"
    :select-generator="selectGenerator"
    :slider-x-y-generator="sliderXYGenerator"
    :prevent-select="false"
    @select="emit('select', $event)"
  />
</template>
