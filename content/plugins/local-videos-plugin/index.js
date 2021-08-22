"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const fields = [
    {
        name: 'title',
        type: 'editable',
        options: {
            required: true,
            label: 'Title',
            order: 1,
        }
    },
    {
        name: 'description',
        type: 'editable',
        options: {
            required: true,
            label: 'Description',
            componentProps: {
                type: 'textarea',
                label: 'Description',
                autogrow: true
            },
            order: 2,
            table: {
                show: false
            }
        }
    },
    {
        name: 'thumbnail',
        type: 'file',
        options: {
            label: 'Thumbnail',
            table: {
                component: 'ys-img',
                componentProps: {
                    style: {
                        height: '80px',
                        width: '140px'
                    }
                },
            },
            single: {
                position: 'sidebar',
                component: 'ys-file',
                componentProps: {
                    type: 'image'
                },
            },
        }
    },
    {
        name: 'video',
        type: 'file',
        options: {
            label: 'Video',
            single: {
                component: 'ys-file',
                componentProps: {
                    type: 'video'
                },
            },
            table: {
                show: false
            }
        }
    },
]

class Plugin {
    async start() {
        
        await this.createType("local-videos", {
            showInMenu: true,
            label: 'Videos',
            icon: 'play_circle_filled'
        });

        await this.deleteTypeFields("local-videos", fields.map(f => f.name));

        await this.createTypeFields("local-videos", fields);
    }
    async stop() {
        await this.deleteTypeFields("local-videos", fields.map(f => f.name));
        await this.deleteType("local-videos");
    }
}

exports.default = Plugin;
