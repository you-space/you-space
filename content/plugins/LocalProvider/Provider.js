class LocalProvider {
    create(){
        this.service.create({
            'teste': 'Hello'
        })
    }
}

module.exports = LocalProvider