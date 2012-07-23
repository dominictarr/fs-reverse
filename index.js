var fs = require('fs')
var from = require('from')

module.exports = function (file, matcher) {
  var stream, soFar = ''
  matcher = matcher || '\n'
  function onError (err) {
    stream.emit('error', err)
    stream.destroy()
  }
  var stat, fd, position
  return stream = from(function (i, next) {
    console.log(position)
    if(position === 0)
      return stream.emit('data', soFar), stream.emit('end')
    if(i === 0) {
      var c = 2
      fs.stat(file, function (err, _stat) {
        if(err) return onError(err)
        stat = _stat
        position = stat.size
        if(!--c) read()
      })
      fs.open(file, 'r', function (err, _fd) {
        fd = _fd
        if(!--c) read()
      })

    } else read()

    function read () {
      var length = position > stat.blksize ? stat.blksize : position
      console.log('length:', length, 'position:', position, 'size:', stat.size)
      var b = new Buffer(length)
      position = position - length
      fs.read(fd, b, 0, length, position, function (err) {
        if(err) return onError(err)
        data(b)
        if(position > 0) return next()
        stream.emit('data', soFar)
        stream.emit('end')
      })
    }

    function data (buffer) {
      soFar = buffer + soFar
      var array = soFar.split(matcher)
      console.log(array)
      soFar = array.shift()
      while(array.length) 
        stream.emit('data', array.pop())
    }
  })
}
