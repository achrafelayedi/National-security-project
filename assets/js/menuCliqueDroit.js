var mapAdvancedSearch_AddressStyleM = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'assets/img/marker.png'
    })
});

var mapAdvancedSearch_AddressGeometryVector_M = new ol.layer.Vector(
    {
        name: 'MapAdvancedSearch_Address',
        source: new ol.source.Vector(),
        style: mapAdvancedSearch_AddressStyleM
    });

//ICON DE LA RUBRIQUE RAFRAICHIR

var refresh_icon = 'assets/img/refresh-64.png';
var pois_icon = 'assets/img/poi-64.png';
var center_icon = 'assets/img/pointeur.png';
var toHere_icon = 'assets/img/to-64.png';
var fromHere_icon = 'assets/img/from-64.png';
var directions_icon = 'assets/img/directions-64.png';
var agent_icon = 'assets/img/agent-64.png';
var direction_mode = 'pieton';
var direction_geojsonFormat = new ol.format.GeoJSON();

//MENU 

var contextmenu_items = [
    {
        text: 'Agents à proximité',
        classname: 'bold',
        icon: agent_icon,
        callback: nearbyAgentContexteMenu
    },
    {
        text: 'Direction',
        icon: directions_icon,
        items: [
            {
                text: 'A partir d\'ici',
                icon: fromHere_icon,
                callback: roadFromHere
            },
            {
                text: 'Vers ici',
                icon: toHere_icon,
                callback: roadToHere
            }
        ]
    },
    {
        text: 'Centrer la carte ici',
        classname: 'bold',
        icon: center_icon,
        callback: center
    },

    {
        text: 'Couche d\'intérêt à proximité',
        classname: 'bold',
        icon: pois_icon,
        callback: nearbyPoisContexteMenu
    },
    {
        text: 'Rafraichir',
        icon: refresh_icon,
        callback: reloadMap
    },
    '-'
];

var contextmenu = new ContextMenu({
    width: 210,
    items: contextmenu_items
});
map.addControl(contextmenu);


//FONCTION DU CALLBACK DE LA RUBRIQUE RAFRAICHIR 

function roadFromHere(obj) {
    changerClasseCss("itineraire", "dropdown open");
    $("#start_location_input").next().addClass("active");

    $("#direction_road_map_content").show();
    var c = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
    getSelectedAddressRoad('Départ', c[0], c[1], 'start_location_suggestion_list', 'start_location_input', 'start');
}

function roadToHere(obj) {
    changerClasseCss("itineraire", "dropdown open");
    $("#destination_input").next().addClass("active")

    $("#direction_road_map_content").show();
    var c = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
    getSelectedAddressRoad('Destination', c[0], c[1], 'destination_suggestion_list', 'destination_input', 'destination');
}

var direction_start_popup = new ol.Overlay.Popup(
    {
        popupClass: "black",
        closeBox: true,
        positioning: 'auto',
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    direction_start_popup.addPopupClass('shadow');

var direction_destination_popup = new ol.Overlay.Popup(
    {
        popupClass: "black",
        closeBox: true,
        positioning: 'auto',
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    direction_destination_popup.addPopupClass('shadow');

var direction_styleFunction = function (feature, resolution) {
    var direction_Style = {

        'LineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 255, 255, 0.5],
                width: 5
            }), zIndex: 2
        }), new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.8],
                width: 8
            }),
            zIndex: 1
        })],
        'MultiLineString': [new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 255, 255, 0.5],
                width: 5
            }), zIndex: 2
        }), new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [255, 0, 0, 0.8],
                width: 8
            }),
            zIndex: 1
        })]
    };
    return direction_Style[feature.getGeometry().getType()];
};


var directionGeometryVector = new ol.layer.Vector(
    {
        name: 'RoadDirection',
        source: new ol.source.Vector(),
        style: direction_styleFunction
    });

