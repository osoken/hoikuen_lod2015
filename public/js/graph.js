   var xw_chart = d3.select('html').node().getBoundingClientRect().width * 0.4;
   var yw_chart = d3.select('html').node().getBoundingClientRect().height * 0.35;
   var max_chart = 23;
   var lfasparql = new LFASparql();
//   var si_list = [["中野区","gnjp:東京都中野区"],["杉並区","gnjp:東京都杉並区"]];
   var si_list = [];
   var ind_list = {
"http://ind.geonames.jp/ssds/J2503" : "保育所数" ,
"http://ind.geonames.jp/ssds/J250502" : "保育所待機児童数" ,
"http://ind.geonames.jp/ssds/J2506" : "保育所在所児数" ,
"http://ind.geonames.jp/ssds/E1101" : "幼稚園数" ,
"http://ind.geonames.jp/ssds/E1501" : "幼稚園在園者数" ,
"http://ind.geonames.jp/ssds/D3203106" : "幼稚園費" ,
"http://ind.geonames.jp/ssds/H2900" : "保育所まで100m未満の住宅数" ,
"http://ind.geonames.jp/ssds/H2901" : "保育所まで100-200mの住宅数" ,
"http://ind.geonames.jp/ssds/H2902" : "保育所まで200-500mの住宅数" ,
"http://ind.geonames.jp/ssds/H2903" : "保育所まで500-1kmの住宅数" ,
"http://ind.geonames.jp/ssds/H2904" : "保育所まで1km以上の住宅数" ,
"http://ind.geonames.jp/ssds/H9101" : "公園数" ,
"http://ind.geonames.jp/ssds/H9201" : "公園面積" ,
"http://ind.geonames.jp/ssds/G1401" : "図書館数" ,
"http://ind.geonames.jp/ssds/I6100" : "医師数" ,
"http://ind.geonames.jp/ssds/I6101" : "医療施設医師数" ,
"http://ind.geonames.jp/ssds/I6201" : "医療施設歯科医師数" ,
"http://ind.geonames.jp/ssds/I5101" : "病院数" ,
"http://ind.geonames.jp/ssds/I5211" : "病院病床数" ,
"http://ind.geonames.jp/ssds/I5102" : "一般診療所数" ,
"http://ind.geonames.jp/ssds/I5212" : "一般診療所病床数" ,
"http://ind.geonames.jp/ssds/I510120" : "一般病院数" ,
"http://ind.geonames.jp/ssds/I6200" : "歯科医師数" ,
"http://ind.geonames.jp/ssds/I5103" : "歯科診療所数" ,
"http://ind.geonames.jp/ssds/I510110" : "精神病院数" ,
"http://ind.geonames.jp/ssds/J2904" : "婦人保護施設数" ,
"http://ind.geonames.jp/ssds/A1404" : "０～３歳人口" ,
"http://ind.geonames.jp/ssds/A140402" : "０～３歳人口（女）" ,
"http://ind.geonames.jp/ssds/A140401" : "０～３歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1405" : "０～５歳人口" ,
"http://ind.geonames.jp/ssds/A140502" : "０～５歳人口（女）" ,
"http://ind.geonames.jp/ssds/A140501" : "０～５歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1408" : "３～５歳人口" ,
"http://ind.geonames.jp/ssds/A1401" : "３歳人口" ,
"http://ind.geonames.jp/ssds/A1402" : "４歳人口" ,
"http://ind.geonames.jp/ssds/A1403" : "５歳人口" ,
"http://ind.geonames.jp/ssds/E2401" : "小学校教員数" ,
"http://ind.geonames.jp/ssds/E2501" : "小学校児童数" ,
"http://ind.geonames.jp/ssds/E2101" : "小学校数" ,
"http://ind.geonames.jp/ssds/D3203102" : "小学校費" ,
"http://ind.geonames.jp/ssds/A1409" : "６～１１歳人口" ,
"http://ind.geonames.jp/ssds/B1101" : "面積" ,
"http://ind.geonames.jp/ssds/H810402" : "住居地域面積" ,
"http://ind.geonames.jp/ssds/H8103" : "市街化区域面積" ,
"http://ind.geonames.jp/ssds/H810406" :	"工業地域面積" ,
"http://ind.geonames.jp/ssds/A1101" : "人口" ,
"http://ind.geonames.jp/ssds/A110102" : "人口（女）" ,
"http://ind.geonames.jp/ssds/A110101" : "人口（男）" ,
"http://ind.geonames.jp/ssds/A2101" : "住民基本台帳人口（日本人）" ,
"http://ind.geonames.jp/ssds/A710201" : "一般世帯人員数" ,
"http://ind.geonames.jp/ssds/A710101" : "一般世帯数" ,
"http://ind.geonames.jp/ssds/A7101" : "世帯数" ,
"http://ind.geonames.jp/ssds/H3100" : "総世帯数" ,
"http://ind.geonames.jp/ssds/A6107" : "昼間人口" ,
"http://ind.geonames.jp/ssds/A6108" : "昼間人口比率" ,
"http://ind.geonames.jp/ssds/A1406" : "０～１５歳人口" ,
"http://ind.geonames.jp/ssds/A140602" : "０～１５歳人口（女）" ,
"http://ind.geonames.jp/ssds/A140601" : "０～１５歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1407" : "０～１７歳人口" ,
"http://ind.geonames.jp/ssds/A140702" : "０～１７歳人口（女）" ,
"http://ind.geonames.jp/ssds/A140701" : "０～１７歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1410" : "１０～１３歳人口" ,
"http://ind.geonames.jp/ssds/A141002" : "１０～１３歳人口（女）" ,
"http://ind.geonames.jp/ssds/A141001" : "１０～１３歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1411" : "１２～１４歳人口" ,
"http://ind.geonames.jp/ssds/A141102" : "１２～１４歳人口（女）" ,
"http://ind.geonames.jp/ssds/A141101" : "１２～１４歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1412" : "１４～１９歳人口" ,
"http://ind.geonames.jp/ssds/A141202" : "１４～１９歳人口（女）" ,
"http://ind.geonames.jp/ssds/A141201" : "１４～１９歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1413" : "１５～１７歳人口" ,
"http://ind.geonames.jp/ssds/A141302" : "１５～１７歳人口（女）" ,
"http://ind.geonames.jp/ssds/A141301" : "１５～１７歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1302" : "１５～６４歳人口" ,
"http://ind.geonames.jp/ssds/A130202" : "１５～６４歳人口（女）" ,
"http://ind.geonames.jp/ssds/A130201" : "１５～６４歳人口（男）" ,
"http://ind.geonames.jp/ssds/A1414" : "１５歳以上人口" ,
"http://ind.geonames.jp/ssds/A141402" : "１５歳以上人口（女）" ,
"http://ind.geonames.jp/ssds/A141401" : "１５歳以上人口（男）" ,
"http://ind.geonames.jp/ssds/A1301" : "１５歳未満人口" ,
"http://ind.geonames.jp/ssds/A130102" : "１５歳未満人口（女）" ,
"http://ind.geonames.jp/ssds/A130101" : "１５歳未満人口（男）" 
   };
   	


