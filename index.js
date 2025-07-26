const express = require('express');
const cookies = require('cookie-parser');
const proxy = require('http-proxy-middleware').createProxyMiddleware;

const app = express();

app.use(cookies());

const handler = proxy({
  target: 'https://vapor.my',
  changeOrigin: true, // Important for the target to recognize the host correctly
  onProxyReq: (proxyReq, req, res) => {
    // This forwards the client's original cookies to the target
    if (req.headers.cookie) {
      proxyReq.setHeader('cookie', req.headers.cookie);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // You can inspect or modify response headers from the target here if needed.
    // For a straightforward proxy, no changes are often necessary.
  },
  onError: (err, req, res) => {
    // This block handles errors that occur during the proxy operation itself.
    // We send a generic 500 error here, but the browser won't see "random characters"
    // from the proxied site if the proxy fails.
    console.error('Proxy error:', err); // Log the actual error for debugging
    res.writeHead(500, {
      'Content-Type': 'text/html' // Fallback for error page
    });
    res.end('<h1>500 - Proxy Error</h1><p>Something went wrong trying to reach the target website.</p>');
  }
});

app.use(handler);

module.exports = app;
