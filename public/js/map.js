
var color = [
  '#018894',
  '‪#‎22a1a4‬',
  '‪#‎91c3c9‬',
  '‪#‎51bc8a‬',
  '‪#‎5d6066‬'
];

var height = d3.select('html').node().getBoundingClientRect().height;
var width = d3.select('html').node().getBoundingClientRect().width * 0.5;
var lfasparql_hoiku = new LFASparql();

var map = new L.Map(d3.select('div#map').style('width', width + 'px' ).node()).setView([35.678707, 139.739143], 11);
var tile = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var svgLayer = d3.select(map.getPanes().overlayPane).append('svg').attr('class', 'leaflet-zoom-hide');
var lineLayer = svgLayer.append('g');
var plotLayer = svgLayer.append('g');

var updatePosition = function(d)
{
  d.pos = map.latLngToLayerPoint(new L.LatLng(d.y.value, d.x.value));
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
  d.pos = map.latLngToLayerPoint(new L.LatLng(d.y.value, d.x.value));
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
	var kulist = {};
	var tbl = [];
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
		var name = d.properties.name;
		if ( name in kulist ) {
			return;
		}
		kulist[name] = 1;
	  loadHoiku(name);
	  sel_si(name);
	  goo.searchGoo({'keyword':name});
	});
	map.on('move', function()
	{
	feature.attr('d', path);
	});

	function loadHoiku(ku) {
		var query_hoiku = " \
	SELECT * WHERE{ \
	graph <http://linkdata.org/work/rdf1s3888i/hoikuen_23ku> { \
	?s <http://linkdata.org/property/rdf1s3888i#市区町村> \""
	+ ku +
	"\"@ja ; \
	<http://linkdata.org/property/rdf1s3888i#施設名> ?sisetu ; \
	<http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?y ; \
	<http://www.w3.org/2003/01/geo/wgs84_pos#long> ?x ; . \
	} } ";
		console.log(query_hoiku);
		lfasparql_hoiku.executeSparql({
		        appID: "lod2015_hoiku",
		        sparql: query_hoiku,
		        success: getResultHoiku,
		        error: getErrorHoiku
	    });
	}

	function getResultHoiku(json) {
		json.forEach(function(d) {
			d.pos = map.latLngToLayerPoint(new L.LatLng(d.y.value, d.x.value));
			tbl.push(d);
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
	        d3.select(this)
			  .append('title')
	          .text(function(d){return d.sisetu.value});
	      })
	      .on('mouseout', function(d)
	      {
	        d3.select(this).transition().attr('r', 6)
	          .attr('stroke', 'none')
	          .attr('stroke-width', 0);
	      })
	      .on('click', function(d)
	      {
	        get1hoiku(d);
	      });
	}

	function get1hoiku(d) {
		var query_1hoiku = " \
	SELECT * WHERE{ \
	graph <http://linkdata.org/work/rdf1s3888i/hoikuen_23ku> { <"
	 + d.s.value +
	"> <http://linkdata.org/property/rdf1s3888i#施設名> ?sisetu ; \
	  <http://linkdata.org/property/rdf1s3888i#種別> ?shubetu ; \
	  <http://linkdata.org/property/rdf1s3888i#住所> ?jusho ; \
	  <http://linkdata.org/property/rdf1s3888i#電話番号> ?denwa ; \
	  <http://linkdata.org/property/rdf1s3888i#定員> ?teiin ; \
	  . \
	  } \
	  }";
		console.log(query_1hoiku);
		lfasparql_hoiku.executeSparql({
		    appID: "lod2015_hoikuen",
		    sparql: query_1hoiku,
		    success: getResult1hoiku,
		    error: getErrorHoiku
		});
	}

	function getErrorHoiku(xhr, status, error) {
	    console.log("Error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
	}

	function getResult1hoiku(json) {
		d = json[0];
		console.log(d);
	   	d3.select('div#hoiku h2').text(d.sisetu.value);
	    d3.select('div#hoiku p#item2').text(d.shubetu.value);
	    d3.select('div#hoiku td#hoiku-address').text(d.jusho.value);
	    d3.select('div#hoiku td#hoiku-tel').text(d.denwa.value);
	    d3.select('div#hoiku td#hoiku-open').text("");
	    d3.select('div#hoiku td#hoiku-open2').text("");
	    d3.select('div#hoiku td#hoiku-teiin').text(d.teiin.value);
	//        d3.select('div#hoiku td#hoiku-open').text(d['基本保育時間']);
	//       d3.select('div#hoiku td#hoiku-open2').text(d['延長保育時間']);
	//        d3.select('div#hoiku td#hoiku-teiin').text(d['定員']);
	}

	map.on('move', function()
  {
    plotLayer.selectAll('circle').each(updatePosition);
  });
  reset();
});

map.on("move", reset);
