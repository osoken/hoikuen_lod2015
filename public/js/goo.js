
!(function()
{
  var goo = {};
  goo.searchGoo = function(query)
  {
    d3.json('/api/goo/search?' + Object.keys(query).reduce(function(a,k){a.push(k+'='+encodeURIComponent(query[k]));return a},[]).join('&'), function(err,dat)
    {
      if (err != null)
      {
        return;
      }
      d3.select('div#goo ul').selectAll('li').remove();
      var lis = d3.select('div#goo ul')
        .selectAll('li')
        .data(dat.items)
        .enter().append('li')
        .on('click', function(d)
        {
          d3.event.preventDefault();
          d3.select(this)
            .select('a')
            .text(function(d){return d.body;})
            .attr('href', function(d){return 'http://oshiete.goo.ne.jp/qa/' + d.question_id + '.html';})
            .attr('target','_blank');
          d3.select(this).on('click', function(d) {return;});
        });
      lis.append('div')
        .style('background-color', '‪#‎91c3c9‬')
        .append('a').text(function(d){return d.title;}).attr('href','#');
      lis.append('a');
    });
  }
  if (typeof define === "function" && define.amd) define(goo); else if (typeof module === "object" && module.exports) module.exports = goo;
  this.goo = goo;
}());
