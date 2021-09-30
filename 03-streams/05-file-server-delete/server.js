const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':
      if (pathname.match(/\//)) {
        res.statusCode = 400;
        return res.end('Path cannot be nested');
      }
      fs.unlink(filepath, (err) => {
        if (!err) return res.end('file deleted');
        if (err.code === 'ENOENT') {
          res.statusCode = 404;
          return res.end('file not found');
        }
        res.statusCode = 500;
        res.end('internal error');
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
