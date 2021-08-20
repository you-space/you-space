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
        }
    },
]

class Plugin {
    async start() {
        
        await this.service.createType("local-videos", {
            showInMenu: true,
            label: 'Videos',
            icon: 'play_circle_filled'
        });

        await this.service.deleteTypeFields("local-videos", fields.map(f => f.name));

        await this.service.createTypeFields("local-videos", fields);
    }
    async stop() {
        await this.service.deleteTypeFields("local-videos", fields.map(f => f.name));
        await this.service.deleteType("local-videos");
    }
}

exports.default = Plugin;
