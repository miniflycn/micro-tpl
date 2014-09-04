function find(str, open, begin) {
  return str.indexOf(open ? '%>' : '<%', begin);
}

function getLine(str, i) {
  var lines = str.substring(0, i).split(/\r?\n/);
  return lines.length + ' line ' + lines[lines.length - 1].length + ' column';
}

function analyse(tmpl) {
  return new Analyse(tmpl);
}

function Analyse(tmpl) {
  this.tmpl = tmpl;
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
      this.i = i + 2;
      this.analyse();
    } else {
      if (this.open) throw ('it need %> after ' + getLine(this.tmpl, this.i + 2));
    }
  }
}

module.exports = analyse;