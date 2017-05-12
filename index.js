var fs = require('fs')
var from = require('from')

module.exports = function (file, opts) {
  var stream, soFar = ''
  var matcher = opts && opts.matcher || '\n'
  var bufferSize = opts && opts.bufferSize || 1024 * 64
  var mode = opts && opts.mode || 438 // 0666
  var flags = opts && opts.flags || 'r'
  var fd = opts && opts.fd
  
  function onError (err) {
    stream.emit('error', err)
    stream.destroy()
  }

  var stat, position

  if(!/rx?/.test(flags)) throw new Error("only flags 'r' and 'rx' are allowed")

  stream = from(function (i, next) {
    if(stream.destroyed) return
    if(i === 0) {
      var c = 2
      fs.stat(file, function (err, _stat) {
        if(err) return onError(err)
        stat = _stat
        position = stat.size
        if(!--c) read()
      })
      if (fd) {
        stream.emit('open')
        if(!--c) read()
      } else {
        fs.open(file, flags, mode, function (err, _fd) {
          fd = _fd
          stream.emit('open')
          if(!--c) read()
        })
      }

    } else read()

    function read () {
      if(stream.destroyed) return
      var length = Math.min(bufferSize, position)
      var b = new Buffer(length)
      position = position - length
      fs.read(fd, b, 0, length, position, function (err) {
        if(err) return onError(err)
        data(b)
        if(position > 0) return next()
        stream.emit('data', soFar)
        stream.emit('end')
        stream.destroy()
      })
    }

    function data (buffer) {
      soFar = buffer + soFar
      var array = soFar.split(matcher)
      soFar = array.shift()
      while(array.length) 
        stream.emit('data', array.pop())
    }
  })

  stream.destroy = function () {
    if(stream.destroyed) return
    stream.readable = false
    stream.destroyed = true
    stream.ended = true
    function close () {
      if (typeof (opts && opts.fd) !== 'number') {
        fs.close(fd, function (err) {
          if(err) onError(err)
          stream.emit('close')
        })
      }
    }
    if(!stream.started) return stream.emit('close')//allow for destroy on first tick.
    if(!fd) stream.once('open', close) //destroy before file opens.
    else close()  //any other situation.
  }
  return stream
}
