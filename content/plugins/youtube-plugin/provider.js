const axios = require("axios");
const lodash = require( "lodash");

class YoutubeProvider {
    options = ['import']
    fields = [
        {
            name: "apiKey",
            label: "Api key",
        },
        {
            name: "channelId",
            label: "Channel id",
        },
    ]
    config;

    maxResults = 50;
    totalVideos = 0
    totalImported = 0

    api = axios.create({
        baseURL: "https://www.googleapis.com/youtube/v3",
    });
    
    nextPageToken = undefined

    async findPlaylistId() {
        const request = await this.api
            .get("channels", {
                params: {
                    key: this.config.apiKey,
                    id: this.config.channelId,
                    part: "contentDetails, statistics",
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

        this.totalVideos = Number(lodash.get(channel, 'statistics.videoCount', 0))

        return uploadPlaylistId;
    }

    async import(setProgress) {
        const playlistId = await this.findPlaylistId();

        const requestPlaylistItems = await this.api.get("playlistItems", {
            params: {
                part: "contentDetails",
                key: this.config.apiKey,
                playlistId,
                pageToken: this.nextPageToken,
                maxResults: this.maxResults,
            },
        });

        const items = lodash.get(requestPlaylistItems, "data.items", []);

        this.nextPageToken = lodash.get(
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

        this.totalImported += data.length
            
        await this.item.createMany('youtube-videos', data);
        
        setProgress(Math.ceil((this.totalImported * 100) / this.totalVideos))

        if (this.nextPageToken) {
            await this.import(setProgress)
        }

    }

}

module.exports = YoutubeProvider;