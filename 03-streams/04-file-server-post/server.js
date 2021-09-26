const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

const LimitSizeStream = require('./LimitSizeStream');

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (pathname.match(/\//)) {
        res.statusCode = 400;
        return res.end('Path cannot be nested');
      }
      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      const limitSizeStream = new LimitSizeStream({limit: 10000});
      req.pipe(limitSizeStream).pipe(writeStream);
      writeStream.on('close', ()=> {
        res.statusCode = 201;
        res.end('file saved');
      });
      limitSizeStream.on('error', (error)=> {
        if (error.code === 'LIMIT_EXCEEDED') {
          res.statusCode = 413;
          res.end('file is too big');
          writeStream.destroy();
          return fs.unlink(filepath, (error)=>{});
        }
        res.statusCode = 500;
        writeStream.destroy();
        res.end('internal error');
      });
      writeStream.on('error', (error)=> {
        if (error.code === 'EEXIST') {
          res.statusCode = 409;
          writeStream.destroy();
          return res.end('file already exist');
        }
        res.statusCode = 500;
        writeStream.destroy();
        res.end('internal error');
      });
      req.on('aborted', ()=> {
        limitSizeStream.destroy();
        writeStream.destroy();
        fs.unlink(filepath, (err) => {});
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
