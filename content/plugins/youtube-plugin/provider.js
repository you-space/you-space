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

    api = axios.create({
        baseURL: "https://www.googleapis.com/youtube/v3",
    });

    async findPlaylistId() {
        const request = await this.api
            .get("channels", {
                params: {
                    key: this.config.apiKey,
                    id: this.config.channelId,
                    part: "contentDetails, statistics",
                },
            })

        const channel = lodash.get(request, "data.items[0]", null);

        if (!channel) {
            throw new Error("you-tube channel not found");
        }

        return lodash.get(
            channel,
            "contentDetails.relatedPlaylists.uploads"
        );
    }

    async create(data){
        await this.item.createMany('youtube-videos', [data]);
    }

    async import(pageToken = undefined) {
        const playlistId = await this.findPlaylistId();

        const requestPlaylistItems = await this.api.get("playlistItems", {
            params: {
                part: "contentDetails",
                key: this.config.apiKey,
                playlistId,
                pageToken: pageToken,
                maxResults: this.maxResults,
            },
        })

        const items = lodash.get(requestPlaylistItems, "data.items", []);

        const nextPageToken = lodash.get(
            requestPlaylistItems,
            "data.nextPageToken",
            undefined
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

        videos.forEach(video => {
            this.addJob('create', {
                sourceId: video.id,
                value: {
                    ...video,
                    src: `https://www.youtube.com/embed/${video.id}`
                },
            })
        })

        if (nextPageToken) {
            await this.import(nextPageToken)
        }

    }

}

module.exports = YoutubeProvider;