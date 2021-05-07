"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const lodash_1 = __importDefault(require("lodash"));
class Provider {
    constructor() {
        this.maxResults = 50;
        this.api = axios_1.default.create({
            baseURL: "https://www.googleapis.com/youtube/v3",
        });
        this.videos = [];
    }
    async getUploadPlaylistId() {
        const request = await this.api
            .get("channels", {
            params: {
                key: this.config.apiKey,
                id: this.config.channelId,
                part: "contentDetails",
            },
        })
            .catch(() => { });
        const channel = lodash_1.default.get(request, "data.items[0]", null);
        if (!channel) {
            throw new Error("you-tube channel not found");
        }
        const uploadPlaylistId = lodash_1.default.get(channel, "contentDetails.relatedPlaylists.uploads");
        return uploadPlaylistId;
    }
    async import() {
        await this.fetchVideos();
        await this.service.createMany(this.videos);
        return this.videos;
    }
    async fetchVideos(pageToken) {
        const playlistId = await this.getUploadPlaylistId();
        const requestPlaylistItems = await this.api.get("playlistItems", {
            params: {
                part: "contentDetails",
                key: this.config.apiKey,
                playlistId,
                pageToken,
                maxResults: this.maxResults,
            },
        });
        const items = lodash_1.default.get(requestPlaylistItems, "data.items", []);
        const nextPageToken = lodash_1.default.get(requestPlaylistItems, "data.nextPageToken", null);
        const videoIds = items
            .map((i) => lodash_1.default.get(i, "contentDetails.videoId", null))
            .filter((i) => i !== null);
        const requestVideos = await this.api.get("videos", {
            params: {
                key: this.config.apiKey,
                part: "statistics, snippet",
                id: videoIds.join(),
            },
        });
        const videos = lodash_1.default.get(requestVideos, "data.items", []);
        const data = videos.map((i) => ({
            id: i.id,
            data: i,
        }));
        this.videos = this.videos.concat(data);
        if (nextPageToken) {
            // await this.fetchVideos(nextPageToken)
        }
    }
    serialize(data) {
        const viewsCount = lodash_1.default.get(data, "statistics.viewCount", 0);
        const standardThumb = lodash_1.default.get(data, "snippet.thumbnails.standard.url", null);
        const defaultThumb = lodash_1.default.get(data, "snippet.thumbnails.default.url", null);
        return {
            videoId: lodash_1.default.get(data, "id", null),
            title: lodash_1.default.get(data, "snippet.title", null),
            src: `https://www.youtube.com/embed/${lodash_1.default.get(data, "id", null)}`,
            description: lodash_1.default.get(data, "snippet.description", null),
            viewsCount: Number(viewsCount),
            thumbnailSrc: standardThumb || defaultThumb,
            originLink: `https://www.youtube.com/watch?v=${lodash_1.default.get(data, "id", null)}`,
            publishedAt: lodash_1.default.get(data, "snippet.publishedAt", null),
        };
    }
}
exports.default = Provider;
Provider.options = ["import"];
Provider.entityName = "video-youtube";
Provider.fields = [
    {
        name: "apiKey",
        label: "Api key",
    },
    {
        name: "channelId",
        label: "Channel id",
    },
];
