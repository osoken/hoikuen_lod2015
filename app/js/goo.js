
var searchGoo = function(searchWord)
{
  d3.json(endpoint + 'search?keyword='+searchWord)
    .header('X-Access-Token', token)
    .get(function(err,dat)
    {
      if (err != null)
      {
        return;
      }
      console.log(dat)
      d3.select('div#goo ul').selectAll('li').remove();
      var lis = d3.select('div#goo ul')
        .selectAll('li')
        .data(dat.items)
        .enter().append('li')
        .on('click', function(d)
        {
          d3.event.preventDefault();
          d3.select(this)
            .select('span')
            .text(function(d){return d.body;});
        });
      lis.append('div')
        .style('background-color', '‪#‎91c3c9‬')
        .append('a').text(function(d){return d.title;}).attr('href','#');
      lis.append('span');
    });

}

searchGoo('保育園');
