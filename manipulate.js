const request = require('@nondanee/unblockneteasemusic/src/request')

module.exports = (req, res) => {
  const { cookie } = req.headers
  const { trackIds, pid, op } = req.body || {}
  const trackId = JSON.parse(trackIds || '[]')[0]
  return Promise.resolve()
    .then(() => (!trackId || isNaN(trackId)) && Promise.reject())
    .then(() => request('POST', 'http://music.163.com/api/playlist/manipulate/tracks', { cookie, 'content-type': 'application/x-www-form-urlencoded' }, `trackIds=[${trackId},${trackId}]&pid=${pid}&op=${op}`).then(response => response.json()))
    .catch(() => ({ code: 400, data: null }))
    .then(body => res.status(200).json(body))
}