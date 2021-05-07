"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Plugin {
    start() {
        const providePath = this.service.makePluginPath("dist/videos-provider.js");
        this.service.registerProvider("youtube-provider", providePath);
    }
    stop() {
        this.service.unregisterProvider("youtube-provider");
    }
}
exports.default = Plugin;
