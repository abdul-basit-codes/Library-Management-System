FROM node:20-alpine

WORKDIR /app

COPY api/server.js ./api/server.js
COPY vercel.json ./
COPY index.html ./

RUN npm init -y 2>/dev/null || true

EXPOSE 3000

CMD ["node", "-e", "const http=require('http');const fs=require('fs');const s=require('./api/server.js');http.createServer((q,r)=>{if(q.url.startsWith('/api')){s(q,r)}else{let p=q.url==='/'?'index.html':q.url.slice(1);fs.readFile(p,(e,d)=>{if(e){r.writeHead(404);r.end('Not found')}else{r.writeHead(200,{'Content-Type':'text/html'});r.end(d)}})}}).listen(3000,()=>console.log('Library on :3000'))"]
