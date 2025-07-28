const express = require("express")
const cookieParser = require("cookie-parser")
const { createProxyMiddleware } = require("http-proxy-middleware")

const app = express()
const storedcookies = []
const port = 8080 // best port fr no shit

app.use(cookieParser())

const vaporontop = createProxyMiddleware({
  target: "https://vapor.my/",
  changeOrigin: true,
  onProxyReq: (proxyReq) => {
    storedcookies.forEach((cookie) => {
      proxyReq.setHeader("cookie", `${cookie.name}=${cookie.value}`)
    })
  }
})

app.use(vaporontop)

app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

