<?php

// INCLURE DES FONCTIONS UTILES PHP-POSTGRES
require_once "../../assets/php/fonctions.php";
// /INCLURE DES FONCTIONS UTILES PHP-POSTGRES


// LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE AGENT
if($_POST["importation"]){
    // RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
    $noms_cols_agent = colsTabVersArray("agent");
    // /RÉCUPÉRATION DES NOMS DE COLONNES DE LA TABLE
	 
	// SUPPRESSION DE LA COLONNE GID
    array_shift($noms_cols_agent);
    // /SUPPRESSION DE LA COLONNE GID
    
    // COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    $n = count(array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"));
    // /COMPARAISON ENTRE LES NOMS DE COLONNES DE LA TABEL ET LES NOMS DE COLONNES DE FICHIER EXCEL
    if (!$n){

        $transaction = "BEGIN;";
        // INSERTION DANS LA TABLE

        for($i=0; $i<count($_POST["lignes_excel"]); $i++){

            $mobilite = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][2]]=="mobile"? "true": "false";
            $imei = $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][5]]? "'".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][5]]."'": "null";
    
            $transaction .= "INSERT INTO agent (".$_POST['noms_cols_excel'][0].", ".$_POST['noms_cols_excel'][1].", ".$_POST['noms_cols_excel'][2].", ".$_POST['noms_cols_excel'][3].", ".$_POST['noms_cols_excel'][4].", ".$_POST['noms_cols_excel'][5]." ) VALUES ('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][0]]."','".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][1]]."', $mobilite,  to_timestamp('".$_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][3]]."', 'mm/dd/yy hh24:mi'),   st_geomfromtext('POINT(".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[0]." ".explode(',', $_POST['lignes_excel'][$i][$_POST['noms_cols_excel'][4]])[1].")', 4326), $imei);";
            
        }
    

        executerRequete($transaction .= "COMMIT;");
        
        echo json_encode(array(
            "type" => "succes",
            "msg" => $in." ".count($_POST["lignes_excel"])." Les agents ont été importés avec succès"
        ));
        
    }
    // CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES
    else{

        if($n==1){
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Le nom de la colonne suivante dans le fichier Excel [ ".implode(array_udiff($_POST['noms_cols_excel'], $noms_cols_agent, "strcasecmp"))." ] ne respecte pas la même syntaxe dans la base de données [ ".implode(array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        else{
            echo json_encode(array(
                "type" => "erreur",
                "msg" => "Les noms des colonnes suivantes dans le fichier Excel [ ".implode(', ', array_udiff($_POST['noms_cols_excel'], $noms_cols_agent, "strcasecmp"))." ] ne respectent pas la même syntaxe dans la base de données [ ".implode(', ', array_udiff($noms_cols_agent, $_POST['noms_cols_excel'], "strcasecmp"))." ]"
            ));
        }
        
    }
    // /CAS D'ERREUR DE SYNTAXE DES NOMS COLONNES

}
// /LE CAS D'IMPORTATION DU FICHIER EXCEL VERS LA TABLE AGENT


// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT
if($_POST['modification']){
    if($_POST['emplacement']){
        $var = executerRequete("UPDATE agent SET nom = ".$_POST['nom'].", prenom = ".$_POST['prenom'].", mobilite = ".$_POST['mobilite'].", imei = ".$_POST['imei']." , emplacement = st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326) WHERE gid = ".$_POST['gid']."");
    }else{
        $var = executerRequete("UPDATE agent SET nom = ".$_POST['nom'].", prenom = ".$_POST['prenom'].", mobilite = ".$_POST['mobilite'].", imei = ".$_POST['imei']." WHERE gid = ".$_POST['gid']."");
    }

    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "L'agent a été bien modifié / déplacé avec succès"
        ));
    }
}
// LE CAS DE LA MODIFICATION OU BIEN LE DÉPLACEMENT


// LE CAS D'AJOUT
if($_POST['ajout']){
	
	$insert_agent = executerRequete("INSERT INTO agent VALUES (DEFAULT, '".$_POST['nom']."', '".$_POST['prenom']."', ".$_POST['mobilite']." , DEFAULT, st_geomfromtext('POINT(".$_POST['emplacement'][0]." ".$_POST['emplacement'][1].")', 4326), ".$_POST['imei']." )");
	
	if($insert_agent){
		echo json_encode(array(
			"type" => "succes",
			"msg" => "L'agent a été ajouté avec succès"
			));
		}
	}

// /LE CAS D'AJOUT

// LE CAS SUPPRESSION
if($_POST["suppression"]){
    $var = executerRequete("DELETE FROM agent WHERE gid = ".$_POST['gid']."");
    if($var){
    echo json_encode(array(
        "type" => "succes",
        "msg" => "L'agent a été bien supprimé avec succès"
        ));
    }
}
// LE CAS SUPPRESSION

// TABLEAU DES INFORMATION SUR LES AGENT

