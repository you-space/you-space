module.exports = {
    async render(machine, video) {
        const links = [
            {
                name: 'Home',
                href: '/'
            }
        ]
        
        const comments = await machine.comments(video.id)

        return machine.render(machine.getThemePath( 'pages', 'video-single.edge'), {
            pageTitle: 'Video single',
            comments,
            video,
            links
        })
    }
}