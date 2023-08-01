import { App } from "uwebsockets.js";
const PORT = 3000;

App()
.get('/', (res, req) => {
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes')
  .end('hello world');
})
.get('/hello', (res, req) => {

  /* It does Http as well */
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes')
  .end(Buffer.alloc(2048, 'hello world').toString());
  // .end(Buffer.alloc(2048, 'hello world').toString());
  
}).listen(PORT, (listenSocket) => {

  if (listenSocket) {
    console.log(`Listening to port ${PORT}`);
  }
  
});