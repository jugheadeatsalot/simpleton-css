const StaticServer = require('static-server');

const {dirs} = require('./meta');

const server = new StaticServer({
    rootPath: (process.env.NODE_ENV === 'production') ? dirs.docs : dirs.docsDev,
    port: 8888,
});

server.start(() => {
    console.log(`Server listening on port ${server.port}`);
});
