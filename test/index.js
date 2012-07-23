var from = require('from')
var es = require('event-stream')
var through = require('through')
var fs = require('fs')
var spec = require('stream-spec')

var fsr = require('..')
var expected = []
var actual = []
var assert = require('assert')

from(function (i) {
    if(i > 1000) return this.emit('end')
    this.emit('data', i + ' -- MAKE THE LINE LONGER.......' + new Date())
    return true
  })
  .pipe(through().on('data', function (data) {
      expected.unshift(data)
  }))
  .pipe(es.stringify())
  .pipe(fs.createWriteStream('/tmp/read-this-reverse'))
  .on('close', function () {

    var reverse = fsr('/tmp/read-this-reverse', {bufferSize: 1024})
    spec(reverse).readable().validateOnExit()

    reverse
      .pipe(es.parse())
      .pipe(es.log('>>'))
      .pipe(through().on('data', function (data) {
        actual.push(data)
      }))
      .on('end', function () {
        assert.equal(actual.length, expected.length)
        assert.deepEqual(actual, expected)
        console.log('PASSED')
      })
  }) 
