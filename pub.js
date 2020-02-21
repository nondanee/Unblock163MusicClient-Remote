const request = require('@nondanee/unblockneteasemusic/src/request')

module.exports = (req, res) => {
  const { cookie } = req.headers
  const { songId } = req.body || {}
  return Promise.resolve()
    .then(() => (!songId || isNaN(songId)) && Promise.reject())
    .then(() => request('GET', `http://music.163.com/api/cloud/pub?songId=${songId}`, { cookie }).then(response => response.json()))
    .catch(() => ({ code: 502, data: null }))
    .then(body => res.status(200).json(body))
}