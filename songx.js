const request = require('@nondanee/unblockneteasemusic/request')
const encryptRequest = require('@nondanee/unblockneteasemusic/crypto').linuxapi.encryptRequest

module.exports = (req, res) => {
	const body = (req.body || {})
	let id = parseInt(body.id) || 0
	let br = parseInt(body.br) || 320000
	let query = encryptRequest('http://music.163.com/api/song/enhance/player/url', {ids: [id], br})
	return (id ? 
		request('POST', query.url, {'cookie': process.env['COOKIE'] || null, 'content-type': 'application/x-www-form-urlencoded'}, query.body).then(response => response.json()) : Promise.reject()
	)
	.catch(() => ({code: 404, data: null}))
	.then(body => res.status(200).json(body))
}