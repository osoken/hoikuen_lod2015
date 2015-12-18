
var color = [
  '#018894',
  '‪#‎22a1a4‬',
  '‪#‎91c3c9‬',
  '‪#‎51bc8a‬',
  '‪#‎5d6066‬'
];

var height = d3.select('html').node().getBoundingClientRect().height;
var width = d3.select('html').node().getBoundingClientRect().width * 0.5;

var map = new L.Map(d3.select('div#map').style('width', width + 'px' ).node()).setView([35.678707, 139.739143], 11);
var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var svgLayer = d3.select(map.getPanes().overlayPane).append('svg').attr('class', 'leaflet-zoom-hide');
var lineLayer = svgLayer.append('g');
var plotLayer = svgLayer.append('g');

var updatePosition = function(d)
{
  d.pos = map.latLngToLayerPoint(new L.LatLng(d.latitude, d.longitude));
  d3.select(this).attr( {cx: d.pos.x, cy: d.pos.y } );
}

var reset = function()
{
  var bounds = map.getBounds();
  var topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  var bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

  svgLayer.attr("width", bottomRight.x - topLeft.x)
    .attr("height", bottomRight.y - topLeft.y)
    .style("left", topLeft.x + "px")
    .style("top", topLeft.y + "px");

  plotLayer.attr('transform', 'translate('+ -topLeft.x + ',' + -topLeft.y + ')');
  lineLayer.attr('transform', 'translate('+ -topLeft.x + ',' + -topLeft.y + ')');
}

var updatePosition = function(d)
{
  d.pos = map.latLngToLayerPoint(new L.LatLng(d.y, d.x));
  d3.select(this).attr( {cx: d.pos.x, cy: d.pos.y } );
}

function projectPoint(x, y) {
  var point = map.latLngToLayerPoint(new L.LatLng(y, x));
  this.stream.point(point.x, point.y);
}
var transform = d3.geo.transform({point: projectPoint}),
    path = d3.geo.path().projection(transform);

d3.json('data/wards.geojson', function(err,collection)
{
  var feature = lineLayer.selectAll("path")
      .data(collection.features)
    .enter().append("path");
  feature.attr("d", path)
    .attr('fill','rgba(255,255,255,0.0)')
    .attr('stroke', '#FFF')
    .attr('stroke-width', 2)
    .on('mouseover', function(d)
    {
      d3.select(this).attr('fill', 'rgba(0,0,0,0.3)');
    })
    .on('mouseout', function(d)
    {
      d3.select(this).attr('fill', 'rgba(255,255,255,0.0)');
    })
    .on('click', function(d)
    {
   	console.log(d.properties.name);
      sel_si(d.properties.name);
      searchGoo(d.properties.name);
    });
  map.on('move', function()
  {
    feature.attr('d', path);
  });
  d3.csv('data/nakano.csv', function(err,tbl)
  {
    tbl.forEach(function(d){
      d.pos = map.latLngToLayerPoint(new L.LatLng(d.y, d.x));
    });
    plotLayer.selectAll('circle').data(tbl).enter().append('circle')
      .attr('cx',function(d){return d.pos.x;})
      .attr('cy',function(d){return d.pos.y;})
      .attr('r', 6)
      .attr('fill', '#018894')
      .on('mouseover', function(d)
      {
        d3.select(this).transition().attr('r', 12)
          .attr('stroke', '#FFF')
          .attr('stroke-width', 2);
      })
      .on('mouseout', function(d)
      {
        d3.select(this).transition().attr('r', 6)
          .attr('stroke', 'none')
          .attr('stroke-width', 0);
      })
      .on('click', function(d)
      {
        d3.event.preventDefault();
        console.log(d);
        d3.select('div#hoiku h2').text(d['施設名']);
        d3.select('div#hoiku td#hoiku-address').text(d['所在地']);
        d3.select('div#hoiku td#hoiku-tel').text(d['電話番号']);
        d3.select('div#hoiku td#hoiku-open').text(d['基本保育時間']);
        d3.select('div#hoiku td#hoiku-open2').text(d['延長保育時間']);
        d3.select('div#hoiku td#hoiku-teiin').text(d['定員']);
      });

    map.on('move', function()
    {
      plotLayer.selectAll('circle').each(updatePosition);
    });
  });
  reset();
});

map.on("move", reset);
