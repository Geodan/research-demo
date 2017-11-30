<?php

$north = $_REQUEST['north'];
$south = $_REQUEST['south'];
$west  = $_REQUEST['west'];
$east  = $_REQUEST['east'];

$width = $east - $west;
$height = $north - $south;
$area = $width * $height;

$diagonal = sqrt(pow($width,2) + pow($height,2));
$zoom = 100 / $diagonal;
//$zoom  = $_REQUEST['zoom'] ?: 0.005;

$segmentlength = $width / 10;

header('Content-type: application/json');
$conn = pg_pconnect("host=titania dbname=research user=postgres password=postgres");
if (!$conn) {
  echo "A connection error occurred.\n";
  exit;
}
$query = "
WITH
bounds AS (
	SELECT ST_MakeEnvelope($west, $south, $east, $north, 28992) geom
)
SELECT $south::text || $west::text || id, type, color,
ST_AsX3D(geom,3) geom, label
FROM bgt_3d.water";


$result = pg_query($conn, $query);
if (!$result) {
  echo "An error occurred.\n";
  exit;
}

$res_string = "id;type;color;geom;label;\n";
while ($row = pg_fetch_row($result)) {
	$res_string = $res_string . implode(';',$row) . "\n";
}
ob_start("ob_gzhandler");
echo $res_string;
ob_end_flush();

?>
