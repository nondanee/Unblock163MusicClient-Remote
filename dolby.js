const songx = require('./songx')
const match = require('./match')
const error = require('./null')

const routes = {
  getNeteaseSongInfo: songx,
  getKuwoSongInfo: match
}

module.exports = (req, res) => {
  req.body = req.query
  const choice = Object.keys(routes).find(mark => (req.baseUrl || req.path).includes(mark))
  return (routes[choice] || error)(req, res)
}