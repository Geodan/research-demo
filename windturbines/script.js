var extent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
var resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42];
var projection = new ol.proj.Projection({code:'EPSG:28992', units:'m', extent: extent});

var url = "http://geodata.nationaalgeoregister.nl/tiles/service/tms/1.0.0/brtachtergrondkaartpastel/EPSG:28992/";

var tileUrlFunction = function(tileCoord, pixelRatio, projection) {
  var zxy = tileCoord;
  if (zxy[1] < 0 || zxy[2] < 0) {
    return "";
  }
  return url +
    zxy[0].toString()+'/'+ zxy[1].toString() +'/'+
    zxy[2].toString() +'.png';
};

    var point_style = new ol.style.Style({
          image: new ol.style.Circle({
            fill: new ol.style.Fill({
              color: '#96858F'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
              color: '#96858F',
              width: 1
            })
          })
        });

var source = new ol.source.Vector({wrapX: false});
var vector = new ol.layer.Vector({
    source: source,
    style: point_style
});

var map = new ol.Map({
  target: 'map',
  layers:  [
    new ol.layer.Tile({
      source: new ol.source.TileImage({
        attributions: [
          new ol.Attribution({
            html: 'Kaart: ©<a href="http://www.kadaster.nl">CC-BY Kadaster</a>'
          })
        ],
        projection: projection,
        tileGrid: new ol.tilegrid.TileGrid({
          origin: [-285401.92,22598.08],
          resolutions: resolutions
        }),
        tileUrlFunction: tileUrlFunction
      })
    })
  , vector],
  view: new ol.View({
    minZoom: 3,
    maxZoom: 13,
    projection: projection,
    center: [150000, 450000],
    zoom: 3
  })
});