

var map = new L.Map(d3.select('div').node()).setView([35.678707, 139.739143], 12);
var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var svgLayer = d3.select(map.getPanes().overlayPane).append('svg').attr('class', 'leaflet-zoom-hide');
var plotLayer = svgLayer.append('g');

var updatePosition = function(d)
{
  d.pos = map.latLngToLayerPoint(new L.LatLng(d.latitude, d.longitude));
  d3.select(this).attr( {cx: d.pos.x, cy: d.pos.y } );
}

d3.json('/osoken/raw/92fefc35273ff9855947/yamanote_stations.json', function(err,data)
{
  var points = data.nodes;
  plotLayer.selectAll('circle').data(points).enter().append('circle')
    .attr({r:10, fill:'steelblue', stroke: 'white', 'stroke-width': 3}).each(updatePosition);
  map.on('move', function()
  {
    plotLayer.selectAll('circle').each(updatePosition);
  });
  reset();
});

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
}

map.on("move", reset);
