const liveServer = require('live-server');

const params = {
    port: 8888,
    root: 'public',
    open: false,
};

liveServer.start(params);