function getSelectedAddressRoad(name, longitude, latitude, id_ul, id_input, type) {
    name = name.replace(/[|]/g, "'");
    directionGeometryVector.getSource().forEachFeature(function (feature) {
        var typ = feature.get('type');
        if (typ == type) {
            directionGeometryVector.getSource().removeFeature(feature);
        }
    });
    if (type == 'start') {
        direction_start_popup.hide(undefined, '');
        var point_pos_search_inp = new ol.geom.Point(
            ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')
        );
        var point_position_map_road_direction = new ol.Feature(point_pos_search_inp);
        point_position_map_road_direction.set('type', 'start');
        point_position_map_road_direction.set('image', 'assets/images/pois.png');
        directionGeometryVector.getSource().addFeature(point_position_map_road_direction);
        direction_start_popup.show(point_position_map_road_direction.getGeometry().getCoordinates(), '<i class="fas fa-map-marker-alt"></i> ' + name);
    } else {
        direction_destination_popup.hide(undefined, '');
        var point_pos_search_inp = new ol.geom.Point(
            ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')
        );
        var point_position_map_road_direction = new ol.Feature(point_pos_search_inp);
        point_position_map_road_direction.set('type', 'destination');
        point_position_map_road_direction.set('image', 'assets/images/pois.png');
        directionGeometryVector.getSource().addFeature(point_position_map_road_direction);
        direction_destination_popup.show(point_position_map_road_direction.getGeometry().getCoordinates(), '<i class="fas fa-map-marker-alt"></i> ' + name);
    }

    $("#" + id_input).val(name);
    $("#" + id_ul).hide();

    var extent = directionGeometryVector.getSource().getExtent();
    map.getView().fit(extent, map.getSize());

    executeRoadMap();
}

function executeRoadMap() {
    if (directionGeometryVector.getSource().getFeatures().length > 1) {
        var coordStart, coordDestination;
        directionGeometryVector.getSource().forEachFeature(function (feature) {
            var typ = feature.get('type');
            if (typ == 'start') {
                coordStart = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

            } else if (typ == 'destination') {

                coordDestination = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
            }
        });

        directionGetRoadDirection(coordStart, coordDestination, direction_mode, 'service', true, 'road_map_tab');
    }
}

map.addLayer(directionGeometryVector);
map.addOverlay(direction_start_popup);
map.addOverlay(direction_destination_popup);


function directionGetRoadDirection(start, destination, mode, service, roadmap, id_roadmap_content) {

    $.ajax({
        url: 'http://www.navcities.com/api/routing/?&user=demo&txtstartpoint=your_start_adresse&txtendpoint=your_end_adresse&hwy=0&tr=0&piste=0',
        data: {
            startpoint: start[0] + ',' + start[1],
            finalpoint: destination[0] + ',' + destination[1],
            mode: mode
        },
        type: 'GET',
        dataType: 'JSON',
        success: function (result) {
            directionGeometryVector.getSource().forEachFeature(function (feature) {
                if (feature.getGeometry().getType() != 'Point') {
                    directionGeometryVector.getSource().removeFeature(feature);
                }
            });
            var features = direction_geojsonFormat.readFeatures(result, { featureProjection: 'EPSG:3857' });
            directionGeometryVector.getSource().addFeatures(features);

        },
        error: function () {
            displayNotificationsAlerts('Road Map Direction', '<p style="text-align: left !important">Erreur de calcul, données incomplètes.. !</p>', 'alert.png', '3000');
        },
        complete: function () {
            var extent = directionGeometryVector.getSource().getExtent();
            map.getView().fit(extent, map.getSize());
            if (roadmap) {
                mapRoadDirectionGetRoadMap(start, destination, mode, service, id_roadmap_content);
            }
        }
    });
}

function activatePoisTab(a) {
    document.getElementById(a).click();
    console.log(a);
}

function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

function center(obj) {
    view.animate({
        duration: 700,
        easing: elastic,
        center: obj.coordinate
    });
}

// function agentsProximite(obj) {
//     view.animate({
//         center: obj.coordinate,
//         zoom:16
//     });
// }


function nearbyAgentContexteMenu(obj){
    var c = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
    getNearbyAgentsPopup('Where you clicked', obj.coordinate[0], obj.coordinate[1]);
    
    
}

function getNearbyAgentsPopup(name, longitude, latitude){
    $("#main_agent_list_content").show();
    $('.agent-toggle').removeClass('close').addClass('open');
    $('.agent-toggle').empty();
    
    var c = ol.proj.transform([longitude, latitude], 'EPSG:3857', 'EPSG:4326');
    data = {
        tableAttributaire_distance: true,
        lon: c[0],
        lat: c[1]
    }
    // REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE AGENT - DISTANCE
    remplirTableAttributaire("agent", "modules/gestionAgents/gestionAgents.php", data, [[ 5, "asc" ]]);
    // /REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE AGENT - DISTANCE
    
}

