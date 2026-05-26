const http = require('http');
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'frontend', 'dist');
const port = process.env.PORT || 3000;

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

function send404(res) {
  res.statusCode = 404;
  res.end('404 Not Found');
}

const server = http.createServer((req, res) => {
  try {
    const safePath = path.normalize(req.url.split('?')[0]).replace(/^\/+/, '');
    let filePath = path.join(dist, safePath);
    if (filePath.endsWith(path.sep)) filePath = path.join(filePath, 'index.html');
    if (!filePath.startsWith(dist)) return send404(res);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
        fs.createReadStream(filePath).pipe(res);
      } else {
        // SPA fallback to index.html
        const indexPath = path.join(dist, 'index.html');
        fs.stat(indexPath, (ie, istats) => {
          if (!ie && istats.isFile()) {
            res.setHeader('Content-Type', 'text/html');
            fs.createReadStream(indexPath).pipe(res);
          } else {
            send404(res);
          }
        });
      }
    });
  } catch (e) {
    send404(res);
  }
});

server.listen(port, () => {
  console.log(`Static server serving ${dist} at http://localhost:${port}`);
});
