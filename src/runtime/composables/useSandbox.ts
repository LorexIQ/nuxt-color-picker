import { Sandbox } from '../classes/Sandbox';
import { useState } from '#imports';

export default function () {
  return useState('nuxt-color-picker:sandbox', () => new Sandbox());
}
