// DECLARATION DES VARIABLES
var accidentologie_geojson = new ol.format.GeoJSON(), source_couche_accident = new ol.source.Vector();
var json, coords, coucheAccident, execFonc = false, gid, mindate = '0';
var vectorStatis;
// /DECLARATION DES VARIABLES

// INTERACTION GRAPHIQUE POUR LE MENU DROIT
interactionGraphiqueMenuDeNavigation(3, "accidentologie", "Boîte à outils accidentologie", 43, 0);
// /INTERACTION GRAPHIQUE POUR LE MENU DROIT

// LE STYLE CSS DU CONTENU HTML DU MENU DROIT
if(!$('head').find('link[href="modules/accidentologie/accidentologie.css"][rel="stylesheet"]').length){
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/accidentologie/accidentologie.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML DU MENU DROIT

// LE CONTENU HTML DU MENU DROIT
$.get("modules/accidentologie/accidentologie.html", function (data) {
    $("#style_selector div:eq(1)").after().append(data);
});
// /LE CONTENU HTML DU MENU DROIT

// CACHER TOUS LES POP-UPS
popup.hide();
// CACHER TOUS LES POP-UPS

// AFFICHAGE DE LA COUCHE ACCIDENT
actualiserCoucheAccident();
// /AFFICHAGE DE LA COUCHE ACCIDENT

// SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE
supprimerCouches(coucheAccident);
// /SUPPRESSION DE TOUTES LES AUTRES COUCHES SAUF LA COUCHE PASSÉE EN PARAMÈTRE

// GESTION DE CLIQUE SUR UNE LIGNE DE LA TABLE ATTRIBUTAIRE D'ACCIDENTS
cliqueLigneTableAttr(coucheAccident, "Accident");
// /GESTION DE CLIQUE SUR UNE LIGNE DE LA TABLE ATTRIBUTAIRE D'ACCIDENTS

// FAIRE RESSORTIR LA DATE MIN
data = {
    mindate: true
}
success = function (resultat) {
    mindate = resultat;
}
ajax("modules/accidentologie/accidentologie.php", data, undefined, success);
// /FAIRE RESSORTIR LA DATE MIN

// PARTIE MODIFICATION OU BIEN LE DÉPLACEMENT
function singleclick (evt) {
    features = [];
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        return feature;
    });
    if (feature) {

        $("#modifierAccidentBouton").prop("disabled", false);
        
        $("#pointerAccidentModifier").hide();
        $("#pointerAccidentModifierNouvEmplace").show();
        
        $("#modifierAccident #nbrBlesses").next().addClass("active");
        $("#modifierAccident #nbrMorts").next().addClass("active");
        $("#modifierAccident #description").next().addClass("active");
        $("#modifierAccident #heurem").next().addClass("active");
        $("#modifierAccident #datem").next().addClass("active");

        $("#modifierAccident #nbrBlesses").val(feature.get("nbrblesses"));
        $("#modifierAccident #nbrMorts").val(feature.get("nbrmorts"));
        $("#modifierAccident #gravite").val(feature.get("gravite") == 'f' ? "false" : (feature.get("gravite") == 't' ? "true" : "null"));
        $("#modifierAccident #description").val(feature.get("description"));
        $("#modifierAccident #heurem").val( feature.get("dateheure")? feature.get("dateheure").split(" ")[1]: '' );
        $("#modifierAccident #datem").val( feature.get("dateheure")? feature.get("dateheure").split(" ")[0]: '' );
        gid = feature.get("gid");
    }

};

function onClique(evt){
    coords = ol.proj.toLonLat(evt.coordinate);
    $("#pointerAccidentModifierNouvEmplace").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
}

$(document).off("click", "#reinitModifAccident").on("click", "#reinitModifAccident", function() {
    $("#modifierAccident")[0].reset();
    $("#modifierAccidentBouton").prop("disabled", true);
    coords = null;

    if ($("#pointerAccidentModifierNouvEmplace").is(":visible") && $("#pointerAccidentModifierNouvEmplace").text().indexOf("l") >= 0 ) {
        map.un("pointermove", activerPointeurSurFeatures);
        map.un("singleclick", singleclick);
        $("#pointerAccidentModifierNouvEmplace").hide();
        $("#pointerAccidentModifier").show();

    }else{
        map.un("pointermove", activerPointeurSurFeatures);
        map.un("singleclick", singleclick);
        map.un("click", onClique);
        $("#pointerAccidentModifierNouvEmplace").html("<i class='clip-plus-circle'></i> Localiser le nouveau emplacement d'accident");
        $("#pointerAccidentModifierNouvEmplace").hide();
        $("#pointerAccidentModifier").show();
    }
});

