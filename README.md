# You-space

Video platform opensource to be a content center for content creators.

**Important:** the ideia is not replace mainstream platforms like youtube, but insted give the creators a more freedom way to share your content with your public.

⚠️ Warning: under development

## Getting started

### Requirements

- Nodejs
- Postgres
- Redis
- YoutubeApi key and channelId (optinal)

### Database

1 - Go to /server folder and install the dependences with `npm install`  
2 - Create a .env with the POSTGRES_URL variable ponting to your database  
3 - Run `node ace migrate:run` to setup the database  
4 - Run `node ace db:seed` to create default data required by the system  
5 - Redis will automatic connect to default port but you can customize this by the vars REDIS_CONNECTION, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD

### Serve

1 - With the databse ready you can run the command `node ace serve`  
2 - The server should start and give you the url that you will need to use in fron-end

### Fron-end

1 - Go to /client folder and install the dependences with `yarn`  
2 - You need quasar/cli to be able to run the project, install him with `npm install -g @quasar/cli`  
3 - Now create a .env for the client folder with var API_URL that is the url that server has started  
4 - Then run `quasar dev` and the app should start in localhost

## Quick start

```
Default admin user
username: admin
password: ys-123456
```

### Origins

The system work with the concept of "origins" that is of where the content of site will come, a origin can be a youtube channel or a local systemfile of the server.  
To add a new origin you have to go to the list of origins in the admin dashboard, select youtube as type and give the apiKey and channelId.
After that you can back to the video list and see the videos that came from the created origin.

### YoutubeApi

The system spend like 2 cotas for each videos page and 1 for individual video comments page, but once the videos is in redis cache this will not be spended anymore.

## References

- [Node](https://nodejs.org/en/) - Server javascript
- [Typescript](https://www.typescriptlang.org/) - Typescript language
- [Adonis](https://preview.adonisjs.com/blog/introducing-adonisjs-v5/) - Framework of api
- [Quasar](https://next.quasar.dev/) - Front-end framework with vuejs

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
