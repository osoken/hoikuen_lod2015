
var color = [
  '#018894',
  '‪#‎22a1a4‬',
  '‪#‎91c3c9‬',
  '‪#‎51bc8a‬',
  '‪#‎5d6066‬'
];

var labelList = [
"http---linkdata-org-property-rdf1s3888i-種別",
"http---linkdata-org-property-rdf1s3888i-設置法人",
"http---linkdata-org-property-rdf1s3888i-住所",
"http---linkdata-org-property-rdf1s3888i-電話番号",
"http---linkdata-org-property-rdf1s3888i-設置者",
"http---linkdata-org-property-rdf1s3888i-運営主体",
"http---linkdata-org-property-rdf1s3888i-認定こども園",
"http---linkdata-org-property-rdf1s3888i-こども園区分",
"http---linkdata-org-property-rdf1s3888i-開設年月日",
"http---linkdata-org-property-rdf1s3888i-敷地面積",
"http---linkdata-org-property-rdf1s3888i-床面積",
"http---linkdata-org-property-rdf1s3888i-園庭面積",
"http---linkdata-org-property-rdf1s3888i-施設形態",
"http---linkdata-org-property-rdf1s3888i-対象年齢",
"http---linkdata-org-property-rdf1s3888i-定員0歳",
"http---linkdata-org-property-rdf1s3888i-定員1歳",
"http---linkdata-org-property-rdf1s3888i-定員2歳",
"http---linkdata-org-property-rdf1s3888i-定員3歳",
"http---linkdata-org-property-rdf1s3888i-定員4歳",
"http---linkdata-org-property-rdf1s3888i-定員5歳",
"http---linkdata-org-property-rdf1s3888i-定員",
"http---linkdata-org-property-rdf1s3888i-延長保育",
"http---linkdata-org-property-rdf1s3888i-開園時間",
"http---linkdata-org-property-rdf1s3888i-終園時間",
"http---linkdata-org-property-rdf1s3888i-朝延長時間",
"http---linkdata-org-property-rdf1s3888i-延長時間"
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
		goo.searchGoo({'keyword':name});
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
			l = d.p.value.replace(/[:\/\#\.]/g,"-");
			console.log(l,d.o.value);
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
	}

	map.on('move', function()
  {
    plotLayer.selectAll('circle').each(updatePosition);
  });
  reset();
});

map.on("move", reset);
