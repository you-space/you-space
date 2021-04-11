module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'transform-imports',
      {
        quasar: {
          transform: require('quasar/dist/transforms/import-transformation.js'),
          preventFullImport: false,
        },
      },
    ],
  ],
}
