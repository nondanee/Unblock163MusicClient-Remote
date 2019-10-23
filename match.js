const match = require('@nondanee/unblockneteasemusic')

const trace = song => {
	const rule = {
		'qq.com/': {key: 'QQ', name: 'QQ音乐'}, //368794
		'kuwo.cn/': {key: 'KUWO', name: '酷我音乐'}, //185670
		'migu.cn/': {key: 'MIGU', name: '咪咕音乐'}, //185678
		'kugou.com/': {key: 'KUGOU', name: '酷狗音乐'}, //190449
		'dmhmusic.com/': {key: 'BAIDU', name: '百度音乐'}, //169185
		'xiami.net/': {key: 'XIAMI', name: '虾米音乐'}, //1357785909
		'joox.com/': {key: 'JOOX', name: 'JOOX'} //418603077
	}
	let target = Object.keys(rule).find(pattern => song.url.includes(pattern))
	song.source = target ? rule[target] : {key: 'UNKNOWN', name: '未知来源'}
	return song
}

module.exports = (req, res) => {
	let id = (req.body || {}).id
	return (id && !isNaN(id) ?
		match(id)
		.then(trace)
		.then(song => [Object.assign(song, {
			code: 200,
			type: 'mp3',
			id: parseInt(id),
			br: song.br || 128000,
			md5: song.md5 || Array(32 - id.length + 1).join('0') + id,
			matchedPlatform: song.source.name,
			matchedSongName: id + '_FROM_' + song.source.key,
			matchedArtistName: '',
			matchedDuration: false,
			source: undefined
		})])
		.catch(() => null) : Promise.resolve(null)
	)
	.then(data => ({code: data ? 200 : 404, data}))
	.then(body => res.status(200).json(body))
}