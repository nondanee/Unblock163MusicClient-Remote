const request = require('@nondanee/unblockneteasemusic/request')

module.exports = (req, res) => {
	const cookie = req.headers.cookie
	const body = req.body || {}
	let trackId = JSON.parse(body.trackIds || '[]')[0]
	return (trackId && !isNaN(trackId) ? 
		request('POST', 'http://music.163.com/api/playlist/manipulate/tracks', {cookie, 'content-type': 'application/x-www-form-urlencoded'}, `trackIds=[${trackId},${trackId}]&pid=${body.pid}&op=${body.op}`).then(response => response.json()) : Promise.reject()
	)
	.catch(() => ({code: 400, data: null}))
	.then(body => res.status(200).json(body))
}