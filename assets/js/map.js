// DECLARATION DES VARIABLES
var defaultCenter = ol.proj.transform([-6.863757, 34.010152], 'EPSG:4326', 'EPSG:3857');
var defaultExtent = [-840080.4335449198, 3988950.4443487297, -674212.0821660873, 4072419.6792361424];
var geojsonFormat_geom = new ol.format.GeoJSON();
var draw;
var coucheArrondis;
var coucheRues;
var navcitiesXYZSource = new ol.source.XYZ({
    attributions: [new ol.Attribution({
        html: 'Tiles © <a href="https://www.navcities.com">Navcities</a>'
    })],
    url: "http://www.navcities.com/mapcache/tms/1.0.0/lintermediaire@NavG/{z}/{x}/{-y}.png",
    crossOrigin: 'Anonymous'

});
var navcitiesMaps = new ol.layer.Tile({
    name: 'Navcities Maps',
    visible: true,
    preload: Infinity,
    source: navcitiesXYZSource
});
var view = new ol.View({
    center: defaultCenter,
    extent: defaultExtent,
    zoom: 14,
    minZoom: 14,
    maxZoom: 18
})
var map = new ol.Map({
    layers: [navcitiesMaps],
    target: 'map',
    view: view
});
// /DECLARATION DES VARIABLES

// ACTIVATION DE POINTEUR SUR LES FEATURES
function activerPointeurSurFeatures(e){
    if (e.dragging) return;
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel, {
        layerFilter: function (layer) {
            if(layer !== coucheRues){
                return true;
            }
        }
    });

    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
}
// /ACTIVATION DE POINTEUR SUR LES FEATURES

// CHANGEMENT DE POINTEUR LORS DE L'AJOUT
function changerPointeurAjout(icone = "pointeur.png", check = false) {

    draw = new ol.interaction.Draw({
        type: 'Point',
        style: new ol.style.Style({
            image: new ol.style.Icon({
                src: "assets/img/"+icone,
                size: [128, 128],
                opacity: 1,
                scale: 0.4
            })
        })
    });

    $("#map").mouseover(function () {
        if ($("#collapseTwo").attr("class") == "panel-collapse collapse in" || check) {
            $("#map").css("cursor", "none");
            map.addInteraction(draw);
        } else {
            map.removeInteraction(draw);
            $("#map").css("cursor", "default");
        }
    });

    $("#map").mouseout(function () {
        map.removeInteraction(draw);
        $("#map").css("cursor", "visible");
    });

}
// /CHANGEMENT DE POINTEUR LORS DE L'AJOUT

// SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE
function supprimerCouches(couche) {

    function f(id){
        $("#ul"+id).empty();
        $("#nbr"+id).empty();
        $("#nbr"+id+"Titre").empty();

    }

    f("Mosquees");
    f("Ecoles");
    f("Banques");
    f("Hotels");
    f("Pharmacies");
    f("Dispensaires");

    couches = [];
    if (typeof coucheAccident !== "undefined") {
        couches.push(coucheAccident);
    }
    if (typeof coucheCrime !== "undefined") {
        couches.push(coucheCrime);
    }
    if (typeof coucheAgent !== "undefined") {
        couches.push(coucheAgent);
    }
    if (typeof vectorStatis !== "undefined") {
        couches.push(vectorStatis);
    }
    if (typeof cercle !== "undefined") {
        couches.push(cercle);
    }
    if (typeof coucheSuivi !== "undefined") {
        couches.push(coucheSuivi);
    }
    if (typeof trajet !== "undefined") {
        couches.push(trajet);
    }
    if (typeof pts_inters !== "undefined") {
        couches.push(pts_inters);
    }
    if (typeof pts_inters2 !== "undefined") {
        couches.push(pts_inters2);
    }
    if (typeof buffer_trajet !== "undefined") {
        couches.push(buffer_trajet);
    }
    if (typeof nearbyPoisGeometryVector_M !== "undefined") {
        couches.push(nearbyPoisGeometryVector_M);
    }
    if (typeof nearbyPoisGeometryVector !== "undefined") {
        couches.push(nearbyPoisGeometryVector);
    }
    if (typeof mapAdvancedSearch_AddressGeometryVector_M !== "undefined") {
        couches.push(mapAdvancedSearch_AddressGeometryVector_M);
    }
    if (typeof mapAdvancedSearch_AddressGeometryVector !== "undefined") {
        couches.push(mapAdvancedSearch_AddressGeometryVector);
    }
    if (typeof pts_intersection !== "undefined") {
        couches.push(pts_intersection);

        coucheRues.getSource().getFeatures().forEach(function(f){
            f.setStyle(new ol.style.Style ({
                stroke: new ol.style.Stroke({
                   color: [23, 39, 38, 1],
                    width: 2
                  })                               
            }));
        });
        
    }
    
    for (i = 0; i < couches.length; i++) {
        if (couches[i] != couche) {
            map.removeLayer(couches[i]);
        }
    }
    
}
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE

// CALCULE DE CENTROÏDE
function calculerCentroide(couche){
    var x_somme=0, y_somme = 0, i=0;
    couche.getSource().forEachFeature(function (feature) {
        coords = ol.proj.transform(feature.getGeometry().getCoordinates(), 'EPSG:3857', 'EPSG:4326');
        x_somme += coords[0];
        y_somme += coords[1];
        i++;
    });
    
    return Array(x_somme/i, y_somme/i);
}
// /CALCULE DE CENTROÏDE

// IMPULSION SUR LA CARTE
function pulse(lonlat, popuptext) {
    var nb = 6;
    popup.show(ol.proj.transform(lonlat, 'EPSG:4326', map.getView().getProjection()), popuptext);
    for (var i = 0; i < nb; i++) {
        setTimeout(function () {
            pulseFeature(ol.proj.transform(lonlat, 'EPSG:4326', map.getView().getProjection()));
        }, i * 500);
    };
}
function pulseFeature(coord) {

    var f = new ol.Feature(new ol.geom.Point(coord));
    f.setStyle(new ol.style.Style(
        {
            image: new ol.style["Circle"](
                {
                    radius: 30,
                    points: 4,
                    stroke: new ol.style.Stroke({ color: "red", width: 2 })
                })
        }));
    map.animateFeature(f, new ol.featureAnimation.Zoom(
        {
            fade: ol.easing.easeOut,
            duration: 3000,
            easing: ol.easing["upAndDown"]
        }));
}
// /IMPULSION SUR LA CARTE

// DÉFINITION DE POP-UP
var popup = new ol.Overlay.Popup (
    {	popupClass: "black",
        closeBox: true,
        positioning: 'auto',
        autoPan: true,
        autoPanAnimation: { duration: 250 }
    });
popup.addPopupClass('shadow');
map.addOverlay(popup);
// /DÉFINITION DE POP-UP

// EXPORTATION DE LA CARTE
$("#exporterCartePDF").click(function (e) {
    var format = new ol.format.WKT();

    var dims = {
        a0: [1189, 841],
        a1: [841, 594],
        a2: [594, 420],
        a3: [420, 297],
        a4: [297, 210],
        a5: [210, 148]
    };

    var loading = 0;
    var loaded = 0;

    afficherNotif("info", "L\'exportation en cours ...", undefined, true, false);

    var format = document.getElementById('format').value;
    var resolution = document.getElementById('resolution').value;
    var dim = dims[format];
    var width = Math.round(dim[0] * resolution / 25.4);
    var height = Math.round(dim[1] * resolution / 25.4);
    var size = /** @type {ol.Size} */ (map.getSize());
    var extent = map.getView().calculateExtent(size);

    var source = navcitiesMaps.getSource();

    var tileLoadStart = function () {
        ++loading;
    };

    var tileLoadEnd = function () {
        ++loaded;
        if (loading === loaded) {
            var canvas = this;
            window.setTimeout(function () {
                loading = 0;
                loaded = 0;
                var data = canvas.toDataURL('image/png');
                var pdf = new jsPDF('landscape', undefined, format);
                pdf.addImage(data, 'JPEG', 5, 5, dim[0] - 10, dim[1] - 10);
                pdf.save('map.pdf');
                source.un('tileloadstart', tileLoadStart);
                source.un('tileloadend', tileLoadEnd, canvas);
                source.un('tileloaderror', tileLoadEnd, canvas);
                map.setSize(size);
                map.getView().fit(extent);
                map.renderSync();
                $('.notifyjs-corner').empty();
                afficherNotif("succes", "Le fichier PDF a été bien exporté avec succès");
            }, 100);
        }
    };

    map.once('postcompose', function (event) {
        source.on('tileloadstart', tileLoadStart);
        source.on('tileloadend', tileLoadEnd, event.context.canvas);
        source.on('tileloaderror', tileLoadEnd, event.context.canvas);
    });

    map.setSize([width, height]);
    map.getView().fit(extent);
    map.renderSync();
});