$(document).off("click", "#pointerAccidentModifier").on("click", "#pointerAccidentModifier", function (evt) {
    if ($("#collapseThree").attr("class") == "panel-collapse collapse in") {
        map.on("pointermove", activerPointeurSurFeatures);
    }
    map.on("singleclick", singleclick);

});

$(document).off("click", "#pointerAccidentModifierNouvEmplace").on("click", "#pointerAccidentModifierNouvEmplace", function (evt) {
    map.un("singleclick", singleclick);
    map.un("pointermove", activerPointeurSurFeatures);
    map.on("click", onClique);
});

$(document).off("click", "#modifierAccidentBouton").on("click", "#modifierAccidentBouton", function (e){
    e.preventDefault();
    data = {
        modification: true,
        nbrBlesses: $("#modifierAccident #nbrBlesses").val()? $("#modifierAccident #nbrBlesses").val(): "null",
        nbrMorts: $("#modifierAccident #nbrMorts").val()? $("#modifierAccident #nbrMorts").val(): "null",
        gravite: $("#modifierAccident #gravite").val(),
        desc: $("#modifierAccident #description").val()? "'"+$("#modifierAccident #description").val()+"'": "null",
        dateHeure: $("#datem").val() + " " + $("#heurem").val(),
        emplacement: coords,
        gid: gid
    }
    beforeSend = function(xhr){
        if(!$("#datem").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir la date d'accident");
        }if(!$("#heurem").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir l'heure d'accident");
        }
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors de la modification ou bien le déplacement de l'accident");
    }
    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAccident();
            remplirTableAttributaire("accident", "modules/accidentologie/accidentologie.php");
       
        }
    }
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success, undefined, beforeSend);
});
// /PARTIE MODIFICATION OU BIEN LE DÉPLACEMENT

// PARTIE AJOUT
$(document).off("click", "#pointerAccidentAjouter").on("click", "#pointerAccidentAjouter", function () {
    changerPointeurAjout();
    map.on('click', function (evt) {
        coords = ol.proj.toLonLat(evt.coordinate);
        $("#pointerAccidentAjouter").html('<i class="clip-plus-circle"></i> ' + coords[0].toFixed(6) + ", " + coords[1].toFixed(6));
    });

});

$(document).off("click", "#ajouterAccidentBouton").on("click", "#ajouterAccidentBouton", function (e) {
    e.preventDefault();
    data = {
        ajout: true,
        nbrBlesses: $("#nbrBlesses").val()? $("#nbrBlesses").val(): "null",
        nbrMorts: $("#nbrMorts").val()? $("#nbrMorts").val(): "null",
        gravite: $("#gravite").val(),
        desc: $("#description").val()? "'"+$("#description").val()+"'": "null",
        dateHeure: $("#date").val() + " " + $("#heure").val(),
        emplacement: coords,
    }
    beforeSend = function(xhr){
        if(!coords){
            xhr.abort();
            afficherNotif("warning", "Veuillez localiser l'emplacement d'accident");
        }if(!$("#date").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir la date d'accident");
        }if(!$("#heure").val()){
            xhr.abort();
            afficherNotif("warning", "Veuillez saisir l'heure d'accident");
        }
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors d'ajout de l'accident");
    }
    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAccident();
            remplirTableAttributaire("accident", "modules/accidentologie/accidentologie.php");
           
        }
    }
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success, undefined, beforeSend);

});

$(document).off("click", "#reinitAjoutAccident").on("click", "#reinitAjoutAccident", function(e) {
    $("#pointerAccidentAjouter").html("<i class='clip-plus-circle'></i> Localiser l'emplacement d'accident");
    coords = null;
});
// /PARTIE AJOUT


