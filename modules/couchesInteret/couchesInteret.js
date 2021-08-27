// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(1, "couchesInteret", "Les couches d'intérêt disponibles", 33, 14);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if(!$('head').find('link[href="modules/couchesInteret/couchesInteret.css"][rel="stylesheet"]').length){
    $("<link>").attr("rel","stylesheet").attr("type","text/css").attr("href","modules/couchesInteret/couchesInteret.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/couchesInteret/couchesInteret.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE
supprimerCouches(undefined);
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE

// GESTION DES CHECKBOX DES COUCHES DISPONIBLES
$(document).on("change","#mosquees",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheMosquees", "dropdown open");
        critere = 301;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheMosquees", "dropdown");
        removePoisFeatures('Mosquée');
        $("#ulMosquees").empty();
        $("#nbrMosquees").empty();
        $("#nbrMosqueesTitre").empty();
    }
});

$(document).off("change","#ecoles").on("change","#ecoles",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheEcoles", "dropdown open");
        critere = 142;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheEcoles", "dropdown");
        removePoisFeatures('Ecole Supérieure Et Institut Public');
        $("#ulEcoles").empty();
        $("#nbrEcoles").empty();
        $("#nbrEcolesTitre").empty();
    }
});

$(document).off("change","#banques").on("change","#banques",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheBanques", "dropdown open");
        critere = 150;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheBanques", "dropdown");
        removePoisFeatures('Banque');
        $("#ulBanques").empty();
        $("#nbrBanques").empty();
        $("#nbrBanquesTitre").empty();
    }
});

$(document).off("change","#hotels").on("change","#hotels",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheHotels", "dropdown open");
        critere = 266;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheHotels", "dropdown");
        removePoisFeatures('Hotel');
        $("#ulHotels").empty();
        $("#nbrHotels").empty();
        $("#nbrHotelsTitre").empty();
    }
});

$(document).off("change","#pharmacies").on("change","#pharmacies",function () {
    if (this.checked) {
        changerClasseCss("listeCouchePharmacies", "dropdown open");
        critere = 216;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCouchePharmacies", "dropdown");
        removePoisFeatures('Pharmacie');
        $("#ulPharmacies").empty();
        $("#nbrPharmacies").empty();
        $("#nbrPharmaciesTitre").empty();
    }
});

$(document).off("change","#dispensaires").on("change","#dispensaires",function () {
    if (this.checked) {
        changerClasseCss("listeCoucheDispensaires", "dropdown open");
        critere = 207;
        getNearbyPois(critere);
        nearbyPoisGeometryVector.changed();
    } else {
        changerClasseCss("listeCoucheDispensaires", "dropdown");
        removePoisFeatures('Dispensaire, Centre Médical');
        $("#ulDispensaires").empty();
        $("#nbrDispensaires").empty();
        $("#nbrDispensairesTitre").empty();
    }
});


function removePoisFeatures(categorie) {
    nearbyPoisGeometryVector.getSource().forEachFeature(function (feature) {
        if (feature.get('souscategorie') == categorie) {
            nearbyPoisGeometryVector.getSource().removeFeature(feature);
        }
    });
}

