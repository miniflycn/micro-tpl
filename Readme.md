micro-tpl
=========

> Modified from grunt-yomb(MIT) and Used in QQEDU projects.

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
会include相对于本模版的tpl.html文件