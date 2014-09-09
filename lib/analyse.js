var merge = require('utils-merge')
  , explainError = require('./errors');

function find(str, open, begin) {
  return str.indexOf(open ? '%>' : '<%', begin);
}

function getPos(str, i) {
  var lines = str.substring(0, i).split(/\r?\n/);
  return {
    line: lines.length,
    column: lines[lines.length - 1].length
  };
}

function analyse(tmpl, filename) {
  return new Analyse(tmpl, filename);
}

function Analyse(tmpl, filename) {
  this.tmpl = tmpl;
  this.filename = filename;
  this.i = undefined;
  this.open = false;
  this.analyse();
};
Analyse.prototype = {
  constructor: Analyse,
  analyse: function () {
    var i = find(this.tmpl, this.open, this.i);
    if (i !== -1) {
      this.open = !this.open;
      this.i = i;
      this.analyse();
    } else {
      if (this.open) {
        throw (explainError(merge({
          message: 'it need %> after <%',
          lines: this.tmpl.split(/\r?\n/),
          filename: this.filename
        }, getPos(this.tmpl, this.i)), true));
      }
    }
  }
}

module.exports = analyse;