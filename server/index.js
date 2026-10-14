// Optional read-only content API. V1 profile/history stay on the device.
const http = require('node:http');
const {categories, words} = require('../miniprogram/data/words');
function handler(req,res) {
  const url = new URL(req.url,'http://localhost');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.method!=='GET'){res.writeHead(405);res.end(JSON.stringify({error:'method_not_allowed'}));return;}
  if(url.pathname==='/health'){res.end(JSON.stringify({ok:true}));return;}
  if(url.pathname==='/api/categories'){res.end(JSON.stringify(categories));return;}
  if(url.pathname==='/api/words'){res.end(JSON.stringify(url.searchParams.has('category')?words.filter(w=>w.category===url.searchParams.get('category')):words));return;}
  res.writeHead(404);res.end(JSON.stringify({error:'not_found'}));
}
if(require.main===module) http.createServer(handler).listen(Number(process.env.PORT)||3000,'127.0.0.1',()=>console.log('Content API: http://127.0.0.1:3000'));
module.exports={handler};
