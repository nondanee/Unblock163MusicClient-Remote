const match = require('@nondanee/unblockneteasemusic')

module.exports = (req, res) => {
	let id = (req.body || {}).id
	return (id && !isNaN(id) ?
		match(id, ['qq'])
		.then(song => [Object.assign(song, {
			code: 200,
			type: 'mp3',
			id: parseInt(id),
			br: song.br || 128000,
			md5: Array(32 - id.length + 1).join('0') + id,
			matchedPlatform: 'QQ音乐',
			matchedSongName: id + '_FROM_QQ',
			matchedArtistName: '',
			matchedDuration: false
		})])
		.catch(() => null) : Promise.resolve(null)
	)
	.then(data => ({code: data ? 200 : 404, data}))
	.then(body => res.status(200).json(body))
}