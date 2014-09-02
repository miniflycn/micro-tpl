var tpl = require('../')
  , fs = require('fs')
  , path = require('path');

function call(foo, it, opt) {
  return eval('(' + foo + ')(it, opt)');
}

describe('micro-tpl', function () {
  it('should able to build a template have a variable "it"', function () {
    var foo = tpl(
      fs.readFileSync(path.join(__dirname, './tpl/it.html'), 
      { encoding: 'utf8' })
    );
    call(foo, { say: 'Hello, world!' }).should.equal('<p>Hello, world!</p>');
  });

  it('should able to build a template have a variable "say"', function () {
    var foo = tpl(
      fs.readFileSync(path.join(__dirname, './tpl/render.html'), 
      { encoding: 'utf8' })
    );
    call(foo, { say: 'Hello, world!' }).should.equal('<p>Hello, world!</p>');
  });

  it('should able to use loop', function () {
    var foo = tpl(
      fs.readFileSync(path.join(__dirname, './tpl/loop.html'), 
      { encoding: 'utf8' })
    );
    call(foo, { l: 3 }).should.equal('<p>1</p><p>2</p><p>3</p>');
  });
});