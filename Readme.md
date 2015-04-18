micro-tpl
=========

[![Build Status](https://travis-ci.org/miniflycn/micro-tpl.svg?branch=master)](https://travis-ci.org/miniflycn/micro-tpl)

> Modified from grunt-yomb(MIT) and Used in QQEDU projects.

使用
---

#### 快速入门

将模版字符串输入函数，返回结果字符串：

```javascript
var tpl = require('micro-tpl');

tpl("<p><%='hello'%></p>");
```

返回：

```javascript
function (it, opt) {
    it = it || {};
    with(it) {
        var _$out_= [];
        _$out_.push('<p>', 'hello', '</p>');
        return _$out_.join('');
    }
}
```

然后可以直接保存成`js`文件。

#### 可选参数

* strict: 严格模式，不使用with，也就是data只能从it取得。

```javascript
var tpl = require('micro-tpl');

tpl("<p><%='hello'%></p>", { strict: true });
```

* path: 如果想使用include，需要将传入的字符串对应的文件地址传入。

```javascript
var tpl = require('micro-tpl');

tpl("<p><%='hello'%></p>", { path: '/home/me/tpl.html' });
```

* safe: 进入安全模式，首先会先分析template，如果发现错误就抛错提醒(developing)。

```javascript
var tpl = require('micro-tpl');

// it will throw a error
tpl("no<%close", { safe: true, path: '/home/me/bad.html' });
```

* ret: 设置引擎编译的结果，默认是`string`，可以使用`function`，则编译后返回函数。

* type: 设置模版生成的文件类型，默认是`html`, 可以设置成`javascript`等，则编译后结果会保留换行符。

功能介绍
--------

#### 执行脚本

```html
<% 
// you javascript code here
console.log('hello world'); 
%>
```

#### 返回字符

```html
<p><%='hello'%><p>
```
会返回`<p>hello</p>`。

#### include模版

```html
<%=include('./tpl.html')(data)%>
```
会include相对于本模版的tpl.html文件，可以多重include，发生循环引用时会抛出错误。


相关插件
--------

* https://github.com/QQEDU/grunt-imweb-tpl-complie