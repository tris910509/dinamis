const fs = require('fs');
const http = require('http');

const dbPath = './db.json';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (url === '/api/users' && method === 'GET') {
    fs.readFile(dbPath, (err, data) => {
      if (err) throw err;
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  } else if (url === '/api/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const updatedData = JSON.parse(body);
      fs.writeFile(dbPath, JSON.stringify(updatedData, null, 2), err => {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Success' }));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

server.listen(3000, () => console.log('Server running on http://localhost:3000'));
