const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({extended: false}))

require(path.join(__dirname, 'now')).routes.forEach(route =>
  app.use(new RegExp(route.src), require(path.join(__dirname, route.dest)))
)

app.listen(parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000))