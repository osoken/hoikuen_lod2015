
d3.json(endpoint + 'search?keyword='+'保育園')
  .header('X-Access-Token', token)
  .get(function(err,dat)
  {
    if (err != null)
    {
      return;
    }
    console.log(dat)
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