function mapRoadDirectionGetRoadMap(start, destination, mode, service, id_roadmap_content) {
    $("#" + id_roadmap_content).empty();
    $("#" + id_roadmap_content).append('<p><h3> Chargement ... </h3></p>');
    $.ajax({
        url: 'http://www.navcities.com/api/routing/roadmap.php?tr=0&piste=0&hwy=0&txtstartpoint=&txtendpoint=&user=userkey',
        data: {
            startpoint: start[0] + ',' + start[1],
            finalpoint: destination[0] + ',' + destination[1],
            mode: mode
        },
        type: 'GET',
        dataType: 'html',
        success: function (result) {
            $("#" + id_roadmap_content).empty();
            $("#" + id_roadmap_content).append(result);
        },
        error: function () {
            displayNotificationsAlerts('Road Map', '<p style="text-align: left !important">Erreur de calcul de feuille de route, données incomplètes.. !</p>', 'alert.png', '3000');
        },
        complete: function () {
            $("#main_pois_list_content").show();
            $('.pois-toggle').removeClass('close').addClass('open');
            $('.pois-toggle').empty();
            $('.pois-toggle').append('<i class="icon-chevron-thin-right"></i>');
        }
    });
}

function reloadMap(obj) {
    location.reload();
}


function removePoisFeatures(categorie) {
    nearbyPoisGeometryVector_M.getSource().forEachFeature(function (feature) {
        if (feature.get('souscategorie') == categorie) {
            nearbyPoisGeometryVector_M.getSource().removeFeature(feature);
        }
    });
    $("#nearby_pois_count").empty();
    $("#nearby_pois_count").append(nearbyPoisGeometryVector_M.getSource().getFeatures().length + ' POIS');
}