if($_GET['table']){
	
	

	if($query) {
        $result =executerRequete("SELECT gid, st_asgeojson(emplacement) as geom, st_Distance(ST_Transform(emplacement,900913),ST_Transform(ST_GeomFromText('POINT(".$_GET["emplacement"][0]." ".$_GET["emplacement"][1].")',4326),900913)) as dis FROM agent order by dis asc");
    }
}
// /TABLEAU DES INFORMATION SUR LES AGENTS 

// SELECTION DES DONNEES 
if($_POST['selection']){
    $feature = array();
	$result = executerRequete("SELECT gid, nom, prenom, mobilite, imei, st_asgeojson(emplacement) as geom FROM agent");
	if($result) {
		    while($row = pg_fetch_assoc($result)) {
		    	$row['removable']='true';
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
// /SELECTION DES  DONNEES

// LE CAS DE LA TABLE ATTRIBUTAIRE
if($_POST['tableAttributaire']){

    $colonnes = array();
    $noms_cols = array("Id", "Nom", "Prenom", "Mobilité", "Date et heure d'ajout");
    $donnees = array();

    for($i = 0; $i < count(colsTabVersArray("agent"))-2; $i++){
        array_push($colonnes, array(
            "data" => colsTabVersArray("agent")[$i],
            "name" => mb_strtoupper($noms_cols[$i])
            )
        );
    }

    $req = executerRequete("SELECT gid , COALESCE(nom, '') AS nom, COALESCE(prenom, '') as prenom, CASE WHEN mobilite THEN 'mobile' WHEN mobilite = false THEN 'fixe' END AS mobilite, to_char(dateheure, 'DD/MM/YYYY HH24:MI') AS dateheure FROM agent");
        if($req) {
		    while($ligne = pg_fetch_assoc($req)) {
                array_push($donnees, array(
                    colsTabVersArray("agent")[0] => $ligne[colsTabVersArray("agent")[0]],
                    colsTabVersArray("agent")[1] => $ligne[colsTabVersArray("agent")[1]],
                    colsTabVersArray("agent")[2] => $ligne[colsTabVersArray("agent")[2]],
                    colsTabVersArray("agent")[3] => $ligne[colsTabVersArray("agent")[3]],
                    colsTabVersArray("agent")[4] => $ligne[colsTabVersArray("agent")[4]],
                    )
                );
            }
        }
    
    echo json_encode(array("data" => $donnees) + array("columns" => $colonnes));
}
// /LE CAS DE LA TABLE ATTRIBUTAIRE


// LE CAS DE LA TABLE ATTRIBUTAIRE-DISTANCE
if($_POST['tableAttributaire_distance']){

    $colonnes = array();
    $noms_cols = array("Id", "Nom", "Prenom", "Mobilité", "Date et heure d'ajout");
    $donnees = array();

    for($i = 0; $i < count(colsTabVersArray("agent"))-2; $i++){
        array_push($colonnes, array(
            "data" => colsTabVersArray("agent")[$i],
            "name" => mb_strtoupper($noms_cols[$i])
            )
        );
    }

    array_push($colonnes, array(
        "data" => "distance",
        "name" => "DISTANCE (m)"
        )
    );

    $req = executerRequete("SELECT gid , COALESCE(nom, '') AS nom, COALESCE(prenom, '') as prenom, CASE WHEN mobilite THEN 'mobile' WHEN mobilite = false THEN 'fixe' END AS mobilite, to_char(dateheure, 'DD/MM/YYYY HH24:MI') AS dateheure, ST_Distance(ST_Transform(emplacement,900913),ST_Transform(ST_GeomFromText('POINT(".$_POST['lon']." ".$_POST['lat'].")',4326),900913)) AS distance FROM agent");
        if($req) {
		    while($ligne = pg_fetch_assoc($req)) {
                array_push($donnees, array(
                    colsTabVersArray("agent")[0] => $ligne[colsTabVersArray("agent")[0]],
                    colsTabVersArray("agent")[1] => $ligne[colsTabVersArray("agent")[1]],
                    colsTabVersArray("agent")[2] => $ligne[colsTabVersArray("agent")[2]],
                    colsTabVersArray("agent")[3] => $ligne[colsTabVersArray("agent")[3]],
                    colsTabVersArray("agent")[4] => $ligne[colsTabVersArray("agent")[4]],
                    "distance" => round(floatval($ligne['distance']), 2)
                    )
                );
            }
        }
    
    echo json_encode(array("data" => $donnees) + array("columns" => $colonnes));
}
// /LE CAS DE LA TABLE ATTRIBUTAIRE-DISTANCE


// LE CAS DU SELECTION DE LA DATE MIN
if($_POST['mindate']){
    $req = executerRequete("SELECT to_char(MIN(dateheure), 'dd/mm/yyyy') AS mindate FROM agent");
    
    if($req) {
		while($ligne = pg_fetch_assoc($req)) {
            echo json_encode(
                $ligne['mindate']
            );
        }
    }
    
}
// /LE CAS DU SELECTION DE LA DATE MIN
?>