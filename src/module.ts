import { defineNuxtModule, createResolver, addComponent } from '@nuxt/kit';

export default defineNuxtModule({
  meta: {
    name: 'nuxt-color-picker'
  },
  async setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    _nuxt.options.css.push(resolver.resolve('runtime', 'assets', 'main.scss'));

    await addComponent({
      name: 'ColorPicker',
      filePath: resolver.resolve('runtime', 'components', 'index.vue')
    });
  }
});