function zoomToPoi(nom, coord0, coord1, el) {
    nearbyPoisGeometryVector_M.getSource().forEachFeature(function (feature) {
        var name = feature.get('nom').replace(/[']/g, "|");
        var cx = feature.get('x');
        var cy = feature.get('y');
        if (name == nom && cx == coord0 && cy == coord1) {
            var ext = feature.getGeometry().getExtent();
            map.getView().fit(ext, map.getSize());
            var coordinates = ol.proj.transform([Number(feature.get('x')), Number(feature.get('y'))], 'EPSG:4326', 'EPSG:3857');
            popup.show(feature.getGeometry().getCoordinates(), name);
            map.getView().setZoom(17);
        }
    });
//    removeActiveClass();
    $(el).addClass("active");
}


function nearbyPoisContexteMenu(obj) {

    nearbyPoisGeometryVector_M.getSource().clear()
    map.removeLayer(nearbyPoisGeometryVector_M);
    
    map.removeLayer(mapAdvancedSearch_AddressGeometryVector_M);
    map.addLayer(mapAdvancedSearch_AddressGeometryVector_M);
    
    map.addLayer(nearbyPoisGeometryVector_M);

    getNearbyPoisPopup('Where you clicked', obj.coordinate[0], obj.coordinate[1]);
    //COUCHE DES ECOLES
    changerClasseCss("listeCoucheEcoles", "dropdown");
    critere = 142;
    getNearbyPois_menuCliDroit(critere);
    nearbyPoisGeometryVector_M.changed();

    //COUCHE DES MOSQUEES
    changerClasseCss("listeCoucheMosquees", "dropdown");
    critere = 301;
    getNearbyPois_menuCliDroit(critere);
    nearbyPoisGeometryVector_M.changed();

    //COUCHE DES BANQUES
    changerClasseCss("listeCoucheBanques", "dropdown");
    critere = 150;
    getNearbyPois_menuCliDroit(critere);
    nearbyPoisGeometryVector_M.changed();

    //COUCHE DES HOTELS
    changerClasseCss("listeCoucheHotels", "dropdown");
    critere = 266;
    getNearbyPois_menuCliDroit(critere);
    nearbyPoisGeometryVector_M.changed();

    //COUCHE DES PHARMACIES
    changerClasseCss("listeCouchePharmacies", "dropdown");
    critere = 216;
    getNearbyPois_menuCliDroit(critere);
    nearbyPoisGeometryVector_M.changed();

     //COUCHE DES PHARMACIES
     changerClasseCss("listeCoucheDispensaires", "dropdown");
     critere = 207;
     getNearbyPois_menuCliDroit(critere);
     nearbyPoisGeometryVector_M.changed();

     return nearbyPoisGeometryVector_M.changed();
}



function getNearbyPoisPopup(name, longitude, latitude) {
    mapAdvancedSearch_AddressGeometryVector_M.getSource().clear();
    map_advanced_search_address_popup.hide(undefined, '');
    $("#address_find_input").val(name);
    $("#nearby_address").empty();
    $("#nearby_address").append(name);
    var point_pos_search_inp = new ol.geom.Point([longitude, latitude]);
    var point_position_search_inp = new ol.Feature(point_pos_search_inp);
    mapAdvancedSearch_AddressGeometryVector_M.getSource().addFeature(point_position_search_inp);
}

function nearbyPoisStyle(feature, resolution) {
    var s = getFeatureStyle(feature);
    return s;
};

var nearbyPoisGeometryVector_M = new ol.layer.Vector(
    {
        name: 'Nearby Pois',
        source: new ol.source.Vector(),
        style: nearbyPoisStyle
    });

function getNearbyPois_menuCliDroit(critere) {

    if (mapAdvancedSearch_AddressGeometryVector_M.getSource().getFeatures().length > 0) {
        var features = mapAdvancedSearch_AddressGeometryVector_M.getSource().getFeatures();
        var coordinates = ol.proj.transform(features[0].getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');

        var res = '', res_b = '', res_e = '', res_h = '', res_m = '', res_p = '', res_d = '';

        $.ajax({
            url: 'http://www.navcities.com/api/proximite/?user=demo&maxNumberOfPois=20',
            data: {
                lon: coordinates[0],
                lat: coordinates[1],
                crit: critere
            },
            type: 'GET',
            dataType: 'JSON',
            success: function (result) {

                if (critere == 301) {
                    $("#nbrMosquees").empty();

                    $("#nbrMosquees").append((result.features.length));
                    $("#nbrMosqueesTitre").text($('#nbrMosquees').text() + " Mosquées disponibles");
                }
                else if (critere == 142) {
                    $("#nbrEcoles").empty();
                    // $("#nbrEcoles").append((result.features.length + nearbyPoisGeometryVector_M.getSource().getFeatures().length));
                    $("#nbrEcoles").append((result.features.length));
                    $("#nbrEcolesTitre").text($('#nbrEcoles').text() + " Écoles disponibles");

                }
                else if (critere == 150) {
                    $("#nbrBanques").empty();
                    $("#nbrBanques").append((result.features.length));
                    $("#nbrBanquesTitre").text($('#nbrBanques').text() + " Banques disponibles");

                }
                else if (critere == 266) {
                    $("#nbrHotels").empty();
                    $("#nbrHotels").append((result.features.length));
                    $("#nbrHotelsTitre").text($('#nbrHotels').text() + " Hôtels disponibles");

                }
                else if (critere == 216) {
                    $("#nbrPharmacies").empty();
                    $("#nbrPharmacies").append((result.features.length));
                    $("#nbrPharmaciesTitre").text($('#nbrPharmacies').text() + "Pharmacies disponibles");

                }
                else if (critere == 207) {
                    $("#nbrDispensaires").empty();
                    $("#nbrDispensaires").append((result.features.length));
                    $("#nbrDispensairesTitre").text($('#nbrDispensaires').text() + "Pharmacies disponibles");

                }


                var features = geojsonFormat_geom.readFeatures(result, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

                nearbyPoisGeometryVector_M.getSource().addFeatures(features);
                var f = nearbyPoisGeometryVector_M.getSource().getFeatures();

                if (f.length > 0) {
                    res += '<div class="todo-actions" style="overflow-y: scroll; height:250px;" >';
                    res += '<span class="desc">';

                    function arrayColumn(arr, n) {
                        return arr.map(x => x[n]);
                    }

                    var ar = [];
                    for (var i = 0; i < f.length; i++) {
                        ar.push([i, f[i].get("distance")]);
                    }

                    ar.sort(function (a, b) {
                        return a[1] - b[1];
                    });

                    for (var j = 0, i = arrayColumn(ar, 0)[0]; j < f.length; i = arrayColumn(ar, 0)[++j]) {


                        var dis = ((f[i].get("distance") < 1000) ? Math.round(f[i].get("distance")) + ' m' : (f[i].get("distance") / 1000).toFixed(3) + ' km');

                        if (f[i].get('souscategorie') == 'Ecole Supérieure Et Institut Public') {
                            res_e += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_e += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_e += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_e += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_e += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_e += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_e += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }

                        } 
                        else if(f[i].get('souscategorie') == 'Pharmacie'){
                            res_p += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_p += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_p += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';
                             if (f[i].get("tl") != "") {
                                res_p += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_p += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_p += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_p += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        }else if(f[i].get('souscategorie') == 'Dispensaire, Centre Médical'){
                            res_d += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_d += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_d += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';
                             if (f[i].get("tl") != "") {
                                res_d += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_d += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_d += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_d += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        }
                        
                        else if (f[i].get('souscategorie') == 'Hôtel') {
                            res_h += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_h += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_h += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_h += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_h += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_h += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_h += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        } else if (f[i].get('souscategorie') == 'Banque') {
                            res_b += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_b += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_b += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_b += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_b += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_b += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_b += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        } else if (f[i].get('souscategorie') == 'Mosquée') {
                            res_m += '<a href="javascript:void(0);" onclick="zoomToPoi(\'' + f[i].get("nom").replace(/[']/g, "|") + '\',\'' + f[i].get("x") + '\',\'' + f[i].get("y") + '\', this)" class="list-group-item list-group-item-action flex-column align-items-start">';
                            res_m += '<div class="d-flex w-100 justify-content-between"><h5 style="margin-top: 0px;margin-bottom: 0px;" ><i class="glyphicon glyphicon-bookmark" style="margin-top: 11px;color: #007aff;"></i> ' + f[i].get("nom") + '</h5><small><span class="badge badge-secondary" style="background-color: #ff1744;" >' + dis + '</span></small><br /></div>';
                            res_m += '<strong>' + f[i].get("adresse") + '</strong><br />' + f[i].get("categorie") + '<br /><small>' + f[i].get("souscategorie") + '</small><br />';

                            if (f[i].get("tl") != "") {
                                res_m += '<small><i class="icon-phone" style="color: green"></i> ' + f[i].get("tl") + '</small><br />';
                            }
                            if (f[i].get("fax") != "") {
                                res_m += '<small><i class="icon-tv2"  style="color: blue"></i> ' + f[i].get("fax") + '</small><br />';
                            }
                            if (f[i].get("email") != "") {
                                res_m += '<small><i class="icon-mail5"  style="color: red"></i> ' + f[i].get("email") + '</small><br />';
                            }
                            if (f[i].get("siteweb") != "") {
                                res_m += '<small><i class="icon-at"  style="color: black"></i> ' + f[i].get("siteweb") + '</small><br />';
                            }
                        }

                    }

                    var fin = '</span></div>';
                }

                if (critere == 301) {
                    $("#ulMosquees").empty();
                    $("#ulMosquees").append(res + res_m + fin);
                }else if (critere == 216) {
                    $("#ulPharmacies").empty();
                    $("#ulPharmacies").append(res+res_p+fin);
                }else if (critere == 207) {
                    $("#ulDispensaires").empty();
                    $("#ulDispensaires").append(res+res_d+fin);
                } else if (critere == 150) {
                    $("#ulBanques").empty();
                    $("#ulBanques").append(res + res_b + fin);
                } else if (critere == 142) {
                    $("#ulEcoles").empty();
                    $("#ulEcoles").append(res + res_e + fin);
                } else if (critere == 266) {
                    $("#ulHotels").empty();
                    $("#ulHotels").append(res + res_h + fin);
                }


            },
            error: function () {
                console.log('error parse !');
            },
            complete: function () {
                $("#main_pois_list_content").show();
                $('.pois-toggle').removeClass('close').addClass('open');
                $('.pois-toggle').empty();
                $('.pois-toggle').append('<i class="icon-chevron-thin-right"></i>');
            }
        });
    }
}

function getFeatureStyle(feature) {

    var st = [];

    function AppliquerStyleIcone(img) {
        st.push(new ol.style.Style({
            image: new ol.style.Icon(({
                // anchor: [0.5, 46],
                // anchorXUnits: 'fraction',
                // anchorYUnits: 'pixels',

                anchor: [0.5, 1],
        src: "assets/img/" + img + ".png"
            }))
        }));
    }

    switch (feature.get('souscategorie')) {
        case "Banque":
            AppliquerStyleIcone("banque");
            break;
        case "Mosquée":
            AppliquerStyleIcone("mosquee");
            break;
        case "Ecole Supérieure Et Institut Public":
            AppliquerStyleIcone("ecole");
            break;
        case "Hôtel":
            AppliquerStyleIcone("hotel");
            break;
        case "Pharmacie":
            AppliquerStyleIcone("pharmacie");
            break;
        case "Dispensaire, Centre Médical":
            AppliquerStyleIcone("dispensaire");
            break;
    }

    return st;
}


$("#start_location_input" ).on('keyup', function(event) {
    /*$("#a_map_road_direction_pick_start").removeClass('btn-green');
    $("#a_map_road_direction_pick_start").addClass('btn-blue');*/
    StartPickerBoolean = true;

    var l  =$( "#start_location_input" ).val().length;
    var ll =$( "#start_location_input" ).val();
    if(l>1){
        $("#start_location_suggestion_list").show();
        getAddressRoadList(ll,'start_location_suggestion_list',"http://www.navcities.com/api/geocoding/?user=demo&maxNumberOfPois=5&find=",'start_location_input','start');
        /*getPOI(ll,'div_search_adr_suggestions');*/
    }else {
        $("#start_location_suggestion_list").hide();
    }  
});

$("#destination_input" ).on('keyup', function(event) {
    /*$("#a_map_road_direction_pick_destination").removeClass('btn-green');
    $("#a_map_road_direction_pick_destination").addClass('btn-blue');*/
    DestinationPickerBoolean = true;

    var l  =$( "#destination_input" ).val().length;
    var ll =$( "#destination_input" ).val();

    if(l>1){
        $("#destination_suggestion_list").show();
        getAddressRoadList(ll,'destination_suggestion_list',"http://www.navcities.com/api/geocoding/?user=demo&maxNumberOfPois=5&find=", 'destination_input', 'destination');
        /*getPOI(ll,'div_search_adr_suggestions');*/
    }else {
        $("#destination_suggestion_list").hide();
    }  
});


function getAddressRoadList(string, id, url, id_input,type){
    //console.log(string+'||'+id+'||'+url);
    var res ='';
    $.ajax({
        url: url+string,
        data:{
        },
        type: 'GET',
        dataType: 'JSON',
        success: function(result) {
            var features = result.features;
            if(features.length > 0){
                res+='<div class="list-group" style="max-height: 115px; overflow-y: auto;">';
                for (var i = 0; i < features.length; i++) {
                    
                    var name = features[i].properties.nom;
                    name = name.replace(/[']/g, "|");
                    //console.log(name);
                    if(features[i].properties.typedata=='POI'){
                        res+='<a href="javascript:void(0)" onclick="getSelectedAddressRoad(\''+name+'\', '+features[i].geometry.coordinates[0]+', '+features[i].geometry.coordinates[1]+',\''+id+'\',\''+id_input+'\',\''+type+'\');" class="list-group-item list-group-item-action waves-effect" style="padding-left: 20px !important;"><i class="fas fa-map-marker-alt"></i> '+features[i].properties.nom+' '+features[i].properties.adresse+'</a>';	
                    }else if(features[i].properties.typedata=='Localite'){
                        res+='<a href="javascript:void(0)"  onclick="getSelectedAddressRoad(\''+name+'\', '+features[i].geometry.coordinates[0]+', '+features[i].geometry.coordinates[1]+',\''+id+'\',\''+id_input+'\',\''+type+'\');" class="list-group-item list-group-item-action waves-effect" style="padding-left: 20px !important;"><i class="fas fa-map-signs"></i> '+features[i].properties.adresse+'</a>';
                    }else{
                        res+='<a href="javascript:void(0)" onclick="getSelectedAddressRoadDepart(\''+name+'\', '+features[i].geometry.coordinates[0]+', '+features[i].geometry.coordinates[1]+',\''+id+'\',\''+id_input+'\',\''+type+'\');" class="list-group-item list-group-item-action waves-effect" style="padding-left: 20px !important;"><i class="fas fa-road"></i> '+features[i].properties.nom+'</a>';
                    }
                    
                }
                res+='</div>';
                $("#"+id).empty();
                $("#"+id).append(res);
            }
        },
        error: function(){
            console.log('error parse !');
        },
        complete: function(){
            
        }
    });
}


$("#direction_mode_driving").on('click', function(){
    direction_mode='court';
    executeRoadMap();
});

$("#direction_mode_walking").on('click', function(){
    direction_mode='pieton';
    executeRoadMap();
});

$("#direction_mode_fast").on('click', function(){
    direction_mode='rapide';
    executeRoadMap();
});

$("#direction_startover").on('click', function(){
    $("#start_location_input").val("");
    $("#destination_input").val("");
    directionGeometryVector.getSource().clear();
    direction_start_popup.hide(undefined, '');
    direction_destination_popup.hide(undefined, '');
    $("#road_map_tab").empty();
    $("#road_map_tab").empty();
});