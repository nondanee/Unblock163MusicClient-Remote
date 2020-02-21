const request = require('@nondanee/unblockneteasemusic/src/request')
const encrypt = require('@nondanee/unblockneteasemusic/src/crypto').linuxapi.encryptRequest

module.exports = (req, res) => {
  let { id, br } = req.body || {}
  id = parseInt(id) || 0
  br = parseInt(br) || 320000
  return Promise.resolve()
    .then(() => !id && Promise.reject())
    .then(() => encrypt('http://music.163.com/api/song/enhance/player/url', { ids: [id], br }))
    .then(({ url, body }) => request('POST', url, { 'cookie': process.env.COOKIE || null, 'content-type': 'application/x-www-form-urlencoded' }, body).then(response => response.json()))
    .catch(() => ({ code: 404, data: null }))
    .then(body => res.status(200).json(body))
}