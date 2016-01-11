
var setting = {
  "hostname": process.env['GOO_HOSTNAME'],
  "route": process.env['GOO_API_ROUTE'],
  "uuid": process.env['GOO_UUID'],
  "nickname": process.env['GOO_NICKNAME'],
  "client_id": process.env['GOO_CLIENT_ID'],
  "client_secret": process.env['GOO_CLIENT_SECRET']
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
