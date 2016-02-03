
var color = [
  '#018894',
  '‪#‎22a1a4‬',
  '‪#‎91c3c9‬',
  '‪#‎51bc8a‬',
  '‪#‎5d6066‬'
];

var selected_ku = '保育園';

var labelList = [];
$('div#hoiku td').each(function(i,d) {
		labelList.push($(d).attr("id"));
		});

var urlList = [];
$('div#hoiku a').each(function(i,d) {
		urlList.push($(d).attr("id"));
		});

var imgList = [];
$('img').each(function(i,d) {
		imgList.push($(d).attr("id"));
		});


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
		d3.select("span#mapmes").text("地図上の○印（保育園）か区をクリックしてください。");
		var name = d.properties.name;
		selected_ku = name;
		goo.searchGoo({'keyword':name+" "+$('div#lineChart select#indicator option:selected').text() });
		if ( name in kulist ) {
			return;
		}
		kulist[name] = 1;
	  loadHoiku(name);
	  sel_si(name);
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
	<http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?x ; \
	<http://www.w3.org/2003/01/geo/wgs84_pos#long> ?y ; . \
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
	        d3.event.preventDefault();
	        get1hoiku(d);
	      });
	}

	function get1hoiku(d) {
		var query_1hoiku = " \
	SELECT * WHERE{ \
	graph <http://linkdata.org/work/rdf1s3888i/hoikuen_23ku> { <"
	 + d.s.value +
	"> ?p ?o . } }";
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
		console.log(json);
		resultHash = {};
		json.forEach( function(d) {
			var l = d.p.value.replace(/[:\/\#\.]/g,"-");
			resultHash[l] = d.o.value;
		});
	   	d3.select('div#hoiku h2').text(resultHash["http---linkdata-org-property-rdf1s3888i-施設名"]);
		labelList.forEach( function(l) {
			label = 'div#hoiku td#' + l;
			if ( l in resultHash ) {
			    d3.select(label).text(resultHash[l]);
			} else {
				d3.select(label).text("");
			}
		});
		urlList.forEach( function(l) {
			label = 'div#hoiku a#' + l;
			if ( l in resultHash ) {
				d3.select(label).attr("href",resultHash[l]);
			    d3.select(label).text(resultHash[l]);
			} else {
				$(label).removeAttr("href");
				d3.select(label).text("");
			}
		});
		imgList.forEach( function(l) {
			label = 'img#' + l;
			if ( l in resultHash ) {
		        $('div#lineChart div#result').empty();
				d3.select(label).attr("src",resultHash[l])
				  .attr("width",xw_chart).attr("height",yw_chart);
			} else {
				$(label).removeAttr("src")
				  .removeAttr("width").removeAttr("height");
			}
		});
	}

	map.on('move', function()
  {
    plotLayer.selectAll('circle').each(updatePosition);
  });
  reset();
});

map.on("move", reset);
