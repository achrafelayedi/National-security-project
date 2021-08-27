// CHAMP DE RECHERCHE

$("#champRecherche").on('keyup', function (event) {
    var addrVal = $("#champRecherche").val();
    if ($("#champRecherche").val().length) {
        $("#listeAddr").show();
        getAddressList(addrVal, 'listeAddr', "http://www.navcities.com/api/geocoding/?user=demo&maxNumberOfPois=5&find=");

        // TRIGGER TOUCHE ENTRER
        if (event.keyCode === 13) {
            $( $("#listeChampRecherche").children(":first") ).click();
        }
        // /TRIGGER TOUCHE ENTRER
    } else {
        $("#listeAddr").hide();
    }
});

function getAddressList(string, id, url) {
    var res = '';
    $.ajax({
        url: url + string,
        data: {
        },
        type: 'GET',
        dataType: 'JSON',
        async: true,
        cache: false,
        timeout: 5000,
        success: function (result) {
            var features = result.features;
            if (features.length > 0) {
                res += '<div id="listeChampRecherche" class="list-group" style="max-height: 200px; overflow-y: auto;">';
                for (var i = 0; i < features.length; i++) {

                    var name = features[i].properties.nom;
                    name = name.replace(/[']/g, "|");
                    if (features[i].properties.typedata == 'POI') {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="fas fa-map-marker-alt"></i> ' + features[i].properties.nom + ' ' + features[i].properties.adresse + '</a>';

                    } else if (features[i].properties.typedata == 'Localite') {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="fas fa-map-signs"></i> ' + features[i].properties.adresse + '</a>';
                    } else {
                        res += '<a href="javascript:void(0)" onclick="getSelectedAddress(\'' + name + '\', ' + features[i].geometry.coordinates[0] + ', ' + features[i].geometry.coordinates[1] + ',\'' + id + '\');" class="list-group-item list-group-item-action"><i class="fas fa-road"></i> ' + features[i].properties.nom + '</a>';
                    }

                }
                res += '</div>';
                $("#" + id).empty();
                $("#" + id).append(res);
            }
        },
        error: function () {
            afficherNotif("warning", "Veuillez vérifier votre connexion internet et réessayez");;
        },
        complete: function () {

        }
    });
}

var mapAdvancedSearch_AddressStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: 'assets/img/marker.png'
    })
});

var mapAdvancedSearch_AddressGeometryVector = new ol.layer.Vector(
    {
        name: 'MapAdvancedSearch_Address',
        source: new ol.source.Vector(),
        style: mapAdvancedSearch_AddressStyle
    });

var map_advanced_search_address_popup = new ol.Overlay.Popup(
    {
        popupClass: "black",
        closeBox: true,
        positioning: 'auto',
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
    map_advanced_search_address_popup.addPopupClass('shadow');

function getSelectedAddress(name, longitude, latitude, id) {
    map.removeLayer(mapAdvancedSearch_AddressGeometryVector);
    map.addLayer(mapAdvancedSearch_AddressGeometryVector);

    // CACHER LA LISTE DES ADRESSES
    $("#listeAddr").hide();
    // /CACHER LA LISTE DES ADRESSES

    mapAdvancedSearch_AddressGeometryVector.getSource().clear();
    map_advanced_search_address_popup.hide(undefined, '');
    name = name.replace(/[|]/g, "'");

    var point_pos_search_inp = new ol.geom.Point(
        ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857')
    );
    
    var point_position_search_inp = new ol.Feature(point_pos_search_inp);
    mapAdvancedSearch_AddressGeometryVector.getSource().addFeature(point_position_search_inp);
    var defaultCenter = ol.proj.transform([longitude, latitude], 'EPSG:4326', 'EPSG:3857');
    
    map_advanced_search_address_popup.show(mapAdvancedSearch_AddressGeometryVector.getSource().getFeatures()[0].getGeometry().getCoordinates(), name);
    
    view.animate({
        center: defaultCenter,
        duration: 2000,
        zoom: 20
    });

}
// /CHAMP DE RECHERCHE