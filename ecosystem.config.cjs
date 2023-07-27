module.exports = {
    apps: [
        {
            name: 'server',
            script: './dist/server.js',
            instances: 2,
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                TYPE: 'UWEBSOCKETS' // SOCKETIO | UWEBSOCKETS
            }
        },
        {
            name: 'client',
            script: './dist/client.js',
            instances: 1,
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                TYPE: 'UWEBSOCKETS' // SOCKETIO | UWEBSOCKETS
            }
        }
    ],
};