$("#exporterCartePNG").click(function (e) {

    map.once('postcompose', function (event) {
        var canvas = event.context.canvas;
        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(canvas.msToBlob(), '4eme_arrondissement.png');
        } else {
            canvas.toBlob(function (blob) {
                saveAs(blob, '4eme_arrondissement.png');
            });
        }
    });
    map.renderSync();
});


$("#imprimerCarte").click(function (e) {
    
    $("#map").children().children(".ol-unselectable").printThis({
        pageTitle: "Carte du 4ème Arrondissement", 
        printDelay: 0, 
        importCSS: false,
        canvas: true
    });

});

// /EXPORTATION DE LA CARTE


// L'AJOUT DE LA COUCHE FRONTIÈRE
// data = {
//     frontiere: true
// }
// actualiserCouche("coucheArrondis", 'coucheArrondis', 'Couche Arrondis', data);
// /L'AJOUT DE LA COUCHE FRONTIÈRE

// L'AJOUT DE LA COUCHE RUES
data = {
    rues: true
}
actualiserCouche("coucheRues", 'coucheRues', 'Couche Rues', data);
// /L'AJOUT DE LA COUCHE RUES


function actualiserCouche(couche, name, title, data) {

    geojson = new ol.format.GeoJSON();
    source_couche = new ol.source.Vector();

    // DÉFINITION DU STYLE DE LA COUCHE
    style = new ol.style.Style ({
        stroke: new ol.style.Stroke({
           color: [23, 39, 38, 1],
            width: 2
          })                               
      });
    // /DÉFINITION DU STYLE DE LA COUCHE

    // DÉFINITION DE LA COUCHE ARRONDIS
    window[couche] = new ol.layer.Vector({
        name: name,
        title: title,
        visible: true,
        source: source_couche,
        style: style
    });
    // /DÉFINITION DE LA COUCHE ARRONDIS

    // SUPPRESSION DU CONTENU DE LA COUCHE
    source_couche.clear();
    // /SUPPRESSION DU CONTENU DE LA COUCHE

    // L'APPEL AJAX AVEC LES PARAMÈTRES
    data = data
    success = function (result) {
        
        var features = geojson.readFeatures(result, { featureProjection: 'EPSG:3857' });
        source_couche.addFeatures(features);
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "error parse!");
    }   
    ajax("assets/php/fonctions.php", data, error_fatale, success);
    // /L'APPEL AJAX AVEC LES PARAMÈTRES

    // L'AJOUT DE LA COUCHE À LA CARTE
    map.addLayer(window[couche]);
    // /L'AJOUT DE LA COUCHE À LA CARTE

}

// TRANSFORMER LA COUCHE VECTEUR VERS UN OBJET GEOJSON
function coucheVersGeoJSON(couche) {
    geojson = new ol.format.GeoJSON();

    as_geojson = geojson.writeFeatures(couche.getSource().getFeatures(), {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
    });

    return(JSON.parse(as_geojson));
}
// /TRANSFORMER LA COUCHE VECTEUR VERS UN OBJET GEOJSON