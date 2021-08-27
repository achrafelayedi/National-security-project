<?php

// INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES
require_once "connect.php";
// /INCLURE LES PARAMÈTRES DE CONNEXION AVEC LA BASE DE DONNÉES

// OBTENTION D'UN TABLEAU CONTIENT LES NOMS DE COLONNES D'UNE TABLE
function colsTabVersArray($nom_table){
    $res = array();
    $req = executerRequete("SELECT column_name FROM information_schema.columns WHERE table_name = '$nom_table'");
    while($ligne = pg_fetch_row($req)){
        $res[] = $ligne[0];
    }
    return $res;
}
// /OBTENTION D'UN TABLEAU CONTIENT LES NOMS DE COLONNES D'UNE TABLE

// L'EXECUTION DES REQUÊTE SQL
function executerRequete($requete){
    return pg_query($GLOBALS["db"], $requete);
}
// /L'EXECUTION DES REQUÊTE SQL

// LE CAS SELECTION-FRONTIÈRE
if($_POST['frontiere']){
    $feature = array();
    $result = executerRequete("SELECT st_asgeojson(geom) AS geom FROM frontiere4emeArrondissement");
        if($result) {
		    while($row = pg_fetch_assoc($result)) {
			    $type = '"type": "Feature"';
	            $geometry = '"geometry": '.$row['geom'];
	            unset($row['geom']);
	            $properties = '"properties": '.json_encode($row);
	            $feature[] = '{'.$type.', '.$geometry.', '.$properties.'}';
				
            }
            $header = '{"type": "FeatureCollection", "features": [';
            $footer = ']}';
		    if(count($feature) > 0) {
			    echo $header.implode(', ', $feature).$footer;
		    }
		    else {
			    echo '{"type":"FeatureCollection", "features":"empty"}';
		    }
        }
}
// /LE CAS SELECTION-FRONTIÈRE

// LE CAS SELECTION-RUES
if($_POST['rues']){
    $feature = array();
    $result = executerRequete("SELECT id, \"name\", \"on\", st_asgeojson(geom) AS geom FROM rues4emearrondissement");
        if($result) {
		    while($row = pg_fetch_assoc($result)) {
			    $type = '"type": "Feature"';
	            $geometry = '"geometry": '.$row['geom'];
	            unset($row['geom']);
	            $properties = '"properties": '.json_encode($row);
	            $feature[] = '{'.$type.', '.$geometry.', '.$properties.'}';
				
            }
            $header = '{"type": "FeatureCollection", "features": [';
            $footer = ']}';
		    if(count($feature) > 0) {
			    echo $header.implode(', ', $feature).$footer;
		    }
		    else {
			    echo '{"type":"FeatureCollection", "features":"empty"}';
		    }
        }
}
// /LE CAS SELECTION-RUES
?>