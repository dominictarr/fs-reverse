var from = require('from')
var es = require('event-stream')
var fs = require('fs')
var probe = require('probe-stream')()

var fsr = require('..')
var expected = []
var actual = []
var assert = require('assert')

from(function (i) {
    if(i > 100000) return this.emit('end')
    this.emit('data',{
      row: i,
      timestamp: Date.now(),
      date: new Date(),
      array: [Math.random(), Math.random(), Math.random()],
      object: {
        A: Math.random(),
        B: Math.random(),
        C: Math.random()
      }
    })
    return true
  })
  .pipe(es.stringify())
  .pipe(probe.createProbe())
  .on('end', probe.end.bind(probe))
  .pipe(fs.createWriteStream('/tmp/test-reverse'))

probe.pipe(es.log('STATS'))
