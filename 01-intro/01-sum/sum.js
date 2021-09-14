module.exports = (a, b) => {
  return (typeof a === 'number' &&
    isFinite(a) &&
    Math.floor(a) === a) && (typeof b === 'number' &&
        isFinite(b) &&
        Math.floor(b) === b) ?
        a+b:
        (function() {
          throw new TypeError;
        })();
};
