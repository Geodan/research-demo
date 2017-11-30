<?php

$north = $_REQUEST['north'];
$south = $_REQUEST['south'];
$west  = $_REQUEST['west'];
$east  = $_REQUEST['east'];

header('Content-type: application/json');
//$conn = pg_pconnect("host=192.168.26.76 dbname=research user=postgres password=postgres");
$conn = pg_pconnect("host=titania dbname=research user=postgres password=postgres");
if (!$conn) {
  echo "A connection error occurred.\n";
  exit;
}
$query = "
WITH 
bounds AS (
	--SELECT ST_Buffer(ST_Transform(ST_SetSrid(ST_MakePoint($lon, $lat),4326), 28992),200) geom
	SELECT ST_MakeEnvelope($west, $south, $east, $north, 28992) geom
)
SELECT a.id,a.type, a.color, ST_AsX3D(a.geom) geom
FROM bgt_3d.buildings a, bounds b WHERE ST_Intersects(a.footprint, b.geom)
";

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
