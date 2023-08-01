import HyperExpress from "hyper-express";
const webserver = new HyperExpress.Server();

// Create GET route to serve 'Hello World'
webserver.get('/', (request, response) => {
    response.send(Buffer.alloc(2048, 'hello world').toString());
})

// Activate webserver by calling .listen(port, callback);
webserver.listen(9001)
.then((socket) => console.log('Webserver started on port 80'))
.catch((error) => console.log('Failed to start webserver on port 80'));