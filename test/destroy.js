var spec = require('stream-spec')

var fsr = require('..')

function r (file) {
  var reverse = fsr(file).on('end', function () {
    console.log('ENDAOENUTHOENU')
  })
  spec(reverse).readable({end: false}).validateOnExit()
  return reverse
}

r('/tmp/read-file-reversed').destroy()

var r2 = r('/tmp/read-this-reverse')
process.nextTick(function () {
  r2.destroy()
})
var l = 67
var r3 = r('/tmp/read-this-reverse')
  .on('data', function () {
    if(!--l)
      r3.destroy()
  })

