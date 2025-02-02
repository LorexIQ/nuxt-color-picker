export default defineNuxtConfig({
  // modules: ['../src/module', '@nuxthub/core'],
  modules: ['../dist/module', '@nuxthub/core'],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'Nuxt Color Picker'
    }
  },

  compatibilityDate: '2024-12-11',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern'
        }
      }
    }
  }
});
