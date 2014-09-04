var analyse = require('../lib/analyse')
  , fs = require('fs')
  , path = require('path');

describe('analyse', function () {
  it('should able to check no close tempalate', function () {
    analyse.bind(
      null,
      fs.readFileSync(
        path.join(__dirname, './bad/noclose.html'), { encoding: 'utf8' }
      )
    ).should.throw();
  });
});