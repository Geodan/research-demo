var map;

app.controller("mapCtrl", function($http, $scope) {

    var ctrl = this;

    ctrl.parameters = {};
    ctrl.currentParameter = 'bewonersDichtheid';
    ctrl.currentData;
    ctrl.vizMode = "pie";

    ctrl.switchVisMode = function() {
        if (ctrl.vizMode === "pie") {
            ctrl.vizMode = "bars";
            ctrl.createNewLayer();
        } else {
            ctrl.vizMode = "pie";
            ctrl.createNewLayer();
        }
    }

    function getMaxVal(property) {
        var maxVal = null;
        for (var i = 0; i < provincies.features.length; i++) {
            var val = provincies.features[i].properties[property];
            if (val > maxVal) {
                maxVal = val;
            }
        }
        return maxVal;
    }

    function getMinVal(property) {
        var minVal = null;
        for (var i = 0; i < provincies.features.length; i++) {
            var val = provincies.features[i].properties[property];
            if (minVal === null) {
                minVal = val;
            }
            if (val < minVal) {
                minVal = val;
            }
        }
        return minVal;
    }

    function getValues(property) {
        var values = [];
        for (var i = 0; i < provincies.features.length; i++) {
            var val = {}
            val.label = provincies.features[i].properties.omschrijving;
            val.value = provincies.features[i].properties[property];
            values.push(val);
        }
        return values;
    }

    function initParams() {
        for (var property in provincies.features[0].properties) {

            var minVal = getMinVal(property);
            var maxVal = getMaxVal(property);
            var values = getValues(property);

            console.log("Min " + minVal);
            console.log("Max " + maxVal);

            var length = maxVal - minVal;

            ctrl.parameters[property] = {};
            ctrl.parameters[property].length = length;
            ctrl.parameters[property].values = values;

        }
    }

    initParams();

    var gmGreen = '50,180,184';

    var styleFunction = function(feature) {

        console.log(feature);

        var val = feature.T[ctrl.currentParameter];

        var col = redGreenScale(val, ctrl.parameters[ctrl.currentParameter].length);
        var style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(' + col + ',' + val + ')',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(' + col + ', 0.5)'
            })
        });
        console.log(col);
        return style;

    };

    function redGreenScale(value, maxLength) {

        var val = parseInt(255 * (value / maxLength));

        // r = parseInt(255 - (255 * (length / maxLength) ) );
        r = 50;
        g = val;
        b = 184;

        var color = r + ',' + g + ',' + b;

        return color;
    }

    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(provincies, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    });


    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    });

    var updateLayer = function(source) {
        vectorLayer.setSource(source);
    }

    ctrl.createNewLayer = function() {
        var vectorSource = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(provincies, {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:3857'
            })
        });

        updateLayer(vectorSource);

        ctrl.currentData = ctrl.parameters[ctrl.currentParameter].values;
        if (ctrl.vizMode === "pie") {
            loadPie();
        } else {
            loadBars();
        }

    };

    ctrl.changeParameter = function(par) {
        ctrl.currentParameter = par;
        ctrl.createNewLayer(par);
    }

    ctrl.createNewLayer(ctrl.currentParameter);

    var osm = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    map = new ol.Map({
        layers: [
            osm,
            vectorLayer
        ],
        target: 'map',
        view: new ol.View({
            center: [694994.78479176154,6821925.270219832],
            zoom: 8
            // projection: 'EPSG:4326'
        })
    });

    //Regular pie chart example
    nv.addGraph(function() {
        var chart = nv.models.pieChart()
            .x(function(d) {
                return d.label
            })
            .y(function(d) {
                return d.value
            })
            .showLabels(true);

        d3.select("#chart svg")
            .datum(exampleData())
            .transition().duration(350)
            .call(chart);

        return chart;
    });

    function loadPie() {

        document.getElementById("chart").innerHTML = "<svg></svg>";

        //Donut chart example
        nv.addGraph(function() {
            var chart = nv.models.pieChart()
                .x(function(d) {
                    return d.label
                })
                .y(function(d) {
                    return d.value
                })
                .showLabels(true) //Display pie labels
                .labelThreshold(.05) //Configure the minimum slice size for labels to show up
                .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                .donut(false) //Turn on Donut mode. Makes pie chart look tasty!
                .donutRatio(0.35) //Configure how big you want the donut hole size to be.
                ;

            d3.select("#chart svg")
                .datum(exampleData())
                .transition().duration(350)
                .call(chart);

            return chart;
        });
    }

    function loadBars(){

        document.getElementById("chart").innerHTML = "<svg></svg>";

        d3.select("#chart svg")
            .selectAll("p")
            .data(ctrl.currentData)
            .enter()
            .append("circle")
            .text("hello ");
    }


    //Pie chart example data. Note how there is only a single array of key-value pairs.
    function exampleData() {
        return ctrl.currentData
    }

});