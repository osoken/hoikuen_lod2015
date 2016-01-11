var express = require('express');
var router = express.Router();

var https = require('https');

var setting = require('../settings');
var goo = require('../goo');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next)
{
  goo.getToken(function(err,dat)
  {
    console.log(err);
    console.log(dat);
    res.json(dat || {});
  })
});

router.get('/api/goo/search', function(req, res, next) {
  goo.search(req.query, function(e,d)
  {
    if (e != null)
    {
      return next(e);
    }
    res.json(d);
  });
})

module.exports = router;
