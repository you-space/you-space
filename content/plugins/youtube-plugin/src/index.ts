export default class Plugin {
    public service: any;

    start() {
        const providePath = this.service.makePluginPath(
            "dist/videos-provider.js"
        );

        this.service.registerProvider("youtube-provider", providePath);
    }

    stop() {
        this.service.unregisterProvider("youtube-provider");
    }
}
