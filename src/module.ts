import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'nuxt-color-picker'
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    await addComponent({
      name: 'ColorPicker',
      filePath: resolver.resolve('runtime', 'components', 'index.vue')
    });
  }
});
