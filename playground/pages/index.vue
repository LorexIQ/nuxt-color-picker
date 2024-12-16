<script setup lang="ts">
import { createAlphaSquare, hex2rgba } from '../../src/runtime/composables/helpers';
import Down from '~/components/icons/Down.vue';
import GitHub from '~/components/icons/GitHub.vue';

const pageRef = ref<HTMLDivElement>();
const colorsBlockRef = ref<HTMLDivElement>();
const selectedColor = ref('#000000C4');
const imgAlpha10Base64 = `url(${createAlphaSquare(10).toDataURL()})`;
const imgAlpha4Base64 = `url(${createAlphaSquare(4).toDataURL()})`;
const contrastColor = computed(() => pickContrastedByBGTextColor(selectedColor.value, '#fff', '#000'));
const isHideTip = ref(false);

const themeColors = reactive({
  colorPickerBg: '#1d2024',
  colorPickerInputTitle: '#999',
  colorPickerInputTitleBg: '#252930',
  colorPickerInputText: '#fff',
  colorPickerInputTextBg: '#2e333a',
  colorPickerDropper: '#9099a4',
  colorPickerDropperBg: '#2e333a',
  colorPickerShadowOut: '#00000033',
  colorPickerShadowIn: '#00000033',
  colorPickerSlider: '#fff'
});

watch(registerColors, () => registerColors());

function registerColors() {
  const stylePrepared = [
    ':root {',
    ...Object.keys(themeColors).map(key => `  --${key}: ${(themeColors as any)[key]};`),
    '}'
  ].join('\n');

  const id = 'nuxt-color-picker:ui';
  const _styleElement = document.getElementById(id);
  const styleElement = _styleElement ?? document.createElement('style');
  styleElement.id = id;
  styleElement.textContent = stylePrepared;
  if (!_styleElement) document.head.appendChild(styleElement);
}
function pickContrastedByBGTextColor(bgColor: string, lightColor: string, darkColor: string): string {
  const { r, g, b, a } = hex2rgba(bgColor);

  const colors = [r / 255, g / 255, b / 255];
  const c = colors.map((col) => {
    if (col <= 0.03928)
      return col / 12.92;
    return ((col + 0.055) / 1.055) ** 2.4;
  });

  const L = (0.2126 * c[0]) + (0.7152 * c[1]) + (0.0722 * c[2]);
  const alphaAdjustedLuminance = a < 1 ? L * a + (1 - a) * 0.5 : L;

  return (alphaAdjustedLuminance > 0.179) ? darkColor : lightColor;
}
function onScrollPage(event: Event) {
  const target = event.target as HTMLDivElement;
  isHideTip.value = target.scrollTop !== 0;
}
function goToColorsBlock() {
  const page = pageRef.value!;
  const content = colorsBlockRef.value!;
  const rect = content.getBoundingClientRect();

  page.scrollTo({
    behavior: 'smooth',
    top: rect.top
  });
}
function openLink(link: string) {
  window.open(link, '_blank');
}
</script>

<template>
  <div
    ref="pageRef"
    class="index-page"
    @scroll="onScrollPage"
  >
    <div class="index-page__main">
      <div class="index-page__main__github">
        <a
          href="https://github.com/LorexIQ/nuxt-color-picker.git"
          target="_blank"
        >Fork me on GitHub</a>
      </div>
      <div class="index-page__main__logo">
        Nuxt Color Picker
      </div>
      <color-picker-block v-model="selectedColor" />
      <div
        class="index-page__main__tip"
        :class="{ 'index-page__main__tip--hide': isHideTip }"
        @click="goToColorsBlock"
      >
        <span>Scroll Down</span>
        <div class="index-page__main__tip__icon">
          <Down />
          <Down :stroke-width="3" />
        </div>
      </div>
    </div>
    <div
      ref="colorsBlockRef"
      class="index-page__colors"
      :style="{ '--alpha': imgAlpha4Base64 }"
    >
      <div class="index-page__colors__title">
        Colors
      </div>
      <div
        v-for="(value, key) of themeColors"
        :key="key"
        class="index-page__colors__color"
      >
        <div class="index-page__colors__color__key">
          --{{ key }}
        </div>
        <color-picker
          v-slot="{ show, color }"
          v-model="themeColors[key]"
        >
          <div
            class="index-page__colors__color__value"
            :style="{ '--color': color.value }"
            @click="show"
          />
        </color-picker>
      </div>
    </div>
    <div class="index-page__footer">
      <div class="index-page__footer__box">
        <div>
          Copyright © 2024 LorexIQ - MIT License
        </div>
        <div>
          <GitHub @click="openLink('https://github.com/LorexIQ')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
