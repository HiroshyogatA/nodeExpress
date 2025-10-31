const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: '.', // Serve arquivos da pasta atual
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Logs
server.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

// Redirecionar raiz para index.html
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.use(router);

server.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
  console.log('📁 Página inicial: http://localhost:3000/index.html');
  console.log('👥 API: http://localhost:3000/usuarios');
});