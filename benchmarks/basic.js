'use strict'

var bench = require('fastbench')
var syncthrough = require('../')
var through2 = require('through2')
var data = Buffer.from('hello')

function write (i, s) {
  for (; i < 1000; i++) {
    if (!s.write(data)) {
      i++
      break
    }
  }

  if (i < 1000) {
    s.once('drain', write.bind(undefined, i, s))
  } else {
    s.end()
  }
}

function benchThrough2 (done) {
  var stream = through2()
  stream.on('data', noop)
  stream.on('end', done)

  write(0, stream)
}

function benchSyncThrough (done) {
  var stream = syncthrough()

  stream.on('data', noop)
  stream.on('end', done)

  write(0, stream)
}

function noop () {}

var run = bench([
  benchThrough2,
  benchSyncThrough
], 10000)

run(run)
