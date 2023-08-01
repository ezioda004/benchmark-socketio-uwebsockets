import { App } from "uwebsockets.js";

App().get('/hello', (res, req) => {

  /* It does Http as well */
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end(Buffer.alloc(2048, 'hello world').toString());
  
}).listen(9001, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 9001');
  }
  
});