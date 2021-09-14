/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');

module.exports = {
    root: true,
    parserOptions: {
        extraFileExtensions: ['.vue'],
        parser: '@typescript-eslint/parser',
        project: resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: 'module',
    },

    env: {
        browser: true,
    },

    extends: [
        'plugin:@typescript-eslint/recommended',

        'plugin:@typescript-eslint/recommended-requiring-type-checking',

        'plugin:vue/vue3-essential',
        'plugin:vue/vue3-strongly-recommended',
        'plugin:vue/vue3-recommended',

        'prettier/vue',
    ],

    plugins: ['@typescript-eslint', 'vue'],

    globals: {
        ga: true,
        cordova: true,
        __statics: true,
        __QUASAR_SSR__: true,
        __QUASAR_SSR_SERVER__: true,
        __QUASAR_SSR_CLIENT__: true,
        __QUASAR_SSR_PWA__: true,
        process: true,
        Capacitor: true,
        chrome: true,
    },

    rules: {
        'prefer-promise-reject-errors': 'off',
        indent: ['error', 4],
        'vue/html-indent': ['error', 4],
        semi: ['error', 'always'],
        'comma-spacing': ['error'],
        'no-unsafe-assignment': 'off',
        'no-unsafe-call': 'off',
        'no-unsafe-member-access': 'off',

        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',

        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
    },
};
