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
        // input: {
        //     type: 'video',
        //     order: 1,
        //     props: {
        //         style: {
        //             height: '500px'
        //         }
        //     }
        // },
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
        // input: {
        //     position: 'sidebar',
        //     order: 1,
        // },
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
        // input: {
        //     type: 'textarea',
        //     order: 4,
        //     props: {
        //         dense: false,
        //         color: "purple-12"
        //     },
        // },
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
        // label: 'Thumbnail',
        // mapValue: 'snippet.thumbnails.default.url',
        // table: {
        //     type: 'image',
        //     order: 1,
        // },
        // input: {
        //     type: 'image',
        //     position: 'sidebar',
        //     order: 2,
        // },
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
        // mapValue: 'snippet.publishedAt',
        // table: {
        //     type: 'datetime',
        // },
        // input: {
        //     position: 'sidebar',
        //     order: 3,
        // },
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
        // label: 'Views',
        // mapValue: 'statistics.viewCount',
        // table: {
        //     type: 'number',
        // },
        // input: {
        //     position: 'sidebar',
        //     order: 4,
        // },
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
        // label: 'Likes',
        // mapValue: 'statistics.likeCount',
        // table: {
        //     type: 'number',
        // },
        // input: {
        //     position: 'sidebar',
        //     order: 4,
        // },
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
        // this.service.unregisterProvider("youtube-provider");
    }
}

exports.default = Plugin;