// PARTIE IMPORTAION
$(document).off("change", "#fichierExcel").on("change", "#fichierExcel", function () {

    function exporterExcelVersJSON() {
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xlsx|.xls)$/;
        /*Checks whether the file is a valid excel file*/
        if (regex.test($("#fichierExcel").val().toLowerCase())) {
            var xlsxflag = false; /*Flag for checking whether excel is .xls format or .xlsx format*/
            if ($("#fichierExcel").val().toLowerCase().indexOf(".xlsx") > 0) {
                xlsxflag = true;
            }
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = e.target.result;
                /*Converts the excel data in to object*/
                if (xlsxflag) {
                    var workbook = XLSX.read(data, { type: 'binary' });
                }
                else {
                    var workbook = XLS.read(data, { type: 'binary' });
                }
                /*Gets all the sheetnames of excel in to a variable*/
                var sheet_name_list = workbook.SheetNames;

                var cnt = 0; /*This is used for restricting the script to consider only first sheet of excel*/
                sheet_name_list.forEach(function (y) { /*Iterate through all sheets*/
                    /*Convert the cell value to Json*/
                    if (xlsxflag) {
                        exceljson = XLSX.utils.sheet_to_json(workbook.Sheets[y]);
                    }
                    else {
                        exceljson = XLS.utils.sheet_to_row_object_array(workbook.Sheets[y]);
                    }
                    if (exceljson.length > 0 && cnt == 0) {
                        getJSON(exceljson);
                    }
                });
            }
            if (xlsxflag) {/*If excel file is .xlsx extension than creates a Array Buffer from excel*/
                reader.readAsArrayBuffer($("#fichierExcel")[0].files[0]);
            }
            else {
                reader.readAsBinaryString($("#fichierExcel")[0].files[0]);
            }

        }
        else {
            afficherNotif("warning", "Veuillez ajouter un fichier Excel valide");
        }
    }

    exporterExcelVersJSON();

    function getJSON(exceljson) {
        json = exceljson;

        // L'APPEL AJAX AVEC LES PARAMÈTRES
        data = {
            importation: true,
            noms_cols_excel: Object.keys(json[0]),
            lignes_excel: json
        }
        error_fatale = function (jqXhr) {
            rapportErreurs(jqXhr);
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'importation des accidents");
        }
        success = function (resultat) {
            if (resultat.type == "erreur") {
                afficherNotif("erreur", resultat.msg);
            }
            else if (resultat.type == "succes") {
                afficherNotif("succes", resultat.msg);
                actualiserCoucheAccident();
                remplirTableAttributaire("accident", "modules/accidentologie/accidentologie.php");
               
            }
        }

        ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);
        // /L'APPEL AJAX AVEC LES PARAMÈTRES
    }

});
// /PARTIE IMPORTAION

// PARTIE SUPPRESSION
function singleclick2 (evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
        layer = [coucheAccident];
        return feature;
    });
    if (feature) {
        $("#SupprimerAccidentBouton").prop("disabled", false);
        $("#pointerAccidentSupprimer").html('<i class="clip-plus-circle"></i> Accident N° ' + feature.get("gid"));
        gid = feature.get("gid");
    }
};

$(document).off("click", "#reinitSuppAccident").on("click", "#reinitSuppAccident", function(e) {
    $("#pointerAccidentSupprimer").html("<i class='clip-plus-circle'></i> Localiser l'emplacement d'accident");
    $("#SupprimerAccidentBouton").prop("disabled", true);
    map.un("pointermove", activerPointeurSurFeatures);
    map.un("singleclick", singleclick2);
});

$(document).off("click", "#pointerAccidentSupprimer").on("click", "#pointerAccidentSupprimer", function (e) {
    if ($("#collapseFour").attr("class") == "panel-collapse collapse in") {
        map.on("pointermove", activerPointeurSurFeatures);
    }
    map.on("singleclick", singleclick2);

});

$(document).off("click", "#SupprimerAccidentBouton").on("click", "#SupprimerAccidentBouton", function (e) {
    e.preventDefault();
    data = {
        suppression: true,
        gid: gid,
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors de la suppression de l'accident");
    }
    success = function (resultat) {
        if (resultat.type == "succes") {
            afficherNotif("succes", resultat.msg);
            actualiserCoucheAccident();
            remplirTableAttributaire("accident", "modules/accidentologie/accidentologie.php");
         
        }
    }
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);

});
// /PARTIE SUPPRESSION

