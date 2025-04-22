<script lang="ts" setup>
import { rgba2hex, rgb2rgbHue, any2rgbahsv, any2hex } from '../composables/helpers';
import type {
  ModuleColorMultiType,
  ModuleHSV,
  ModuleRGB,
  ModuleRGBA,
  ModuleRGBAHSV,
  ModuleRGBH
} from '../types';

import Saturation from './Saturation.vue';
import Hue from './Hue.vue';
import Alpha from './Alpha.vue';
import Preview from './Preview.vue';
import Box from './Box.vue';
import EyeDropper from './EyeDropper.vue';
import Colors from './Colors.vue';
import { ref, reactive, computed, watch, nextTick } from '#imports';

type Props = {
  modelValue?: string;
  storageKey?: string;
  withAlpha?: boolean;
  withInitialColor?: boolean;
  withEyeDropper?: boolean;
  withHexInput?: boolean;
  withRgbInput?: boolean;
  withColorsHistory?: boolean | number;
  immediateEmit?: boolean;
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: ModuleColorMultiType): void;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000',
  storageKey: 'history',
  withAlpha: false,
  withInitialColor: false,
  withEyeDropper: false,
  withHexInput: false,
  withRgbInput: false,
  withColorsHistory: false,
  immediateEmit: false
});
const emit = defineEmits<Emits>();

const isAlphaBlock = computed(() => props.withAlpha);
const isInitialColorBlock = computed(() => props.withInitialColor);
const isEyeDropperBlock = computed(() => props.withEyeDropper && !!(window as any).EyeDropper);
const isHexInputBlock = computed(() => props.withHexInput);
const isRGBInputBlock = computed(() => props.withRgbInput);
const isColorsHistoryBlock = computed(() => props.withColorsHistory && defaultColorsHistory.length);

const modelRgba = ref('');
const modelHex = ref('');
const containerRef = ref<HTMLDivElement>();
const oldColor = ref(any2hex(props.modelValue, isAlphaBlock.value));
const hueColor = reactive<ModuleRGBH>({
  r: 0,
  g: 0,
  b: 0,
  h: 0
});
const fullColorSpector = reactive<ModuleRGBAHSV>({
  r: 0,
  g: 0,
  b: 0,
  a: 0,
  h: 0,
  s: 0,
  v: 0
});
const isPreventSelects = ref(false);
const defaultColorsHistory = reactive<string[]>([
  '#FFB243',
  '#FFE623',
  '#6EFF2A',
  '#1BC7B1',
  '#00BEFF',
  '#2E81FF',
  '#BF3DCE',
  '#8E00A7',
  '#00000000'
]);

const rgba = computed<ModuleRGBA>(() => ({ r: fullColorSpector.r, g: fullColorSpector.g, b: fullColorSpector.b, a: fullColorSpector.a }));
const hsv = computed<ModuleHSV>(() => ({ h: fullColorSpector.h, s: fullColorSpector.s, v: fullColorSpector.v }));
const rgbStringShort = computed(() => `${fullColorSpector.r}, ${fullColorSpector.g}, ${fullColorSpector.b}`);
const rgbaStringShort = computed(() => `${fullColorSpector.r}, ${fullColorSpector.g}, ${fullColorSpector.b}, ${fullColorSpector.a}`);
const rgbaString = computed(() => `rgba(${rgbaStringShort.value})`);
const hexString = computed(() => rgba2hex(rgba.value, true));

initColorValue();
initHueColor();
initDefaultColors();

watch(hexString, value => emit('update:modelValue', value), { immediate: props.immediateEmit });
watch(rgba, value => emit('change', {
  rgba: value,
  hsv: hsv.value,
  hex: modelHex.value
}), { immediate: props.immediateEmit });

function setText() {
  modelHex.value = hexString.value;
  modelRgba.value = isAlphaBlock.value ? rgbaStringShort.value : rgbStringShort.value;
}
function handleInputFocus(status: boolean) {
  isPreventSelects.value = status;
}
function withPreventSelects(handler: () => any) {
  isPreventSelects.value = true;

  nextTick(() => {
    handler();

    nextTick(() => {
      isPreventSelects.value = false;
    });
  });
}

function initColorValue() {
  Object.assign(fullColorSpector, any2rgbahsv(props.modelValue, isAlphaBlock.value));
  setText();
}
function initHueColor() {
  const { r, g, b } = any2rgbahsv(props.modelValue, isAlphaBlock.value);
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
}
function initDefaultColors() {
  const defaultColorsLength = defaultColorsHistory.length - (isAlphaBlock.value ? 0 : 1);
  const setting = props.withColorsHistory;
  const countOfColors = typeof setting === 'number'
    ? setting < 1 ? 0 : setting > defaultColorsLength ? defaultColorsLength : setting
    : setting ? defaultColorsLength : 0;

  defaultColorsHistory.splice(countOfColors);
}