function getNearbyPois(critere) {

    if (mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures().length > 0) {
        var features = mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures();
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
            async: true,
            cache: false,
            success: function (result) {
                if (critere == 301) {
                    $("#nbrMosquees").empty();
                    // $("#nbrMosquees").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrMosquees").append((result.features.length));
                    $("#nbrMosqueesTitre").text($('#nbrMosquees').text() + " Mosquées disponibles");
                }
                else if (critere == 142) {
                    $("#nbrEcoles").empty();
                    // $("#nbrEcoles").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrEcoles").append((result.features.length));
                    $("#nbrEcolesTitre").text($('#nbrEcoles').text() + " Écoles disponibles");

                }
                else if (critere == 150) {
                    $("#nbrBanques").empty();
                    // $("#nbrBanques").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrBanques").append((result.features.length));
                    $("#nbrBanquesTitre").text($('#nbrBanques').text() + " Banques disponibles");

                }
                else if (critere == 266) {
                    $("#nbrHotels").empty();
                    // $("#nbrHotels").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrHotels").append((result.features.length));
                    $("#nbrHotelsTitre").text($('#nbrHotels').text() + " Hôtels disponibles");

                }
                else if (critere == 216) {
                    $("#nbrPharmacies").empty();
                    // $("#nbrHotels").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrPharmacies").append((result.features.length));
                    $("#nbrPharmaciesTitre").text($('#nbrPharmacies').text() + " Pharmacies disponibles");

                }
                else if (critere == 207) {
                    $("#nbrDispensaires").empty();
                    // $("#nbrHotels").append((result.features.length + nearbyPoisGeometryVector.getSource().getFeatures().length));
                    $("#nbrDispensaires").append((result.features.length));
                    $("#nbrDispensairesTitre").text($('#nbrDispensaires').text() + " Dispensaires disponibles");

                }


                var features = geojsonFormat_geom.readFeatures(result, { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });

                nearbyPoisGeometryVector.getSource().addFeatures(features);
                var f = nearbyPoisGeometryVector.getSource().getFeatures();

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

                    for (var j = 0,i = arrayColumn(ar, 0)[0]; j < f.length; i = arrayColumn(ar, 0)[++j]) {
                        //console.log(f[i]);
                        
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
                        } else if (f[i].get('souscategorie') == 'Hôtel') {
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
                        }else if(f[i].get('souscategorie') == 'Pharmacie'){
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

                    }

                    var fin = '</span></div>';
                }

                if (critere == 301) {
                    $("#ulMosquees").empty();
                    $("#ulMosquees").append(res+res_m+fin);
                } else if (critere == 150) {
                    $("#ulBanques").empty();
                    $("#ulBanques").append(res+res_b+fin);
                } else if (critere == 142) {
                    $("#ulEcoles").empty();
                    $("#ulEcoles").append(res+res_e+fin);
                } else if (critere == 266) {
                    $("#ulHotels").empty();
                    $("#ulHotels").append(res+res_h+fin);
                }else if (critere == 216) {
                    $("#ulPharmacies").empty();
                    $("#ulPharmacies").append(res+res_p+fin);
                }else if (critere == 207) {
                    $("#ulDispensaires").empty();
                    $("#ulDispensaires").append(res+res_d+fin);
                }


            },
            error: function () {
                console.log('error parse !');
            }
        });
    }
}

function nearbyPoisStyle(feature, resolution) {
    var s = getFeatureStyle(feature);
    return s;
};

var nearbyPoisGeometryVector = new ol.layer.Vector(
    {
        name: 'Nearby Pois',
        source: new ol.source.Vector(),
        style: nearbyPoisStyle
    });
map.addLayer(nearbyPoisGeometryVector);


function getFeatureStyle(feature) {

    var st = [];

    function AppliquerStyleIcone(img){
        st.push(new ol.style.Style({
            image: new ol.style.Icon( ({
              src: "assets/img/"+img+".png"
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

function zoomToPoi(nom, coord0, coord1, el) {
    nearbyPoisGeometryVector.getSource().forEachFeature(function (feature) {
        var name = feature.get('nom').replace(/[']/g, "|");
        var cx = feature.get('x');
        var cy = feature.get('y');
        if (name == nom && cx == coord0 && cy == coord1) {
            var ext = feature.getGeometry().getExtent();
            map.getView().fit(ext, map.getSize());
            var coordinates = ol.proj.transform([Number(feature.get('x')), Number(feature.get('y'))], 'EPSG:4326', 'EPSG:3857');
            popup.show(feature.getGeometry().getCoordinates(), name);
            map.getView().setZoom(18);
        }
    });
}

// /GESTION DES CHECKBOX DES COUCHES DISPONIBLES