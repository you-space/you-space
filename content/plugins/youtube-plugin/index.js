"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path')

const fields = [
    {
        name: 'src',
        type: 'mapped',
        options: {
            path: 'src',
            component: 'YsVideo',
            componentProps: {
                style: 'height:530px'
            },
            table: {
                show: false,
            },
        },
    },
    {
        name: 'title',
        type: 'mapped',
        options: {
            path: 'snippet.title',
            label: 'Title',
            table: {
                order: 2
            },
            single: {
                order: 1
            }
        },
    },
    {
        name: 'description',
        type: 'mapped',
        options: {
            path: 'snippet.description',
            label: 'Description',
            componentProps: {
                type: 'textarea',
                autogrow: true
            },
            table: {
                show: false
            }
        },
    },
    {
        name: 'thumbnailSrc',
        type: 'mapped',
        options: {
            path: 'snippet.thumbnails.default.url',
            component: 'YsImg',
            label: 'Thumbnail',
            table: {
                order: 1,
                componentProps: {
                    style: {
                        height: '80px',
                        width: '140px'
                    }
                },
            },
            single: {
                position: 'sidebar',
                componentProps: {
                    showLabel: true,
                    style: {
                        height: '200px'
                    }
                }
            }
        },
    },
    {
        name: 'publishedAt',
        type: 'mapped',
        options: {
            path: 'snippet.publishedAt',
            component: 'ys-i18n',
            label: 'Published at',
            componentProps: {
                type: 'date',
                args: 'long',
            },
            single: {
                position: 'sidebar',
                componentProps: {
                    showLabel: true
                },
            }
        },
    },
    {
        name: 'viewCount',
        type: 'mapped',
        options: {
            path: 'statistics.viewCount',
            label: 'Views',
            component: 'ys-i18n',
            componentProps: {
                type: 'number',
            },
            single: {
                position: 'sidebar',
                componentProps: {
                    showLabel: true
                },
            }
        },
    },
    {
        name: 'likeCount',
        type: 'mapped',
        options: {
            path: 'statistics.likeCount',
            label: 'Likes',
            component: 'ys-i18n',
            componentProps: {
                type: 'number',
            },
            single: {
                position: 'sidebar',
                componentProps: {
                    showLabel: true
                },
            }
        },
    },
]
class YoutubePlugin {
    async start() {

        console.log(this)
        
        await this.createType("youtube-videos", {
            showInMenu: true,
            label: 'Youtube',
            icon: 'play_circle_filled'
        });

        await this.deleteTypeFields("youtube-videos", fields.map(f => f.name));

        await this.createTypeFields("youtube-videos", fields);

        await this.createProvider("youtube-provider", {
            path: path.resolve(__dirname, "provider.js"),
            options: ['import'],
            fields: [
                {
                    name: "apiKey",
                    label: "Api key",
                },
                {
                    name: "channelId",
                    label: "Channel id",
                },
            ]
        });
    }
    async stop() {
        console.log(this)
        await this.deleteType("youtube-videos");
        await this.deleteProvider("youtube-provider");
    }
}

exports.default = YoutubePlugin;
