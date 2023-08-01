import HyperExpress from "hyper-express";
const webserver = new HyperExpress.Server();
const PORT = 3000;

// Create GET route to serve 'Hello World'
webserver
.get('/', (request, response) => {
    response.send(Buffer.alloc(2048, 'hello world').toString());
})

webserver
.get('/hello', (request, response) => {
    response.send(Buffer.alloc(2048, 'hello world').toString());
})

// Activate webserver by calling .listen(port, callback);
webserver.listen(PORT)
.then((socket) => console.log(`Webserver started on port ${PORT}`))
.catch((error) => console.log(`Failed to start webserver on port ${PORT}`));