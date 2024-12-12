import { h, markRaw, type Ref, render } from 'vue';
import type { ModuleStylesXY, ModuleSandboxComponent, ModuleSandboxSize } from '../types';
import ModuleSandbox from '../components/ModuleSandbox.vue';
import ColorPickerAbsolute from '../components/ColorPickerAbsolute.vue';
import unwrap from '../composables/unwrap';
import { reactive, ref } from '#imports';

export class Sandbox {
  private readonly id = 'nuxt-color-picker:sandbox';
  private readonly component = ref<ModuleSandboxComponent>();
  private readonly boxSize = reactive<ModuleSandboxSize>({ width: 0, height: 0 });

  constructor() {
    this._initSandbox();
  }

  private _initSandbox(): void {
    if (import.meta.client) {
      const nuxtElement = document.getElementById('__nuxt');
      const sandboxElement = document.getElementById(this.id);

      if (nuxtElement && !sandboxElement) {
        const container = document.createElement('div');
        nuxtElement.insertAdjacentElement('afterend', container);

        render(h(ModuleSandbox, { sandbox: this }), container);
        container.replaceWith(...container.childNodes);
      }
    }
  }

  getId(): string {
    return this.id;
  }

  getComponent(): Ref<ModuleSandboxComponent | undefined> {
    return this.component;
  }

  getBoxSize(): ModuleSandboxSize {
    return this.boxSize;
  }

  setBoxSize(event: ModuleSandboxSize): void {
    this.boxSize.width = event.width;
    this.boxSize.height = event.height;
  }

  openComponent(position: ModuleStylesXY, color: Ref<string | undefined>): void {
    unwrap.set(this, 'component', {
      id: 'color-picker',
      component: markRaw(ColorPickerAbsolute),
      props: {
        position,
        sandboxSize: this.boxSize,
        modelValue: color.value
      },
      emits: {
        'close': () => this.closeComponent(),
        'update:modelValue': value => color.value = value
      }
    });
  }

  closeComponent(): void {
    unwrap.set(this, 'component', undefined);
  }
}
