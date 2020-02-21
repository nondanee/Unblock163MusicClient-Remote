const { read } = require('@nondanee/unblockneteasemusic/src/request')

const land = (...path) => require('path').join.apply(null, [__dirname].concat(path))

const routes = require(land('now')).routes.map(route =>
  ({ path: route.src + '$', handler: require(land(route.dest)) })
)

const target = path => routes.find(route => (new RegExp(route.path)).test(path))

const parse = text => {
  let body = {}
  try { body = JSON.parse(text) } catch(error) { body = require('querystring').parse(text || '') }
  return body
}

const dock = (req, handler) => new Promise(resolve => {
  let status = 200
  const res = { status: code => (status = code, res), json: body => resolve({ status, body }) }
  handler(req, res).catch(error => resolve({ status: 500, body: error }))
})

const entry = (req, res) => {
  const { pathname, search } = require('url').parse(req.url)
  const route = target(pathname)
  const data = { query: parse((search || '').slice(1)), headers: req.headers, path: pathname }
  read(req)
    .then(body => dock(Object.assign(data, { body: parse(body) }), route.handler))
    .then(output => (res.writeHead(200, { 'content-type': 'application/json' }), res.end(JSON.stringify(output.body))))
    .catch()
}

module.exports = { parse, target, dock }

if (require.main === module) require('http').createServer(entry).listen(parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000))