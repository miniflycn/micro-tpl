var merge = require('utils-merge')
  , explainError = require('./explain')
  , acorn = require('acorn');

function find(str, chars, begin) {
  return str.indexOf(chars, begin);
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
  this.script = [];
  this.lines = tmpl.split(/\r?\n/);
  this.analyse();
};
Analyse.prototype = {
  constructor: Analyse,
  analyse: function () {
    var i = find(this.tmpl, '<%' , this.i);
    if (~i) {
      this.i = i;
      i = find(this.tmpl, '%>', this.i);
      if (~i) {
        this.tmpl.charAt(this.i + 2) === '=' ?
          // check interpolation
          this.check(this.tmpl.substring(this.i + 3, i), i + 3) :
          // prepare for ast builder
          this.script.push([this.tmpl.substring(this.i + 2, i), this.i + 2]);
        this.i = i;
        this.analyse();
      } else {
        throw (explainError(merge({
          message: 'it need %> after <%',
          lines: this.lines,
          filename: this.filename
        }, getPos(this.tmpl, this.i)), true));
      }
    } else {
      this.checkEval();
    }
  },
  check: function (str, i) {
    if (~str.indexOf('\n')) {
      throw (explainError(merge({
        message: 'Should not use multi-lines in interpolation',
        lines: this.lines,
        filename: this.filename
      }, getPos(this.tmpl, this.i + str.indexOf('\n') + 2)), true));
    }
    try {
      var ast = acorn.parse(str);
    } catch (e) {
      throw (explainError(merge({
        message: e.toString().replace(/\(.+?\)/, ''),
        lines: this.lines,
        filename: this.filename
      }, getPos(this.tmpl, this.i + e.pos + 3)), true));
    }
    if (str.charAt(ast.end - 1) === ';') {
      throw (explainError(merge({
        message: 'Should not use ";" in interpolation',
        lines: this.lines,
        filename: this.filename
      }, getPos(this.tmpl, this.i + ast.end + 2)), true));
    } 
  },
  checkEval: function () {
    if (this.script.length) {
      var script = '';
      this.script.forEach(function (arr) {
        script += arr[0];
      });
      try {
        var ast = acorn.parse(script);
      } catch (e) {
        var pos = e.pos, num, l;
        this.script.every(function (arr, i) {
          l = arr[0].length;
          if (l < pos) {
            pos -= l;
            return true;
          } else {
            num = i;
            return false;
          }
        });
        pos = this.script[num][1] + pos;
        throw (explainError(merge({
          message: e.toString().replace(/\(.+?\)/, ''),
          lines: this.lines,
          filename: this.filename
        }, getPos(this.tmpl, pos)), true));
      }
    }
  }
}

module.exports = analyse;