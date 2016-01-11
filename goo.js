
var setting = require('./settings');

var https = require('https');
var querystring = require('querystring');

var goo = {};

var _readOnlyToken = null;
var _readWriteToken = null;

var _getReadOnlyToken = function(cb)
{
  if (_readOnlyToken != null)
  {
    return cb(null, _readOnlyToken);
  }
  if (setting.hostname === void 0 || setting.route === void 0 || setting.client_id === void 0 || setting.client_secret === void 0)
  {
    cb(new Error('invalid setting'), null);
  }
  var d = {'client_id': setting.client_id, 'client_secret': setting.client_secret};
  var options = {
    host: setting.hostname,
    path: setting.route + '/auth/access_token/create',
    rejectUnauthorized : false,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };
  var req = https.request(options, function(res)
  {
    var body = '';
    res.on('data', function (chunk) {
      body += chunk;
    });
    res.on('end', function() {
      if (res.statusCode !== 201)
      {
        var err = new Error(res.statusMessage);
        err.status = res.statusCode;
        return cb(err, null);
      }
      try {
        body = JSON.parse(body);
        _readOnlyToken = body.access_token;
      } catch (e) {
        e.status = 500;
        return cb(e, null);
      }
      return cb(null, _readOnlyToken);
    })
  });
  req.on('error', function(e) {
    return cb(e,null);
  });
  req.write(querystring.stringify(d));
  req.end();
}

goo.search = function(query, cb)
{
  if (query.keyword === void 0)
  {
    var err = new Error('keyword required');
    err.status = 400;
    return cb(err, null);
  }
  var q = {
    keyword: query.keyword,
  };
  ['category_id', 'status', 'page', 'sort'].forEach(function(d){
    if (query[d] !== void 0)
    {
      q[d] = query[d];
    }
  });
  _getReadOnlyToken( function(err, token)
  {
    if (err != null)
    {
      return cb(err, null);
    }
    var options = {
      host: setting.hostname,
      path: setting.route + '/search?' + querystring.stringify(q),
      rejectUnauthorized : false,
      headers: { 'X-Access-Token': token }
    };
    var req = https.request(options, function(res)
    {
      var body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function() {
        if (res.statusCode !== 200)
        {
          var err = new Error(res.statusMessage);
          err.status = res.statusCode;
          return cb(err, null);
        }
        try {
          body = JSON.parse(body);
        } catch (e) {
          e.status = 500;
          return cb(e, null);
        }
        return cb(null, body);
      })
    });
    req.on('error', function(e) {
      return cb(e, null);
    });
    req.end();
  });
}

module.exports = goo;