function selectSaturation(color: ModuleRGB) {
  const { r, g, b, h, s, v } = any2rgbahsv(color, isAlphaBlock.value);
  Object.assign(fullColorSpector, { r, g, b, h, s, v });
  setText();
}
function selectHue(color: ModuleRGBH) {
  Object.assign(hueColor, color);
  setText();
}
function selectAlpha(a: number) {
  fullColorSpector.a = a;
  setText();
}
function selectEyeDropper(color: string) {
  withPreventSelects(() => {
    inputHex(color);
  });
}
async function selectColor(color: string) {
  withPreventSelects(() => {
    const { r, g, b, a, h, s, v } = any2rgbahsv(color, isAlphaBlock.value);
    Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
    Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
    setText();
  });
}

function inputHex(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color, isAlphaBlock.value);
  Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = color.toUpperCase();
  modelRgba.value = rgbaStringShort.value;
}
function inputRgba(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color, isAlphaBlock.value);
  Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = hexString.value;
  modelRgba.value = color;
}

defineExpose({
  containerRef
});
</script>

<template>
  <div
    ref="containerRef"
    class="CP-block"
    :class="{
      'CP-block--with-alpha': withAlpha,
      'CP-block--with-eye-dropper': isEyeDropperBlock,
    }"
  >
    <div class="CP-block__pickers">
      <Saturation
        class="CP-block__pickers__saturation"
        :color="fullColorSpector"
        :hue-color="hueColor"
        :prevent-select="isPreventSelects"
        @select="selectSaturation"
      />
      <Hue
        class="CP-block__pickers__hue"
        :rgbh="hueColor"
        @select="selectHue"
      />
      <Alpha
        v-if="isAlphaBlock"
        class="CP-block__pickers__alpha"
        :rgba="rgba"
        @select="selectAlpha"
      />
    </div>
    <div class="CP-block__rows">
      <Preview
        class="CP-block__rows__preview"
        :color="rgbaString"
        :old-color="isInitialColorBlock ? oldColor : undefined"
        @select="selectColor"
      />
      <EyeDropper
        v-if="isEyeDropperBlock"
        class="CP-block__rows__eye-dropper"
        @select="selectEyeDropper"
      />
      <Box
        v-if="isHexInputBlock"
        class="CP-block__rows__hex"
        name="HEX"
        :color="modelHex"
        @input-color="inputHex"
        @input-focus="handleInputFocus"
      />
      <Box
        v-if="isRGBInputBlock"
        class="CP-block__rows__rgba"
        :name="withAlpha ? 'RGBA' : 'RGB'"
        :color="modelRgba"
        @input-color="inputRgba"
        @input-focus="handleInputFocus"
      />
      <Colors
        v-if="isColorsHistoryBlock"
        class="CP-block__rows__colors"
        :color="hexString"
        :old-color="oldColor"
        :colors-default="defaultColorsHistory"
        :storage-key="storageKey"
        :with-alpha="isAlphaBlock"
        @select="selectColor"
      />
    </div>
  </div>
</template>

<style scoped>
.CP-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 195px;
  height: max-content;
  padding: 10px;
  background: var(--colorPickerBg);
  border-radius: 5px;
  box-shadow: 0 0 16px 0 var(--colorPickerShadowOut);
}

.CP-block__pickers {
  display: grid;
  grid-template-columns: 152px 15px 15px;
  gap: 8px;
}

.CP-block__rows {
  display: grid;
  grid-template-columns: auto 30px;
  grid-template-rows: 30px;
  gap: 8px;
}

.CP-block__rows__preview {
  grid-area: auto / 1 / auto / 3;
}

.CP-block__rows__eye-dropper {
  grid-area: auto / 2 / auto / 3;
}

.CP-block__rows__hex {
  grid-area: auto / 1 / auto / 3;
}

.CP-block__rows__rgba {
  grid-area: auto / 1 / auto / 3;
}

.CP-block__rows__colors {
  grid-area: auto / 1 / auto / 3;
}

.CP-block--with-alpha {
  width: 218px;
}

.CP-block--with-eye-dropper .CP-block__rows {
  grid-template-columns: auto 38px;
  grid-template-rows: 38px;
}

.CP-block--with-eye-dropper .CP-block__rows__preview {
  grid-area: auto / 1 / auto / 2;
}
</style>
