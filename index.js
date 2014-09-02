/**
 * Reference from grunt-yomb
 */
'use strict';
var EOL = '\n';

module.exports = function (tmpl, opt) {
  var res = [];
  tmpl.replace(/<\/script>/ig, '</s<%=""%>cript>');
  res.push([
    "function (it, opt) {",
    "    it = it || {};",
    "    with(it) {",
    "        var _$out_= [];",
    "        _$out_.push('" + tmpl
      .replace(/\r\n|\n|\r/g, "\v")
      .replace(/(?:^|%>).*?(?:<%|$)/g, function($0) {
        return $0.replace(/('|\\)/g, "\\$1").replace(/[\v\t]/g, "").replace(/\s+/g, " ")
      })
      .replace(/[\v]/g, EOL)
      .replace(/<%==(.*?)%>/g, "', opt.encodeHtml($1), '")
      .replace(/<%=(.*?)%>/g, "', $1, '")
      .replace(/<%(<-)?/g, "');" + EOL + "      ")
      .replace(/->(\w+)%>/g, EOL + "      $1.push('")
      .split("%>").join(EOL + "      _$out_.push('") + "');",
    "      return _$out_.join('');",
    "    }",
    "}"
  ].join(EOL).replace(/_\$out_\.push\(''\);/g, ''));

  return res.join('');
};