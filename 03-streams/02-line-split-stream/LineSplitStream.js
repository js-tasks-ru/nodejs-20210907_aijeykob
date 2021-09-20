const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data = '';
    this.isNewLine = false;
  }

  _transform(chunk, encoding, callback) {
    const stringChunk = chunk.toString();

    const isNewLine = stringChunk.match(os.EOL);
    if (isNewLine) {
      this.isNewLine = true;
      const arrayOfString = stringChunk.split(os.EOL);
      arrayOfString.map((str, i) => {
        if (i === 0) {
          return this.push(this.data +str);
        }
        if (i === arrayOfString.length-1) {
          this.isNewLine = false;
          this.data = str;
          return;
        }
        this.push(str);
      });
      return callback();
    }
    this.isNewLine = false;
    this.data = this.data + stringChunk;
    callback();
  }

  _flush(callback) {
    if (!this.isNewLine && this.data) this.push(this.data);
    this.data = '';
    this.isNewLine = false;
    callback();
  }
}

module.exports = LineSplitStream;
