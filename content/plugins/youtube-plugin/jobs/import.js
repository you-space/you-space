const path = require( "path");
class Job {
    async execute(args){
        console.log('length :', args.length)

        if (args.length < 7) {
            await this.queue.add({
                filename: __filename,
                method: 'execute',
                managers: ['item', 'queue'],
                args: {
                    ...args,
                    length: args.length + 1
                },
                bullOptions: {
                    removeOnComplete: true
                }
            })
        }

    }
}

module.exports = Job