var alldata = [];

    function loadindicator() {
        $("select#baseindicator").append(
    			"<option value=\"\"></option>\n"
        	);
    	for (var p in ind_list){
           $("select#indicator").append(
    			"<option value=\"" + p + "\">" + ind_list[p] + "</option>\n"
    		);
            $("select#baseindicator").append(
    			"<option value=\"" + p + "\">" + ind_list[p] + "</option>\n"
    		);   		
		}
	}

	function sel_ind() {
		var key = selected_ku+" "+$('select#indicator option:selected').text().replace(/数$/,"");
		console.log(key);
		goo.searchGoo({'keyword':key });
		drawChart();
	}

	var sel_si = function (x) {

		var sopt = "gnjp:東京都" + x;
		newsi = [x,sopt];
		console.log(newsi);
		for (var i= 0; i < si_list.length ; i++ ) {
			if (newsi[0] == si_list[i][0]) {
				return;
			}		
		}
		$("#message").append("データロード中です。しばらくお待ちください。");
		if (si_list.length >= max_chart) {
			si_list.shift();
		}
		si_list.push(newsi);
		console.log(si_list);
		var sparql_query = " \
prefix gnjp: <http://geonames.jp/resource/> \
SELECT * WHERE{ \
graph <http://ind.geonames.jp/ssds> { \
?s <http://purl.org/linked-data/sdmx/2009/dimension#refArea> "
+  sopt  +
" . \
?s <http://worldbank.270a.info/property/indicator> ?i . \
?s <http://purl.org/linked-data/sdmx/2009/attribute#unitMeasure> ?m . \
?s <http://purl.org/linked-data/sdmx/2009/dimension#refPeriod> ?y . \
?s <http://purl.org/linked-data/sdmx/2009/measure#obsValue> ?v . \
					}		\
					}";
//					    ?i skos:prefLabel ?l . \

		console.log(sparql_query);
        lfasparql.executeSparql({
            appID: "xawsaykmcb",
            sparql: sparql_query,
            success: getResult,
            error: getError
        });
	}
    function getError(xhr, status, error) {
        console.log("Error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
    }
    
    function compYear(a, b) {
    	return a.y.value - b.y.value;
    }
    
    function getResult(json) {
    	var data = [];
    	json.forEach(function(val) {
	    	if (ind_list.hasOwnProperty(val.i.value) ) {
	    		data.push(val);
	    	}
    	});
		data.sort(compYear);
		if (alldata.length >= max_chart) {
			alldata.shift();
		}
   		alldata.push(data);
   	//	console.log(alldata);
  	//	$("#data").append(JSON.stringify(alldata));
   		drawChart();
   		$("#message").empty();
	}

	function drawChart() {
	    var data= [];
	    var measure = "";
	    var basemeasure = "";
	    var ind = $('select#indicator option:selected').attr("value");
	    var baseind = $('select#baseindicator option:selected').attr("value");
		for (var i=0 ; i < alldata.length ; i ++) {
			var value = {};
			var base = {};
        	data.push(["year"]);
        	data.push([si_list[i][0]]);
	        alldata[i].forEach(function(val) {
		 		if ( val.i.value == ind) {
		 		  measure = val.m.value;
		      	  value[val.y.value] = val.v.value;
				}
		 		if ( val.i.value == baseind) {
		 		  basemeasure = val.m.value;
		      	  base[val.y.value] = val.v.value;
				}
	        });
	        for ( y in value) {
	        	if (baseind == "") {
		 			data[i*2].push(y);
     				data[i*2+1].push(value[y]);
     			} else {
     				if (base.hasOwnProperty(y)) {
			 			data[i*2].push(y);
	     				data[i*2+1].push(value[y]/base[y]);
	     			}
     			}
     		}
        }
        if (baseind != "") {
        	measure = measure + "/" + basemeasure;
        }
        $('div#lineChart img').removeAttr('src')
          .removeAttr('width').removeAttr('height');
//	        console.log(data);
	   	// Sparqlの結果はデータ系列ごとにソートされている前提
	    c3DisplayLineChart(data, "result", xw_chart, yw_chart,"年",measure);
	    // json,  "%ID%", "%WIDTH%", "%HEIGHT%", x軸ラベル, y軸ラベル, x値名, x値, y値
	}

	function c3DisplayLineChart(json, id, width, height, xAxisLabel, yAxisLabel) {
		var data=json;
	    var xAxisValue = {};
	    for ( var i = 0 ; i < data.length - 1 ; i += 2 ) {
		    xAxisValue[data[i+1][0]] = data[i][0];
	    }
	    
//		   console.log("data:", data);
//		   console.log(xAxisValue);
	    var chart = c3.generate({
	        bindto:"#"+id,
	        size: {
	        	width: width,
	        	height: height
	        },
	        data:{
	            xs: xAxisValue,
	            columns: data,
	            type: 'line'
	        },
	        axis: {
	        	x: {
	            	label: xAxisLabel
	              
	            },
	            y: {
	                label: yAxisLabel,
	                min: 0
	            }
	        },
	        tooltip: {
	            position: function (data, width, height, element) {
	                return { 
	                     top: 0
	                  	,left: $('line.c3-xgrid-focus').attr('x1')}
	            }
	        }
	    });

	}


    $(document).ready( function() {
//		loadarea();
		loadindicator();
		drawChart();
//        test();

    });
