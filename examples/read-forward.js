var es = require('event-stream')
var fs = require('fs')
var probe = require('probe-stream')()
fs.createReadStream('/tmp/test-reverse')
  .pipe(es.split('\n'))
  //.pipe(es.mapSync(function (b) {
  //  return ''+b
  //}))
  .pipe(probe.createProbe())
  .on('end', probe.end.bind(probe))
//  .pipe(es.log('>>'))

probe.pipe(es.log('STATS'))