// PARTIE HISTORIQUE
$(document).off("click", "#historiqueAccidentBouton").on("click", "#historiqueAccidentBouton", function (e) {
    
    $('#dateDebH').datetimepicker('destroy');
    $('#dateFinH').datetimepicker('destroy');

    $("#dateDebH").datetimepicker({
        maxDate: 0,
        minDate: mindate,
        currentText: "Maintenant",
        closeText: "Ok",
        timeInput: true,
        timeText: "",
        hourText: "Heure",
        minuteText: "Minute",
        onSelect: function(){
            $("#dateFinH").datepicker("option", "minDate", $("#dateDebH").datepicker("getDate"));
        }
    });

    $("#dateFinH").datetimepicker({
        maxDate: 0,    
        currentText: "Maintenant",
        closeText: "Ok",
        timeInput: true,
        timeText: "",
        hourText: "Heure",
        minuteText: "Minute",
        onSelect: function(){
            $("#dateDebH").datepicker("option", "maxDate", $("#dateFinH").datepicker("getDate"));
        }
    });
    
    // REMPLISSAGE DE LA TABLE D'HISTORIQUE
    remplirTableHistorique("accident");
    // /REMPLISSAGE DE LA TABLE D'HISTORIQUE

});
// /PARTIE HISTORIQUE

$(document).off("click", "#viderCarteStat").on("click", "#viderCarteStat", function (e) {
    vectorStatis.getSource().clear();
    map.removeLayer(vectorStatis);
});

$(document).off("click", "#pourceMortsBles").on("click", "#pourceMortsBles", function (e) {
    

    map.removeLayer(vectorStatis);
	var styleCache={};
	
	function getFeatureStyle (feature, sel)
	{	var k = $("#graph").val()+"-"+ $("#color").val()+"-"+(sel?"1-":"")+feature.get("data");
  		var style = styleCache[k];
		if (!style) 
		{	var radius = 15;
			// area proportional to data size: s=PI*r^2
			radius = 8* Math.sqrt (feature.get("sum") / Math.PI);
			var data = feature.get("data");
			radius *= (sel?1.2:1);
			// Create chart style
			style = [ new ol.style.Style(
				{	image: new ol.style.Chart(
					{	type: "pie3D", 
						radius: radius, 
						data: data, 
						rotateWithView: true,
						stroke: new ol.style.Stroke(
						{	color: "#fff",
							width: 2
						}),
					})
				})];

			// Show values on select
			if (sel)
			{	
				var sum = feature.get("sum");
      
				var s = 0;
				for (var i=0; i<data.length; i++)
				{	var d = data[i];
      				var a = (2*s+d)/sum * Math.PI - Math.PI/2; 
                    var v = Math.round(d/sum*1000);
                    if(i==0){
                        msg = d+" Blessés";
                        couleur = "#ffa500"
                    }else{
                        msg = d+" Morts";
                        couleur = "#0000ff";
                    }
					if (v>0)
      				{	style.push(new ol.style.Style(
						{	text: new ol.style.Text(
                            {	text: (v/10)+"% ( "+msg+" )",
                                font: '10px sans-serif',
          						offsetX: Math.cos(a)*(radius+3),
          						offsetY: Math.sin(a)*(radius+3),
								textAlign: (a < Math.PI/2 ? "left":"right"),
								textBaseline: "middle",
								stroke: new ol.style.Stroke({ color:"#000", width:3 }),
                                fill: new ol.style.Fill({color: couleur})
							})
						}));
					}
					s += d;
				}
			}
		}
		styleCache[k] = style;
		return style;
	}

	
    var features=[];
    coucheAccident.getSource().forEachFeature(function (f) {
        
        nbrblesses = f.get("nbrblesses")? parseInt(f.get("nbrblesses")): 0;
        nbrmorts = f.get("nbrmorts")? parseInt(f.get("nbrmorts")): 0;

        features.push(new ol.Feature(
            {
                geometry: f.getGeometry(),
                data: [nbrblesses, nbrmorts],
                sum: nbrmorts+nbrblesses
            })
        );
    });

	vectorStatis = new ol.layer.Vector(
	{	name: 'Vecteur',
		source: new ol.source.Vector({ features: features }),
		renderOrder: ol.ordering.yOrdering(),
		style: function(f) { return getFeatureStyle(f, true); }
	})

	map.addLayer(vectorStatis);


});

