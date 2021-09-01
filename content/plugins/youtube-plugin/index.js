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
            path: 'snippet.thumbnails.high.url',
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
        await this.type.create("youtube-videos", {
            showInMenu: true,
            label: 'Youtube',
            icon: 'play_circle_filled'
        });

        await this.type.deleteFields("youtube-videos", fields.map(f => f.name));

        await this.type.createFields("youtube-videos", fields);

        await this.provider.create("youtube-videos", path.resolve(__dirname, "provider.js"))
    }
    async stop() {
        await this.type.delete("youtube-videos");
        await this.provider.delete("youtube-videos")
    }
}

exports.default = YoutubePlugin;
