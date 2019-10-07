const request = require('@nondanee/unblockneteasemusic/request')

module.exports = (req, res) => {
	const cookie = req.headers.cookie
	let pid, userId, trackId = (req.body || {}).trackId
	return (trackId && !isNaN(trackId) ? 
		request('GET', 'http://music.163.com/api/v1/user/info', {cookie}).then(response => response.json())
		.then(body => {
			userId = body.userPoint.userId
			return request('GET', `http://music.163.com/api/user/playlist?uid=${userId}&limit=1`, {cookie}).then(response => response.json())
		})
		.then(body => {
			pid = body.playlist[0].id
			return request('POST', 'http://music.163.com/api/playlist/manipulate/tracks', {cookie, 'content-type': 'application/x-www-form-urlencoded'}, `trackIds=[${trackId},${trackId}]&pid=${pid}&op=add`).then(response => response.json())
		})
		.then(body => ({code: body.code, playlistId: pid})) : Promise.reject()
	)
	.catch(() => ({code: 400, data: null}))
	.then(body => res.status(200).json(body))
}