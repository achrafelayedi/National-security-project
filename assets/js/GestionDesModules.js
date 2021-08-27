// VARIABLES GLOBALES
// ACTIVER LE RAPPORT D'ERREURS (AFFICHAGE DES ERREURS DANS LE CONSOLE DU NAVIGATEUR)
var rappErreurs = true;
// /ACTIVER LE RAPPORT D'ERREURS (AFFICHAGE DES ERREURS DANS LE CONSOLE DU NAVIGATEUR)
// /VARIABLES GLOBALES

// AFFICHAGE DU RAPPORT D'ERREURS
function rapportErreurs(err){
    if(rappErreurs){
        console.log(err.responseText);
    }
}
// AFFICHAGE DU RAPPORT D'ERREURS

// TRAITEMENT AJAX
function ajax(url, data, error, success = function (resultat) {
    if (resultat.type == "erreur") {
        afficherNotif("erreur", resultat.msg);
    }
    else if (resultat.type == "succes") {
        afficherNotif("succes", resultat.msg);
    }
}, complete = null, beforeSend = null) {

    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        dataType: 'JSON',
        beforeSend: beforeSend,
        success: success,
        error: error,
        complete: complete
    });
}
// /TRAITEMENT AJAX

// TABLEAU DE BORD
$("#sectionTabBord").css("visibility", "");
$("#map").css("visibility", "hidden");
$("#map").css("position", "absolute");
$(".agent-toggle").css("visibility", "hidden");
$("#main_agent_list_content").css("display", "none");
$.getScript("modules/tableauBord/tableauBord.js");
// /// TABLEAU DE BORD

// CHARGEMENT DU SCRIPT DU MODULE TABLEAU DE BORD LORS DU CLIQUE
$("#tableauBord").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(0)").hasClass('active open')){
       
        $("#style_selector").css("display", "none");


        $(".agent-toggle").css("visibility", "hidden");
        $('.notifyjs-wrapper').trigger('notify-hide');
        $("#main_agent_list_content").css("display", "none");
        $("#map").css("visibility", "hidden");
        $("#map").css("position", "absolute");
        $("#sectionTabBord").css("visibility", "");
        $("#sectionTabBord").css("position", "");
        $("#sectionTabBord").css("height", "");
        $.getScript("modules/tableauBord/tableauBord.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE TABLEAU DE BORD LORS DU CLIQUE


// CHARGEMENT DU SCRIPT DU MODULE COUCHES D'INTÉRÊT LORS DU CLIQUE
$("#couchesInteret").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(1)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "hidden");
        $("#main_agent_list_content").css("display", "none");

        $("#style_selector").css("display", "block");

        map.updateSize();
        $.getScript("modules/couchesInteret/couchesInteret.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE COUCHES D'INTÉRÊT LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE GESTION DES AGENTS LORS DU CLIQUE
$("#gestionAgents").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(2)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "");

        $("#style_selector").css("display", "block");

        map.updateSize();
        $.getScript("modules/gestionAgents/gestionAgents.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE GESTION DES AGENTS LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE ACCIDENTOLOGIE LORS DU CLIQUE
$("#accidentologie").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(3)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "");
        
        $("#style_selector").css("display", "block");

        map.updateSize();
        $.getScript("modules/accidentologie/accidentologie.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE ACCIDENTOLOGIE LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE CRIMINOLGIE LORS DU CLIQUE
$("#criminologie").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(4)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "");
        
        $("#style_selector").css("display", "block");

        map.updateSize();
        $.getScript("modules/criminologie/criminologie.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE CRIMINOLGIE LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE LES ACTIVITÉS À RISQUE LORS DU CLIQUE
$("#activitesRisque").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(5)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "");
        
        $("#style_selector").css("display", "block");

        map.updateSize();
        $.getScript("modules/activitesRisque/activitesRisque.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE LES ACTIVITÉS À RISQUE LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE SUIVI EN TEMPS RÉEL LORS DU CLIQUE
$("#suiviTempsReel").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(6)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "hidden");
        $("#main_agent_list_content").css("display", "none");
        
        $("#style_selector").css("display", "block");
        
        map.updateSize();
        $.getScript("modules/suiviTempsReel/suiviTempsReel.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE SUIVI EN TEMPS RÉEL LORS DU CLIQUE

// CHARGEMENT DU SCRIPT DU MODULE GESTION DU CORTÈGE LORS DU CLIQUE
$("#gestionCortege").parent().click(function () {
    if(!$(".main-navigation-menu li:eq(7)").hasClass('active open')){
        $("#sectionTabBord").css("visibility", "hidden");
        $("#sectionTabBord").css("height", "0px");
        $("#map").css("visibility", "");
        $("#map").css("position", "");
        $(".agent-toggle").css("visibility", "hidden");
        $("#main_agent_list_content").css("display", "none");
        
        $("#style_selector").css("display", "block");
        
        map.updateSize();
        $.getScript("modules/gestionCortege/gestionCortege.js");
    }
});
// /CHARGEMENT DU SCRIPT DU MODULE GESTION DU CORTÈGE LORS DU CLIQUE