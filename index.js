const resolvePath = (...path) => require('path').join.apply(null, [__dirname].concat(path))

const bodyParse = text => {
  let body = {}
  try { body = JSON.parse(text) } catch(error) { body = require('querystring').parse(text || '') }
  return body
}

const routes = require(resolvePath('now')).routes.map(route =>
  ({ path: route.src + '$', handler: require(resolvePath(route.dest)) })
)

const target = path => routes.find(route => (new RegExp(route.path)).test(path))

const dock = (req, handler) => new Promise(resolve => {
  let status = 200
  const res = { status: code => (status = code, res), json: body => resolve({ status, body }) }
  handler(req, res).catch(error => resolve({ status: 500, body: error }))
})

module.exports.main = async (event, context, callback) => {
  const path = event.path.replace(event.requestContext.path, '') || '/'
  const route = target(path)
  const req = { body: bodyParse(event.body), headers: event.headers, query: event.queryString, path }
  console.log('req', req)
  const output = await dock(req, route.handler)
  return output.body
}

module.exports.handler = (req, res, context) => {
  const { path, headers } = req
  const route = target(path)
  require('raw-body')(req, (error, body) =>
    dock({ body: bodyParse(body), headers, query: req.queries, path }, route.handler)
      .then(output => (res.setHeader('content-type', 'application/json'), res.send(JSON.stringify(output.body))))
  )
}