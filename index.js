/**
 * Modified from grunt-yomb
 */
'use strict';

var fs = require('fs')
  , path = require('path')
  , merge = require('utils-merge')
  , analyse = require('./lib/analyse')
  , EOL = '\n';

function build(tmpl, opt) {
  opt = opt || {};
  opt.deps = opt.deps || {};
  var res = []
    , strict = opt.strict
    , retFun = opt.ret === 'function'
    , type = opt.type || 'html';

  if (opt.safe) {
    try {
      analyse(tmpl, opt.path);
    } catch (e) {
      console.log([
        '',
        'template must have a error:',
        e
      ].join('\n'));
      throw new Error('template build error.');
    }
  } 

  tmpl.replace(/<\/script>/ig, '</s<%=""%>cript>');
  res.push([
    retFun ? undefined : "function (it, opt) {",
    "    it = it || {};",
    strict ?
      "" :
      "    with(it) {",
    "        var _$out_= [];",
    "        _$out_.push('" + tmpl
      .replace(/\r\n|\n|\r/g, "\v")
      .replace(/(?:^|%>).*?(?:<%|$)/g, function ($0) {
        return type === 'html' ?
          $0.replace(/('|\\)/g, "\\$1").replace(/[\v\t]/g, "").replace(/\s+/g, " ") :
          $0.replace(/('|\\)/g, "\\$1").replace(/ +/g, " ").replace(/[\v\t]/g, "', '\\n', '");
      })
      .replace(/<!--[\s\S]+?-->/g, '')
      .replace(/[\v]/g, EOL)
      .replace(/<%=include\((['"])(.*?)\1\)(\(.*?\))%>/g, function ($0, $1, $2, $3) {
        var file = path.join(path.dirname(opt.path), $2)
          , newOpt = merge({}, opt);
        if (opt.deps[file]) throw new Error('Do not circular reference, Please');
        newOpt.path = file;
        opt.deps[file] = true;
        return "', " + build(fs.readFileSync(file, { encoding: 'utf8' }), newOpt) + $3 + ", '";
      })
      .replace(/<%==(.*?)%>/g, "', opt.encodeHtml($1), '")
      .replace(/<%=(.*?)%>/g, "', $1, '")
      .replace(/<%(<-)?/g, "');" + EOL + "      ")
      .replace(/->(\w+)%>/g, EOL + "      $1.push('")
      .split("%>").join(EOL + "      _$out_.push('") + "');",
    "        return _$out_.join('');",
    strict ?
      "" :
      "    }",
    retFun ? undefined : "}"
  ].join(EOL).replace(/_\$out_\.push\(''\);/g, ''));

  return retFun ? 
    new Function('it', 'opt', res.join('')) : 
    res.join('');
}

module.exports = build;