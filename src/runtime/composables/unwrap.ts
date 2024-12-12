import type { Ref } from '@vue/reactivity';
import { isRef } from '#imports';

export default {
  get<T>(v: Ref<T> | T): T {
    return isRef(v) ? v.value : v;
  },
  set<T extends Record<string, any>, K extends keyof T | string, V extends T[K]['value']>(context: T, key: K, value: V): void {
    if (isRef(context[key])) {
      context[key].value = value;
    } else {
      context[key] = value as T[K];
    }
  }
};
