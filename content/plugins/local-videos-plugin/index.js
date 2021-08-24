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
        
        await this.type.create("local-videos", {
            showInMenu: true,
            label: 'Videos',
            icon: 'play_circle_filled'
        });

        await this.type.deleteFields("local-videos", fields.map(f => f.name));

        await this.type.createFields("local-videos", fields);
    }
    async stop() {
        await this.type.deleteFields("local-videos", fields.map(f => f.name));
        await this.type.delete("local-videos");
    }
}

exports.default = Plugin;
