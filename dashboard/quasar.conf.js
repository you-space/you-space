/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */
const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
    return {
        supportTS: {
            tsCheckerConfig: {
                eslint: {
                    enabled: true,
                    files: './src/**/*.{ts,tsx,js,jsx,vue}',
                },
            },
        },
        preFetch: false,
        boot: [
            'i18n',
            'axios',
            'global-components',
            'authentication',
            'socket-io',
            'helper',
            'json-viewer',
        ],

        css: ['app.scss'],

        extras: ['roboto-font', 'material-icons'],

        build: {
            vueRouterMode: 'history',
            publicPath:
                process.env.NODE_ENV === 'development' ? '/' : '/ys-admin',

            distDir: '../public',

            chainWebpack(/* chain */) {
                //
            },
        },

        devServer: {
            https: false,
            port: 8080,
            open: false,
            proxy: {
                '/api': {
                    target: 'http://localhost:3333/api',
                    changeOrigin: true,
                    pathRewrite: { '^/api': '' },
                },
            },
        },

        framework: {
            config: {},

            //

            plugins: ['Notify', 'Dialog'],
        },

        animations: [],

        ssr: { pwa: false },

        pwa: {
            workboxPluginMode: 'GenerateSW',
            workboxOptions: {},
            manifest: {
                name: 'you-space',
                short_name: 'you-space',
                description: 'You space front-end',
                display: 'standalone',
                orientation: 'portrait',
                background_color: '#ffffff',
                theme_color: '#027be3',
                icons: [
                    {
                        src: 'icons/icon-128x128.png',
                        sizes: '128x128',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        },

        cordova: {},

        capacitor: { hideSplashscreen: true },

        electron: {
            bundler: 'packager',
            packager: {},
            builder: {
                appId: 'you-space',
            },
        },
    };
});
