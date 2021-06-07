export default class Plugin {
    public service: any;

    async start() {

        await this.service.registerItemType("youtube-videos");

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
