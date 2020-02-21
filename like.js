const request = require('@nondanee/unblockneteasemusic/src/request')
const query = (...options) => request(...options).then(response => response.json())

module.exports = (req, res) => {
  const { cookie } = req.headers
  const { trackId } = req.body || {}
  let userId = 0, pid = 0
  return Promise.resolve()
    .then(() => (!trackId || isNaN(trackId)) && Promise.reject())
    .then(() => query('GET', 'http://music.163.com/api/v1/user/info', { cookie }))
    .then(body => userId = body.userPoint.userId)
    .then(() => query('GET', `http://music.163.com/api/user/playlist?uid=${userId}&limit=1`, { cookie }))
    .then(body => pid = body.playlist[0].id)
    .then(() => query('POST', 'http://music.163.com/api/playlist/manipulate/tracks', { cookie, 'content-type': 'application/x-www-form-urlencoded' }, `trackIds=[${trackId},${trackId}]&pid=${pid}&op=add`))
    .then(body => ({ code: body.code, playlistId: pid }))
    .catch(() => ({ code: 400, data: null }))
    .then(body => res.status(200).json(body))
}