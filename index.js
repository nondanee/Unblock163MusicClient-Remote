const { parse, target, dock } = require('./server')

module.exports.main = async (event, context, callback) => {
  const path = event.path.replace(event.requestContext.path, '') || '/'
  const route = target(path)
  const req = { body: parse(event.body), headers: event.headers, query: event.queryString, path }
  console.log('req', req)
  const output = await dock(req, route.handler)
  return output.body
}

module.exports.handler = (req, res, context) => {
  const { path, headers } = req
  const route = target(path)
  require('raw-body')(req, (error, body) =>
    dock({ body: parse(body), headers, query: req.queries, path }, route.handler)
      .then(output => (res.setHeader('content-type', 'application/json'), res.send(JSON.stringify(output.body))))
  )
}