const match = require('@nondanee/unblockneteasemusic')

const mark = {
  'qq.com/': { key: 'QQ', name: 'QQ音乐' }, //368794
  'kuwo.cn/': { key: 'KUWO', name: '酷我音乐' }, //185670
  'migu.cn/': { key: 'MIGU', name: '咪咕音乐' }, //185678
  'kugou.com/': { key: 'KUGOU', name: '酷狗音乐' }, //190449
  'dmhmusic.com/': { key: 'BAIDU', name: '百度音乐' }, //169185
  'xiami.net/': { key: 'XIAMI', name: '虾米音乐' }, //1357785909
  'joox.com/': { key: 'JOOX', name: 'JOOX' }, //418603077
  'googlevideo.com/': { key: 'YOUTUBE', name: 'YouTube' }
}

const trace = song => {
  const target = Object.keys(mark).find(pattern => song.url.includes(pattern))
  song.source = target ? mark[target] : { key: 'UNKNOWN', name: '未知来源' }
  return song
}

module.exports = (req, res) => {
  const { id } = req.body || {}
  return Promise.resolve()
    .then(() => (!id || isNaN(id)) && Promise.reject())
    .then(() => match(id).then(trace))
    .then(song => Object.assign(song, {
      code: 200,
      id: parseInt(id),
      br: song.br || 128000,
      type: song.br === 999000 ? 'flac' : 'mp3',
      md5: song.md5 || `${Array(32).join('0')}${id}`.slice(-32),
      matchedPlatform: song.source.name,
      matchedSongName: `${id}_FROM_${song.source.key}`,
      matchedArtistName: '',
      matchedDuration: 0,
      source: undefined
    }))
    .then(song => ({ code: 200, data: [song] }))
    .then(body => res.status(200).json(body))
}