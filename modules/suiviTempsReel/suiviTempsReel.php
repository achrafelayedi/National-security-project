<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// CAS DU REMPLISSAGE DES INPUTS SELECT
if($_POST['selection']){
    $donnees = array();
    $req = executerRequete("SELECT nom, prenom, imei FROM agent WHERE mobilite = true AND imei IS NOT NULL");
    
    if($req) {
		while($ligne = pg_fetch_assoc($req)) {
            array_push($donnees,
                [$ligne['nom'], $ligne['prenom'], $ligne['imei']]
            );
        }
    }

    echo json_encode($donnees);
}
// CAS DU REMPLISSAGE DES INPUTS SELECT

// CAS DE RÉCUPÉRATION DES POSITIONS DES AGENTS
if($_POST['agents_pos']){
    $agent1 = array();
    $agent2 = array();

    $req1 = executerRequete("SELECT ST_X(emplacement) AS lon, ST_Y(emplacement) AS lat FROM agent WHERE imei = '".$_POST['imei_agent1']."' ");
    $req2 = executerRequete("SELECT ST_X(emplacement) AS lon, ST_Y(emplacement) AS lat FROM agent WHERE imei = '".$_POST['imei_agent2']."' ");
    
    if($req1) {
		while($ligne = pg_fetch_assoc($req1)) {
            array_push($agent1,
                floatval($ligne['lon']), floatval($ligne['lat']) 
            );
        }
    }

    if($req2) {
		while($ligne = pg_fetch_assoc($req2)) {
            array_push($agent2,
                floatval($ligne['lon']), floatval($ligne['lat']) 
            );
        }
    }

    echo json_encode(array("agent1" => $agent1, "agent2" => $agent2));
}
// CAS DE RÉCUPÉRATION DES POSITIONS DES AGENTS
?>