"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

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
            componentProps: {
                label: 'Title',
            },
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
            componentProps: {
                type: 'textarea',
                label: 'Description',
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
            componentProps: {
                label: 'Thumbnail'
            },
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
            componentProps: {
                label: 'Published at',
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
            component: 'ys-i18n',
            componentProps: {
                type: 'number',
                label: 'Views',
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
            component: 'ys-i18n',
            componentProps: {
                type: 'number',
                label: 'Likes',
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
class Plugin {
    async start() {
        
        await this.service.createType("youtube-videos", {
            showInMenu: true,
            label: 'Youtube',
            icon: 'play_circle_filled'
        });

        await this.service.deleteTypeFields("youtube-videos", fields.map(f => f.name));

        await this.service.createTypeFields("youtube-videos", fields);

        await this.service.createProvider("youtube-provider", {
            path: this.service.makePluginPath("provider.js"),
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
        await this.service.deleteTypeFields("youtube-videos", fields.map(f => f.name));
        await this.service.deleteType("youtube-videos");
        await this.service.deleteProvider("youtube-provider");
    }
}

exports.default = Plugin;
