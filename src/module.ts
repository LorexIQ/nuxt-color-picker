import { defineNuxtModule, createResolver, addComponent, addPlugin } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'nuxt-color-picker'
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    _nuxt.options.css.push(resolver.resolve('runtime', 'assets', 'main.css'));

    _nuxt.hook('prepare:types', ({ references }) => {
      references.push({
        path: resolver.resolve('./runtime/types/eyedropper.d.ts')
      });
    });

    addPlugin({
      src: resolver.resolve('./runtime/plugin'),
      mode: 'client'
    });

    await addComponent({
      name: 'ColorPicker',
      filePath: resolver.resolve('runtime', 'components', 'index.vue'),
      mode: 'client'
    });
    await addComponent({
      name: 'ColorPickerBlock',
      filePath: resolver.resolve('runtime', 'components', 'ColorPickerBlock.vue'),
      mode: 'client'
    });
  }
});