html, body {
  font-family: 'Roboto', sans-serif;
  margin: 0;
  padding: 0;
}

*::-webkit-scrollbar {
  height: 12px;
  width: 12px;

  &-track {
    border-radius: 0;
    background: v-bind(contrastColor);
  }
  &-thumb {
    border-radius: 5px;
    background: linear-gradient(0deg, v-bind(selectedColor), v-bind(selectedColor)), v-bind(imgAlpha4Base64);
    border: 2px solid v-bind(contrastColor);
  }
}
</style>

<style lang="scss" scoped>
.index-page {
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;

  &__main {
    position: relative;
    display: grid;
    grid-template-rows: 33% 67%;
    justify-items: center;
    height: 100%;

    &::before {
      position: absolute;
      content: '';
      top: 0;
      right: 0;
      bottom: -100px;
      left: 0;
      z-index: -1;
      background: linear-gradient(0deg, v-bind(selectedColor), v-bind(selectedColor)), v-bind(imgAlpha10Base64);
    }

    &__github {
      position: fixed;
      right: 0;
      top: 0;
      width: 200px;
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: 700;
      background: #a00;
      text-align: center;
      box-shadow: 0 0 8px 0 rgba(0, 0, 0, .3);
      transform: rotate(45deg) translateX(60px);

      & a {
        display: block;
        text-decoration: none;
        color: #fff;
      }
    }
    &__logo {
      font-size: 48px;
      font-weight: 600;
      display: flex;
      justify-content: center;
      padding-top: 100px;
      width: 100%;
      color: v-bind(contrastColor);
      text-shadow: 0 0 8px rgba(0, 0, 0, .16);
      user-select: none;
    }
    &__tip {
      position: absolute;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 90px;
      color: v-bind(contrastColor);
      overflow: hidden;
      cursor: pointer;
      transition: opacity .3s;

      & span {
        font-size: 16px;
        font-weight: bolder;
        color: inherit;
      }
      &__icon {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: margin .3s;

        & svg {
          color: inherit;

          &:first-child {
            width: 60px;
            height: 60px;
          }
          &:last-child {
            width: 80px;
            height: 80px;
            margin-top: -60px;
          }
        }
      }

      &:hover {
        .index-page {
          &__main {
            &__tip {
              &__icon {
                margin-top: 5px;
              }
            }
          }
        }
      }

      &--hide {
        opacity: 0;
        pointer-events: none;
      }
    }
  }
  &__colors {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 100px 0 20px;
    background: linear-gradient(180deg, rgba(0,0,0,0) 0, rgba(0,0,0,1) 100px, rgba(0,0,0,1) 100px, rgba(0,0,0,1) 100%);

    &__title {
      font-size: 48px;
      font-weight: 600;
      color: #fff;
      margin-top: -50px;
      margin-bottom: 25px;
    }
    &__color {
      display: grid;
      grid-template-columns: 200px 50px;
      align-items: center;

      &__key {
        color: #fff;
      }
      &__value {
        position: relative;
        aspect-ratio: 1;
        width: 40px;
        margin: 5px;
        border: 1px solid;
        background: linear-gradient(0deg, var(--color), var(--color)), v-bind(imgAlpha4Base64);
        box-shadow: 0 0 3px .5px rgba(255, 255, 255, .1) inset;
        border-radius: 4px;
      }
    }
  }
  &__footer {
    border-top: 1px solid #101010;
    background-color: #000;

    &__box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1100px;
      margin: 0 auto;
      padding: 20px;
      color: #5e5e5e;

      & svg {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
