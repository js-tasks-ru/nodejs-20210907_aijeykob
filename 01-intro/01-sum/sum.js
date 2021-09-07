module.exports = (a, b) => !Number.isInteger(a) || !Number.isInteger(b) ?
    (function() {
      throw new TypeError;
    })():
    a+b;
