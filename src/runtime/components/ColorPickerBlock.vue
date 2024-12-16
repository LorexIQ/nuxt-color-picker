<script lang="ts" setup>
import { rgba2hex, rgb2rgbHue, any2rgbahsv } from '../composables/helpers';
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
};
type Emits = {
  (e: 'update:modelValue', v: string): void;
  (e: 'change', v: ModuleColorMultiType): void;
};

const props = withDefaults(defineProps<Props>(), {
  modelValue: '#000000'
});
const emit = defineEmits<Emits>();

const isPreventSelects = ref(false);
const isEyeDropper = ref(!!window.EyeDropper);

const modelRgba = ref('');
const modelHex = ref('');
const containerRef = ref<HTMLDivElement>();
const oldColor = ref(props.modelValue);
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

const rgba = computed<ModuleRGBA>(() => ({ r: fullColorSpector.r, g: fullColorSpector.g, b: fullColorSpector.b, a: fullColorSpector.a }));
const hsv = computed<ModuleHSV>(() => ({ h: fullColorSpector.h, s: fullColorSpector.s, v: fullColorSpector.v }));
const rgbaStringShort = computed(() => `${fullColorSpector.r}, ${fullColorSpector.g}, ${fullColorSpector.b}, ${fullColorSpector.a}`);
const rgbaString = computed(() => `rgba(${rgbaStringShort.value})`);
const hexString = computed(() => rgba2hex(rgba.value, true));

initColorValue();
initHueColor();

watch(hexString, value => emit('update:modelValue', value));
watch(rgba, value => emit('change', {
  rgba: value,
  hsv: hsv.value,
  hex: modelHex.value
}));

function setText() {
  modelHex.value = hexString.value;
  modelRgba.value = rgbaStringShort.value;
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
  Object.assign(fullColorSpector, any2rgbahsv(props.modelValue));
  setText();
}
function initHueColor() {
  const { r, g, b } = any2rgbahsv(props.modelValue);
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
}

function selectSaturation(color: ModuleRGB) {
  const { r, g, b, h, s, v } = any2rgbahsv(color);
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
    const { r, g, b, a, h, s, v } = any2rgbahsv(color);
    Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
    Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
    setText();
  });
}

function inputHex(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color);
  Object.assign(fullColorSpector, { r, g, b, a, h, s, v });
  Object.assign(hueColor, rgb2rgbHue({ r, g, b }));
  modelHex.value = color.toUpperCase();
  modelRgba.value = rgbaStringShort.value;
}
function inputRgba(color: string) {
  const { r, g, b, a, h, s, v } = any2rgbahsv(color);
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
        class="CP-block__pickers__alpha"
        :rgba="rgba"
        @select="selectAlpha"
      />
    </div>
    <div
      class="CP-block__rows"
      :class="{ 'CP-block__rows--with-eye-dropper': isEyeDropper }"
    >
      <Preview
        class="CP-block__rows__preview"
        :old-color="oldColor"
        :color="rgbaString"
      />
      <EyeDropper
        v-if="isEyeDropper"
        @select="selectEyeDropper"
      />
      <Box
        class="CP-block__rows__hex"
        name="HEX"
        :color="modelHex"
        @input-color="inputHex"
        @input-focus="handleInputFocus"
      />
      <Box
        class="CP-block__rows__rgba"
        name="RGBA"
        :color="modelRgba"
        @input-color="inputRgba"
        @input-focus="handleInputFocus"
      />
      <Colors
        class="CP-block__rows__colors"
        :color="hexString"
        :colors-default="[
          '#FFB243',
          '#FFE623',
          '#6EFF2A',
          '#1BC7B1',
          '#00BEFF',
          '#2E81FF',
          '#BF3DCE',
          '#8E00A7',
          '#00000000',
        ]"
        @select="selectColor"
      />
    </div>
  </div>
</template>

<style lang="scss">

</style>

<style lang="scss" scoped>
.CP-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 218px;
  height: max-content;
  padding: 10px;
  background: var(--colorPickerBg);
  border-radius: 5px;
  box-shadow: 0 0 16px 0 var(--colorPickerShadowOut);

  &__pickers {
    display: grid;
    grid-template-columns: 152px 15px 15px;
    gap: 8px;
  }
  &__rows {
    display: grid;
    grid-template-areas:
      "PREVIEW PREVIEW"
      "HEX HEX"
      "RGBA RGBA"
      "COLORS COLORS";
    grid-template-columns: auto 30px;
    grid-template-rows: 30px repeat(3, auto);
    gap: 8px;

    &__preview {
      grid-area: PREVIEW;
    }
    &__hex {
      grid-area: HEX;
    }
    &__rgba {
      grid-area: RGBA;
    }
    &__colors {
      grid-area: COLORS;
    }

    &--with-eye-dropper {
      grid-template-areas:
        "PREVIEW EYEDROPPER"
        "HEX HEX"
        "RGBA RGBA"
        "COLORS COLORS";
      grid-template-columns: auto 38px;
      grid-template-rows: 38px auto auto;
    }
  }
}
</style>
