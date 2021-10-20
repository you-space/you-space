module.exports = {
  src: {
    type: 'string',
  },
  title: {
    type: 'string',
    serialize: ({ snippet }) => snippet.title,
  },
  description: {
    type: 'string',
    serialize: ({ snippet }) => snippet.description,
  },
  thumbnail: {
    type: 'object',
    serialize: ({ snippet }) => ({
      src: snippet.thumbnails.high.url,
      alt: snippet.title,
    }),
  },
  publishedAt: {
    type: 'date',
    serialize: ({ snippet }) => snippet.publishedAt,
  },
  viewCount: {
    type: 'number',
    serialize: ({ statistics }) => statistics.viewCount,
  },
  likeCount: {
    type: 'number',
    serialize: ({ statistics }) => statistics.likeCount,
  },
}
