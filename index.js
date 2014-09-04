/**
 * Modified from grunt-yomb
 */
'use strict';

var fs = require('fs')
  , path = require('path')
  , merge = require('utils-merge')
  , EOL = '\n';

function build(tmpl, opt) {
  opt = opt || {};
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
      .replace(/<%=include\((['"])(.*?)\1\)(\(.*?\))%>/g, function ($0, $1, $2, $3) {
        var file = path.join(path.dirname(opt.path), $2)
          , newOpt = merge({}, opt);
        newOpt.path = file;
        return "', " + build(fs.readFileSync(file, { encoding: 'utf8' }), newOpt) + $3 + ", '";
      })
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
}

module.exports = build;