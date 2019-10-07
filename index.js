const parse = require('url').parse
const match = require('@nondanee/unblockneteasemusic')

module.exports = (req, res) => {
	(parse(req.url).pathname === '/xapi/v1/match' && req.query.id && !isNaN(req.query.id) ? 
		match(req.query.id, ['qq'])
		.then(song => [Object.assign(song, {
			code: 200,
			type: 'mp3',
			id: parseInt(req.query.id),
			md5: Array(32 - req.query.id.length + 1).join('0') + req.query.id,
			matchedPlatform: 'QQ音乐',
			matchedSongName: req.query.id + '_FROM_QQ',
			matchedArtistName: '',
			matchedDuration: false
		})])
		.catch(() => null) : Promise.resolve(null)
	)
	.then(data => ({code: data ? 200 : 404, data}))
	.then(body => res.status(200).json(body))
}