// PARTIE STATISTIQUES
$(document).off("click", "#statistiquesAccidentBouton").on("click", "#statistiquesAccidentBouton", function (e) {
    $("#statistiquesTitre").text("les statistiques des accidents");
    
    function traitementStatistiques(){
        data = {
            statistiques: true,
            dateHeureDeb: $('#dateDebS').val(),
            dateHeureFin: $('#dateFinS').val()
        }
        error_fatale = function (jqXhr) {
            rapportErreurs(jqXhr);

            if(JSON.stringify(jqXhr).includes("division by zero") || JSON.stringify(jqXhr).includes("division par zéro")){
                afficherNotif("erreur", "Pas d'accidents disponibles");  
            }else{
                afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'affichage des statistiques sur les accidents");
            }
        }
        success = function (resultat) {
            if($('#dateDebS').val() && $('#dateFinS').val()){
                titre1 = "Nombre de victimes entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();
                titre2 = "Pourcentage de Morts et de Blessés entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();
                titre3 = "Pourcentage de la gravité des accidents entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();
                titre4 = "Nombre de Morts et de Blessés entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();
                titre5 = "Pourcentage de la densité des accidents selon les tranches horaires entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();
                titre6 = "Pourcentage de la gravité des accidents selon les tranches horaires entre "+$('#dateDebS').val()+ " et "+$('#dateFinS').val();

            }else if($('#dateDebS').val() && !$('#dateFinS').val()){
                titre1 = "Nombre de victimes depuis "+$('#dateDebS').val();
                titre2 = "Pourcentage de Morts et de Blessés depuis "+$('#dateDebS').val();
                titre3 = "Pourcentage de la gravité des accidents depuis "+$('#dateDebS').val();
                titre4 = "Nombre de Morts et de Blessés depuis "+$('#dateDebS').val();
                titre5 = "Pourcentage de la densité des accidents selon les tranches horaires depuis "+$('#dateDebS').val();
                titre6 = "Pourcentage de la gravité des accidents selon les tranches horaires depuis "+$('#dateDebS').val();

            }else{
                titre1 = "Nombre de victimes jusqu'à "+$('#dateFinS').val();
                titre2 = "Pourcentage de Morts et de Blessés jusqu'à "+$('#dateFinS').val();
                titre3 = "Pourcentage de la gravité des accidents jusqu'à "+$('#dateFinS').val();
                titre4 = "Nombre de Morts et de Blessés jusqu'à "+$('#dateFinS').val();
                titre5 = "Pourcentage de la densité des accidents selon les tranches horaires jusqu'à "+$('#dateFinS').val();
                titre6 = "Pourcentage de la gravité des accidents selon les tranches horaires jusqu'à "+$('#dateFinS').val();

            }
            
            chartZoomable("chartZoomable", resultat.chartZoomable, titre1, "Nombre de victimes");
            chartPie("piePourceBlesMorts", resultat.piePourceBlesMorts, titre2, ['#ff4444', '#33b5e5']);
            chartPie("piePourceGravite", resultat.piePourceGravite, titre3, ['#1b5e20', '#4caf50', '#c8e6c9']);

            donnees = [{
                data: resultat.chartLigneBlesMorts.Morts,
                name: 'Morts',
                lineWidth: 4,
                marker: {
                    radius: 4
                }
            }, {
                data: resultat.chartLigneBlesMorts.Blesses,
                name: 'Blessés',
                lineWidth: 4,
                marker: {
                    radius: 4
                }
            }]
            
            chartLigne("chartLigneBlesMorts", donnees, titre4, ["#00695c", "#e65100 "]);

            chartPie("piePourceTranchesH", resultat.piePourceTranchesH, titre5, ["#795548", '#aa66cc', '#00C851', '#2BBBAD']);

            donnees = [{
                name: 'Plus grave',
                data: resultat.chartBarGravTranchesH[0].p
            }, {
                name: 'Grave',
                data: resultat.chartBarGravTranchesH[0].g
            }, {
                name: 'Moins grave',
                data: resultat.chartBarGravTranchesH[0].m
            }];

            chartBar("chartBarGravTranchesH", donnees, titre6, ["#ff4444", '#ffbb33', '#1de9b6'], "Accidents");

        }

        ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);
    }

    $("#dateDebS").datetimepicker({
        maxDate: 0,
        minDate: mindate,
        currentText: "Maintenant",
        closeText: "Ok",
        timeInput: true,
        timeText: "",
        hourText: "Heure",
        minuteText: "Minute",
        onSelect: function(){
            $("#dateFinS").datepicker("option", "minDate", $("#dateDebS").datepicker("getDate"));
            traitementStatistiques();
        }
    });

    $("#dateFinS").datetimepicker({
        maxDate: 0,
        
        currentText: "Maintenant",
        closeText: "Ok",
        timeInput: true,
        timeText: "",
        hourText: "Heure",
        minuteText: "Minute",
        onSelect: function(){
            $("#dateDebS").datepicker("option", "maxDate", $("#dateFinS").datepicker("getDate"));
            traitementStatistiques();
        }
    });
});
// /PARTIE STATISTIQUES

