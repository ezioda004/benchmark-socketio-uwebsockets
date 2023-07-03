module.exports = {
    apps: [
        {
            name: 'server',
            script: './dist/server.js',
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                TYPE: 'SOCKETIO' // SOCKETIO | UWEBSOCKETS
            }
        },
        {
            name: 'client',
            script: './dist/client.js',
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                TYPE: 'SOCKETIO' // SOCKETIO | UWEBSOCKETS
            }
        }
    ],
};