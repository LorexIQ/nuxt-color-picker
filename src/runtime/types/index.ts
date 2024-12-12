import type { Component } from 'vue';
import type { Sandbox } from '../classes/Sandbox';

export type ModuleStylesX = {
  x: number;
};
export type ModuleStylesY = {
  y: number;
};
export type ModuleStylesLeft = {
  left: string;
};
export type ModuleStylesTop = {
  top: string;
};
export type ModuleStylesXY = ModuleStylesX & ModuleStylesY;
export type ModuleStylesPos = ModuleStylesLeft & ModuleStylesTop;

export type ModuleRGB = {
  r: number;
  g: number;
  b: number;
};
export type ModuleRGBH = ModuleRGB & {
  h: number;
};
export type ModuleRGBA = ModuleRGB & {
  a: number;
};
export type ModuleHSV = {
  h: number;
  s: number;
  v: number;
};
export type ModuleHEX = string;
export type ModuleRGBAHSV = ModuleRGBA & ModuleHSV;
export type ModuleColorMultiType = {
  rgba: ModuleRGBA;
  hsv: ModuleHSV;
  hex: ModuleHEX;
};

export type ModuleSandboxSize = {
  width: number;
  height: number;
};
export type ModuleSandboxComponent = {
  id: string;
  component: Component;
  props?: { [name: string]: any };
  emits?: { [name: string]: (e: any) => any };
};

export type ModuleSandbox = Sandbox;
