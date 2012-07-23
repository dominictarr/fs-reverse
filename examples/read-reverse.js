var fsr = require('..')
var probe = require('probe-stream')()
var es = require('event-stream')

fsr('/tmp/test-reverse')
//  .pipe(es.log('>>'))
  .pipe(probe.createProbe())
  .on('end', probe.end.bind(probe))

probe.pipe(es.log('STATS'))
