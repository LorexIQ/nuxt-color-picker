<script lang="ts" setup generic="T">
import { isUndefined } from '../composables/helpers';
import type { ModuleStylesXY, ModuleStylesPos } from '../types';
import { computed, onMounted, reactive, ref } from '#imports';

type Props = {
  mode: 'xy' | 'x' | 'y';
  bgGenerator: (ctx: CanvasRenderingContext2D, width: number, height: number) => any;
  selectGenerator: (ctx: CanvasRenderingContext2D, width: number, height: number, sliderPos: ModuleStylesXY) => T;
  sliderXYGenerator: (width: number, height: number) => Partial<ModuleStylesXY>;
  preventSelect: boolean;
  sliderBg?: string;
};
type Emits = {
  (e: 'select', v: T): void;
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const isX = ['xy', 'x'].includes(props.mode);
const isY = ['xy', 'y'].includes(props.mode);

const isDrag = ref(false);
const containerRef = ref<HTMLDivElement>();
const containerCanvasRef = ref<HTMLCanvasElement>();
const canvasCtx = ref<CanvasRenderingContext2D>();
const sliderPosition = reactive<ModuleStylesXY>({ x: 0, y: 0 });
const sliderStyles = computed<ModuleStylesPos>(() => ({ left: `${sliderPosition.x}px`, top: `${sliderPosition.y}px` }));
const width = computed(() => containerRef.value?.clientWidth ?? 0);
const height = computed(() => containerRef.value?.clientHeight ?? 0);

function renderBg() {
  const canvas = containerCanvasRef.value!;
  const ctx = getCanvasCtx();
  canvas.width = width.value;
  canvas.height = height.value;

  props.bgGenerator(ctx, width.value, height.value);
}
function renderSlider() {
  const buildPosition = props.sliderXYGenerator(width.value, height.value);
  if (!isUndefined(buildPosition.x)) sliderPosition.x = buildPosition.x;
  if (!isUndefined(buildPosition.y)) sliderPosition.y = buildPosition.y;
}
function select(event: MouseEvent) {
  const { top, left } = containerRef.value!.getBoundingClientRect();

  const mousemove = (event: MouseEvent) => {
    isDrag.value = true;
    let x = event.clientX - left;
    let y = event.clientY - top;
    const halfSlider = isX && isY ? 5 : 2;

    if (isX) {
      if (x < 0) x = 0;
      else if (x > width.value) x = width.value;
      sliderPosition.x = x - halfSlider;
    }

    if (isY) {
      if (y < 0) y = 0;
      else if (y > height.value) y = height.value;
      sliderPosition.y = y - halfSlider;
    }

    blur();
    commitSelect();
  };
  const mouseup = () => {
    isDrag.value = false;

    document.removeEventListener('mousemove', mousemove);
    document.removeEventListener('mouseup', mouseup);
  };

  mousemove(event);

  document.addEventListener('mousemove', mousemove);
  document.addEventListener('mouseup', mouseup);
}
function commitSelect() {
  if (props.preventSelect) return;

  const ctx = getCanvasCtx();
  emit('select', props.selectGenerator(ctx, width.value, height.value, sliderPosition));
}
function getCanvasCtx() {
  if (canvasCtx.value) return canvasCtx.value;

  const canvas = containerCanvasRef.value!;
  canvasCtx.value = canvas.getContext('2d', {
    willReadFrequently: true
  })!;
  return canvasCtx.value;
}
function blur() {
  if (document.activeElement) {
    (document.activeElement as any).blur?.();
  }
}

onMounted(() => {
  renderBg();
  renderSlider();
});

defineExpose({
  isDrag,
  renderBg,
  renderSlider,
  commitSelect
});
</script>

<template>
  <div
    ref="containerRef"
    class="CP-canvas-picker"
    :class="`CP-canvas-picker--${mode}`"
    @mousedown.prevent.stop="select"
  >
    <div class="CP-canvas-picker__canvas CP--box-border">
      <canvas ref="containerCanvasRef" />
    </div>
    <div
      :style="{
        ...sliderStyles,
        backgroundColor: sliderBg,
      }"
      class="CP-canvas-picker__slider"
      @mousedown.prevent.stop="select"
    />
  </div>
</template>

<style lang="scss" scoped>
.CP-canvas-picker {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;

  &__slider {
    position: absolute;
    box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
  }

  &--xy .CP-canvas-picker__slider {
    left: 100px;
    top: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #fff;
    box-shadow: 0 0 2px 0.5px rgba(0, 0, 0, 0.2) inset, 0 0 1px 1px rgba(0, 0, 0, 0.3);
  }
  &--x .CP-canvas-picker__slider {
    left: 100px;
    top: 0;
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: #fff;
  }
  &--y .CP-canvas-picker__slider {
    left: 0;
    top: 100px;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: #fff;
  }
}
</style>
