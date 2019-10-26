const request = require('@nondanee/unblockneteasemusic/request')

module.exports = (req, res) => {
	const cookie = req.headers.cookie
	let songId = (req.body || {}).songId
	return (songId && !isNaN(songId) ? 
		request('GET', 'http://music.163.com/api/cloud/pub?songId=' + songId, {cookie}).then(response => response.json()) : Promise.reject()
	)
	.catch(() => ({code: 502, data: null}))
	.then(body => res.status(200).json(body))
}