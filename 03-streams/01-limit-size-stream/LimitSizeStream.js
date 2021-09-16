const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.totalChunkLength = 0;
    this.limit = options.limit;
  }

  _transform(chunk, _, callback) {
    this.totalChunkLength += chunk.length;
    if (this.totalChunkLength > this.limit) callback(new LimitExceededError());
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
