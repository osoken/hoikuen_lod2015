
var setting = {

};

try
{
  var f = require('./settings.json');
  Object.keys(f).forEach(function(d)
  {
    setting[d] = f[d];
  });
}
catch (e)
{
}
module.exports = setting;
