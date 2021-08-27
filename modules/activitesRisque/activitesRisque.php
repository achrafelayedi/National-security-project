<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES

// LE CAS DE SELECTION RUES-BOUCHONS
if($_POST['rue_bouchon']){
    $colonnes = array();
    $donnees = array();

    array_push($colonnes, array(
        "data" => "id_bouchon",
        "name" => "ID BOUCHON"
        )
    );

    array_push($colonnes, array(
        "data" => "id_rue",
        "name" => "ID RUE"
        )
    );

    array_push($colonnes, array(
        "data" => "coord_bouchon",
        "name" => "COORDONNÉS BOUCHON"
        )
    );

    array_push($colonnes, array(
        "data" => "rue",
        "name" => "RUE / AVENUE"
        )
    );
    array_push($colonnes, array(
        "data" => "quartier",
        "name" => "QUARTIER"
        )
    );

    for($i=0; $i<count($_POST['tab_bouchons']); $i++){

	$req = executerRequete("SELECT id AS id_rue, \"name\" AS rue, \"on\" AS quartier FROM rues4emearrondissement WHERE ST_Intersects(geom, ST_Buffer(ST_GeographyFromText('SRID=4326;POINT(".$_POST['tab_bouchons'][$i][0]." ".$_POST['tab_bouchons'][$i][1].")'), 0.01))
	");
    
    if($req) {
		while($ligne = pg_fetch_assoc($req)) {
            array_push($donnees, array(
                "id_bouchon" => $i+1,
                "id_rue" => intval($ligne['id_rue']),
                "coord_bouchon" => round($_POST['tab_bouchons'][$i][0], 6)." ".round($_POST['tab_bouchons'][$i][1], 6),
                "rue" => $ligne['rue']? $ligne['rue']: "Pas de données disponibles",
                "quartier" => $ligne['quartier']
                )
            );
        }
    }
    
    }

    echo json_encode(array("data" => $donnees) + array("columns" => $colonnes));
}
// /LE CAS DE SELECTION RUES-BOUCHONS

?>