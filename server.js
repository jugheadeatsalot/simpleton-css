const StaticServer = require('static-server');

const server = new StaticServer({
    rootPath: (process.env.NODE_ENV === 'production') ? 'docs' : 'docs-dev',
    port: 8888,
});

server.start(() => {
    console.log(`Server listening on port ${server.port}`);
});
