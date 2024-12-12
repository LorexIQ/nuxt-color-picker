import useSandbox from './composables/useSandbox';
import { defineNuxtPlugin } from '#imports';

export default defineNuxtPlugin(() => {
  useSandbox();
});
