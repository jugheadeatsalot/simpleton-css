const StaticServer = require('static-server');

const {dirs} = require('./meta');

const rootPath = (process.env.NODE_ENV === 'production') ? dirs.docs : dirs.docsDev;

const server = new StaticServer({
    rootPath,
    port: 8888,
    followSymlink: true,
    templates: {
        notFound: `${rootPath}/404.html`,
    },
});

server.start(() => {
    console.log(`Server listening on port ${server.port}`);
});
