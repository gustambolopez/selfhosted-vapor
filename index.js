const express = require('express');
const cookies = require('cookie-parser');
const proxy = require('http-proxy-middleware').createProxyMiddleware;

const app = express();

app.use(cookies());

const handler = proxy({
  target: 'https://vapor.my',
  changeOrigin: true, 
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers.cookie) {
      proxyReq.setHeader('cookie', req.headers.cookie);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err); 
    res.writeHead(500, {
      'Content-Type': 'text/html' 
    });
    res.end('<h1>500 </h1><p>Interal error..</p>');
  }
});

app.use(handler);

module.exports = app;
