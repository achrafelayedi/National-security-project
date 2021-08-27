// DECLARATION DES VARIABLES
var marche;
var timeout;
var buffer_marche;
var agent1 = new ol.geom.Point([]);
var agent2 = new ol.geom.Point([]);

var agent1Feature = new ol.Feature({
    geometry: agent1
});
var agent2Feature = new ol.Feature({
    geometry: agent2
});

var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(({
        src: 'assets/img/agent_24.png'
    }))
});

agent1Feature.setStyle(iconStyle);
agent2Feature.setStyle(iconStyle);

var suiviSource = new ol.source.Vector({
    features: [agent1Feature, agent2Feature]
});

var coucheSuivi = new ol.layer.Vector({
    source: suiviSource
});
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(6, "suiviTempsReel", "Boîte à outils du suivi en temps réel", 43, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if (!$('head').find('link[href="modules/suiviTempsReel/suiviTempsReel.css"][rel="stylesheet"]').length) {
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/suiviTempsReel/suiviTempsReel.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/suiviTempsReel/suiviTempsReel.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// SUPPRESSION DE TOUTES LES AUTRES COUCHES
supprimerCouches(coucheSuivi);
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES

// PARTIE REMPLISSAGE DES INPUTS SELECT
data = {
    selection: true
}
success = function (resultat) {
    for (i = 0; i < resultat.length; i++) {
        if (i == 0) {
            $("#agent1").append("<option value='" + resultat[i][2] + "' selected>" + resultat[i][0] + " " + resultat[i][1] + " [ IMEI : " + resultat[i][2] + " ] </option>");
        } else {
            $("#agent1").append("<option value='" + resultat[i][2] + "'>" + resultat[i][0] + " " + resultat[i][1] + " [ IMEI : " + resultat[i][2] + " ] </option>");
        }

        if (i == resultat.length - 1) {
            $("#agent2").append("<option value='" + resultat[i][2] + "' selected>" + resultat[i][0] + " " + resultat[i][1] + " [ IMEI : " + resultat[i][2] + " ] </option>");
        } else {
            $("#agent2").append("<option value='" + resultat[i][2] + "'>" + resultat[i][0] + " " + resultat[i][1] + " [ IMEI : " + resultat[i][2] + " ] </option>");
        }
    }
}
error_fatale = function (jqXhr) {
    rapportErreurs(jqXhr);
    afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement des agents et leurs IMEIs");
}
ajax("modules/suiviTempsReel/suiviTempsReel.php", data, error_fatale, success);
// /PARTIE REMPLISSAGE DES INPUTS SELECT

// RÉCUPÉRATION DES POSITIONS DES AGENTS
$(document).off("click", "#suivre").on("click", "#suivre", function (e) {

    map.removeLayer(coucheSuivi);
    map.addLayer(coucheSuivi);
    var coords_marche = [];

    if (!$("#tempsSync").val() || !$("#denManif").val()) {
        if (!$("#tempsSync").val()) {
            afficherNotif("warning", "Veuillez saisir le temps de synchronisation");
        } if (!$("#denManif").val()) {
            afficherNotif("warning", "Veuillez saisir la densité de manifestants");
        }
    } else {
        changerCoords();
    }
    
    function changerCoords() {
        map.removeLayer(marche);
        map.removeLayer(buffer_marche);

        data = {
            agents_pos: true,
            imei_agent1: $("#agent1").val(),
            imei_agent2: $("#agent2").val()
        }
        success = function (resultat) {
            agent1.setCoordinates(ol.proj.fromLonLat(resultat.agent1));
            agent2.setCoordinates(ol.proj.fromLonLat(resultat.agent2));

            // LINESTRING DE LA MARCHE
            if(!coords_marche.length){
                coords_marche.push(resultat.agent1);
                coords_marche.push(resultat.agent2);
                linestring = turf.lineString([resultat.agent1, resultat.agent2]);
            
            }else if(coords_marche.length >= 2){
                if(coords_marche[coords_marche.length-1][0] != resultat.agent2[0] && coords_marche[coords_marche.length-1][1] != resultat.agent2[0]){
                    coords_marche.push(resultat.agent2);
                }
                linestring = turf.bezierSpline(turf.lineString(coords_marche), {sharpness: 0.99});
            }

            marche = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: geojson.readFeatures(linestring, { featureProjection: 'EPSG:3857' })
                }),
                style: new ol.style.Style({
                    stroke: new ol.style.Stroke({
                      color: [170, 102, 204, 1],
                      width: 4
                    })
                  })
            });
            
            map.addLayer(marche);
            // /LINESTRING DE LA MARCHE

            // BUFFER DE LA MARCHE
            buffer = turf.buffer(turf.lineSlice(resultat.agent1, resultat.agent2, linestring), 10/1000); // Unité kilomètre

            buffer_marche = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: geojson.readFeatures(buffer, { featureProjection: 'EPSG:3857' })
                }),
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: [255, 68, 68, 1]
                    })
                  })
            });
            buffer_marche.animateFeature (buffer_marche.getSource().getFeatures()[0], 
				[	new ol.featureAnimation["Fade"](
					{	speed: 0.8,
						revers: true 
					})
				]);
            map.addLayer(buffer_marche);
            // /BUFFER DE LA MARCHE

            // POPUP DE LA MARCHE
            // NOMBRE DE MANIFESTANTS
            nbr_manifs = Math.round(parseInt($("#denManif").val())*turf.area(buffer));
            // /NOMBRE DE MANIFESTANTS

            // LONGUEUR DE LA MARCHE
            longueur_marche = Math.round(turf.length(buffer)*1000); 
            // /LONGUEUR DE LA MARCHE

            popup.show(ol.proj.transform(turf.pointOnFeature(buffer).geometry.coordinates, 'EPSG:4326', map.getView().getProjection()), "Manifestants estimé : "+nbr_manifs+" personnes <br>Longueur estimé : "+longueur_marche+" m");
            // /POPUP DE LA MARCHE
            
        }
        error_fatale = function (jqXhr) {
            rapportErreurs(jqXhr);
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de la récupération des positions des agents");
        }
        complete = function (){
            timeout = setTimeout(changerCoords, parseInt($("#tempsSync").val())*1000);
        }
        ajax("modules/suiviTempsReel/suiviTempsReel.php", data, error_fatale, success, complete);

    }
});
// /RÉCUPÉRATION DES POSITIONS DES AGENTS

// PARTIE RÉINITIALISATION
$(document).off("click", "#reinitSuivre").on("click", "#reinitSuivre", function (e) {
    clearTimeout(timeout);
    $("#tempsSync").val(1);
    $("#denManif").val(1);
    popup.hide();
    map.removeLayer(marche);
    map.removeLayer(buffer_marche);
    map.removeLayer(coucheSuivi);
});
// /PARTIE RÉINITIALISATION