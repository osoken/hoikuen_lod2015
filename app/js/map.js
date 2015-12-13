
var color = [
  '#018894',
  '‪#‎22a1a4‬',
  '‪#‎91c3c9‬',
  '‪#‎51bc8a‬',
  '‪#‎5d6066‬'
];

var height = d3.select('html').node().getBoundingClientRect().height;
var width = d3.select('html').node().getBoundingClientRect().width;

var map = new L.Map(d3.select('div#map').style('width', width + 'px' ).node()).setView([35.678707, 139.739143], 11);
var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var svgLayer = d3.select(map.getPanes().overlayPane).append('svg').attr('class', 'leaflet-zoom-hide');
var plotLayer = svgLayer.append('g');
var lineLayer = svgLayer.append('g');

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
      console.log(d);
    });
  map.on('move', function()
  {
    feature.attr('d', path);
  });
  reset();
});

map.on("move", reset);
