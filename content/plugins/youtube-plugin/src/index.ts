export default class Plugin {
    public service: any;

    async start() {

        await this.service.registerItemType("youtube-videos", {
            showInMenu: true,
            icon: 'play_circle_filled',
            fields: [
                {
                    name: 'thumbnailSrc',
                    label: 'Thumbnail',
                    type: 'image',
                    mapValue: 'snippet.thumbnails.default.url'
                },
                {
                    name: 'title',
                    label: 'Title',
                    mapValue: 'snippet.title'
                },
                {
                    name: 'publishedAt',
                    label: 'Published at',
                    type: 'datetime',
                    mapValue: 'snippet.publishedAt'
                },
                {
                    name: 'viewCount',
                    label: 'Views',
                    type: 'number',
                    mapValue: 'statistics.viewCount'
                },
                {
                    name: 'likeCount',
                    label: 'Likes',
                    type: 'number',
                    mapValue: 'statistics.likeCount'
                },
            ]
        });

        await this.service.registerProvider({
            name: "youtube-provider",
            path: this.service.makePluginPath("dist/videos-provider.js"),
            itemType: "youtube-videos",
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
        await this.service.unregisterItemType("youtube-videos");
        this.service.unregisterProvider("youtube-provider");
    }
}