// PARTIE THÉMATIQUES

$(document).off("click", "#heatMapAccidents").on("click", "#heatMapAccidents", function (e) {

    reinit();
    heatmapLayer = new ol.layer.Heatmap({
        source: source_couche_accident,
        radius: 28,
        blur: 30,
        shadow: 300
    });

    map.addLayer(heatmapLayer);

});

$(document).off("click", "#viderCarte").on("click", "#viderCarte", function (e) {
    reinit();
});

// /PARTIE THÉMATIQUES

// FONCTION DE RÉINITIALISATION
function reinit(){
    popup.hide();
    if(typeof heatmapLayer != "undefined") {
        map.removeLayer(heatmapLayer);
    }

}
// /FONCTION DE RÉINITIALISATION

// FONCTION D'ACTUALISATION DE LA COUCHE ACCIDENT
function actualiserCoucheAccident() {

    map.removeLayer(coucheAccident);
    // DÉFINITION DU STYLE DE LA COUCHE ACCIDENT
    var styleCoucheAccident = function (feature) {

        var src = 'assets/img/accident.png';
        var style_accident = {
            'Point':
                new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        src: src
                    })
                })
        };
        return style_accident[feature.getGeometry().getType()];
    }
    // /DÉFINITION DU STYLE DE LA COUCHE ACCIDENT

    // DÉFINITION DE LA COUCHE ACCIDENT
    coucheAccident = new ol.layer.Vector({
        name: 'CoucheAccident',
        title: 'Couche Accident',
        visible: true,
        source: source_couche_accident,
        style: styleCoucheAccident
    });
    // /DÉFINITION DE LA COUCHE ACCIDENT

    // SUPPRESSION DU CONTENU DE LA COUCHE ACCIDENT 
    source_couche_accident.clear();
    // /SUPPRESSION DU CONTENU DE LA COUCHE ACCIDENT

    // L'APPEL AJAX AVEC LES PARAMÈTRES
    data = {
        selection: true
    }
    success = function (result) {
        if (result.features !== "empty") {
            var features = accidentologie_geojson.readFeatures(result, { featureProjection: 'EPSG:3857' });
            source_couche_accident.addFeatures(features);
            afficherNotif("info", "La couche des accidents a été bien actualisée");
        }
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement de la couche des accidents");
    }
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success);
    // /L'APPEL AJAX AVEC LES PARAMÈTRES

    // L'AJOUT DE LA COUCHE ACCIDENT À LA CARTE
    map.addLayer(coucheAccident);
    // /L'AJOUT DE LA COUCHE ACCIDENT À LA CARTE

}
// /FONCTION D'ACTUALISATION DE LA COUCHE ACCIDENT

// REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE ACCIDENT
remplirTableAttributaire("accident", "modules/accidentologie/accidentologie.php");
// /REMPLIR LA TABLE ATTRIBUTAIRE DE LA TABLE ACCIDENT