const express = require("express");
const cookieParser = require("cookie-parser");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const storedCookies = [];
const PORT = 8080;

app.use(cookieParser());

const customProxy = createProxyMiddleware({
  target: "https://vapor.my/",
  changeOrigin: true,
  onProxyReq: (proxyReq) => {
    storedCookies.forEach((cookie) => {
      proxyReq.setHeader("cookie", `${cookie.name}=${cookie.value}`);
    });
  }
});

app.use((req, res, next) => {
  const ignoredPaths = ["/chat-old.html"];

  if (!ignoredPaths.includes(req.url)) {
    customProxy(req, res, next);
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
