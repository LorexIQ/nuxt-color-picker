export default defineNuxtConfig({
  modules: ['../src/module', '@nuxthub/core'],

  ssr: false,

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
