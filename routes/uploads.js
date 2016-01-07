const express = require('express')
const router = express.Router()
const path = require('path')
const gfs = require('../lib/db').fs

router.get('/', function (req, res) {
  const name = path.basename(req.originalUrl)

  const query = {
    filename: name,
    root: 'media'
  }

  function sendFile () {
    const stream = gfs.createReadStream(query)

    gfs.findOne(query, function (err, meta) {
      if (err) {
        throw err
      }

      res.writeHead(200, {
        'Content-Type': meta.contentType,
        'Content-Length': meta.length,
        'Cache-Control': 'max-age=31536000'
      })

      stream.pipe(res)
    })
  }

  gfs.exist(query, function (err, found) {
    if (err) {
      throw err
    }
    found ? sendFile() : res.send('File doesn\'t exist!')
  })
})

module.exports = router
