const axios = require("axios");
const lodash = require( "lodash");
const path = require( "path");

class YoutubeProvider {
    config;
    service;

    maxResults = 50;
    api = axios.create({
        baseURL: "https://www.googleapis.com/youtube/v3",
    });

    videos = [];

    async findPlaylistId() {
        const request = await this.api
            .get("channels", {
                params: {
                    key: this.config.apiKey,
                    id: this.config.channelId,
                    part: "contentDetails",
                },
            })
            .catch((err) => this.service.logger.error(err.message));

        const channel = lodash.get(request, "data.items[0]", null);

        if (!channel) {
            throw new Error("you-tube channel not found");
        }

        const uploadPlaylistId = lodash.get(
            channel,
            "contentDetails.relatedPlaylists.uploads"
        );

        return uploadPlaylistId;
    }

    async import() {
        await this.fetchVideos();

        await this.item.createMany('youtube-videos', this.videos);

        return this.videos;
    }

    async fetchVideos(pageToken) {
        const playlistId = await this.findPlaylistId();

        const requestPlaylistItems = await this.api.get("playlistItems", {
            params: {
                part: "contentDetails",
                key: this.config.apiKey,
                playlistId,
                pageToken,
                maxResults: this.maxResults,
            },
        });

        const items = lodash.get(requestPlaylistItems, "data.items", []);

        const nextPageToken = lodash.get(
            requestPlaylistItems,
            "data.nextPageToken",
            null
        );

        const videoIds = items
            .map((i) => lodash.get(i, "contentDetails.videoId", null))
            .filter((i) => i !== null);

        const requestVideos = await this.api.get("videos", {
            params: {
                key: this.config.apiKey,
                part: "statistics, snippet",
                id: videoIds.join(),
            },
        });

        const videos = lodash.get(requestVideos, "data.items", []);
        
        const data = videos.map((i) => ({
            sourceId: i.id,
            value: {
                ...i,
                src: `https://www.youtube.com/embed/${i.id}`
            },
        }));

        this.videos = this.videos.concat(data);

        if (nextPageToken) {
            await this.fetchVideos(nextPageToken)
        }
    }

}

module.exports = YoutubeProvider;