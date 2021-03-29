module.exports = {
    async render(machine) {
        const links = [
            {
                name: 'Home',
                href: '/'
            }
        ]
        return machine.render(machine.getThemePath('pages', '404.edge'), {
            pageTitle: 'Home page',
            links
        })
    }
}