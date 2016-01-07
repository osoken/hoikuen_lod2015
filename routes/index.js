var express = require('express');
var router = express.Router();

var https = require('https');

var setting = require('../settings');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/goo/search', function(req, res, next) {
  console.log(req.query.keyword);
  var options = {
    host: setting.hostname,
    path: setting.route + 'search?keyword=' + encodeURI(req.query.keyword),
    rejectUnauthorized : false,
    headers: { 'X-Access-Token': setting.token }
  };
  var req2 = https.request(options, function(res2)
  {
    var body = '';
    res2.on('data', function (chunk) {
      body += chunk;
    });
    res2.on('end', function() {
      console.log(body);
      try {
        body = JSON.parse(body);
      } catch (e) {
        e.status = 500;
        return next(e);
      }
      res.json(body);
    })
  });
  req2.on('error', function(e) {
    return next(e);
  });
  req2.end();
})

module.exports = router;
