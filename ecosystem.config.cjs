module.exports = {
    apps: [
        {
            name: 'server',
            script: './dist/server.js',
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
            },
            exec_mode : "cluster",
            instances: 4
        },
        {
            name: 'client',
            script: './dist/client.js',
            instances: 4,
            env: {
                PORT: 3000,
                NODE_ENV: 'production',
                TYPE: 'UWEBSOCKETS' // SOCKETIO | UWEBSOCKETS
            }
        }
    ],
};