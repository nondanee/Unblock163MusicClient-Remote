const join = require('path').join
const parse = require('querystring').parse

const routes = require(join(__dirname,'now')).routes.map(route => ({path: route.src + '$', handler: require(join(__dirname, route.dest))}))

const dock = (req, handler) =>
	new Promise(resolve => {
		let status = 200
		const res = {
			status: code => (status = code, res),
			json: object => resolve({status, body: object})
		}
		handler(req, res).catch(error => resolve({status: 500, body: error}))
	})

module.exports.main = async (event, context, callback) => {
	let path = event.path.replace(event.requestContext.path, '') || '/'
	let route = routes.find(route => (new RegExp(route.path)).test(path))
	let req = {body: parse(event.body || ''), headers: event.headers}
	let output = await dock(req, route.handler)
	return output.body
}

module.exports.handler = (req, res, context) => {
	let route = routes.find(route => (new RegExp(route.path)).test(req.path))
	require('body/form')(req, (error, body) =>
		dock({body, headers: req.headers}, route.handler)
		.then(output => (res.setHeader('content-type', 'application/json'), res.send(JSON.stringify(output.body))))
	)
}