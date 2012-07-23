# fs-reverse

read a file backwards.

``` js
var fsR = require('fs-reverse')

fsR(filename, opts)
  .pipe(writableStream)
```

the file will be read from the tail end, split into lines, and emitted in reverse order.

default options are:

``` js
{ flags: 'r' //may only be 'r' or 'rx'
, mode: 0666
, bufferSize: 64 * 1024
, matcher: '\n' //may be a string or regular expression.
}
```

except for `matcher`, the options are a subset of `createReadStream` in [fs](http://nodejs.org/docs/api/fs.html)

If matcher is a regular expression with a group, like `/(\r?\n)/`
then the split pattern will be perserved and emitted as a chunk.

# License

MIT / Apache 2
