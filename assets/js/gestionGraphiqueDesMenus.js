// CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID
function changerClasseCss(id, classe) {
    $('#' + id).attr('class', classe);
}
// /CHANGEMENT DE CLASSE CSS D'UN ÉLÉMENT IDENTIFIÉ PAR UN ID

// INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION
function interactionGraphiqueMenuDeNavigation(ordre, idModule, titreMenuDroit, largeurMenu, marginTop) {

    // AFFICHER MENU DROIT TOGGLE
    $("#boutonToggle").css("visibility", "visible");
    $("#style_selector").css("visibility", "visible");
    // /AFFICHER MENU DROIT TOGGLE

    // CHANGEMENT DE TEXTE DANS LA BALISE <title>
    $("title").text($('#' + idModule).text());
    // /CHANGEMENT DE TEXTE DANS LA BALISE <title>

    // CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]
    $("#tabBord").text($('#' + idModule).text());
    // /CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]

    // CHANGEMENT DE L'ICONE DU BORD
    $("#iconeTabBord").attr('class', $('#' + idModule).prev().attr("class"));
    // /CHANGEMENT DE L'ICONE DU BORD

    // ENLÈVEMENT DE LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu
    $('.main-navigation-menu li').each(function () {
        this.className = '';
    });
    // /ENLÈVEMENT LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu

    // CHANGEMENT DE LA COULEUR DU MENU PASSÉ EN PARAMÈTRE
    $(".main-navigation-menu li:eq(" + ordre + ")").attr('class', 'active open');
    // /CHANGEMENT DE LA COULEUR DU MENU PASSÉ EN PARAMÈTRE

    // TITRE DU MENU DROIT
    $("#titreMenuDroit").text(titreMenuDroit);
    // /TITRE DU MENU DROIT

    // AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT
    $("#boutonToggle").css("display", "block");
    changerClasseCss("boutonToggle", "style-toggle open");
    // /AFFICHAGE DE BOUTON TOGGLE DU MENU DROIT

    // DIMENSIONNEMENT DE LA LARGEUR DU MENU DROIT
    $("#style_selector").css("width", largeurMenu+"%");
    // /DIMENSIONNEMENT DE LA LARGEUR DU MENU DROIT

    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    $("#style_selector").css("margin-top", marginTop+"%");
    // DIMENSIONNEMENT DU MARGIN HAUT DU MENU DROIT
    
    // AFFICHAGE DU CONTENEUR DU MENU DROIT
    $("#style_selector_container").css("display", "block");
    // /AFFICHAGE DU CONTENEUR DU MENU DROIT

}
// /INTERACTION GRAPHIQUE POUR CHAQUE MODULE DANS LE MENU PRINCIPAL DE NAVIGATION

// GESTION DES NOTIFICATIONS
function afficherNotif(type, msg, temps = 4000, gif = false, autohide = true) {
    var classe, titre;
    if (type == "erreur") {
        classe = "alert alert-block alert-danger fade in";
        titre = "<i class='fas fa-times-circle' ></i> Erreur !";
    }
    else if (type == "succes") {
        classe = "alert alert-block alert-success fade in";
        titre = "<i class='fas fa-check-circle'></i> Succès !";
    }
    else if (type == "erreur_fatale") {
        classe = "alert alert-block alert-danger fade in";
        titre = "<i class='fas fa-times' ></i> Erreur fatale !";
    }
    else if (type == "warning") {
        classe = "alert alert-block alert-warning fade in";
        titre = "<i class='fas fa-exclamation-triangle' ></i> Attention !";
    } else if (type == "info") {
        classe = "alert alert-block alert-info fade in";
        titre = "<i class='fas fa-info-circle' ></i> Info !";
    }

    // DÉFINITION DU STYLE ET CONTENU DE NOTIFICATION
    if(gif){
        $.notify.addStyle('style', {
            html:
                "<div id='notif' style='width: 440px;'>" +
                    "<button data-dismiss='alert' class='close' type='button'>" +
                        "&times;" +
                    "</button>" +
                    "<h4 class='alert-heading' data-notify-html='title'></h4>" +
                    "<img src='assets/img/loading.gif' width='15%'><p data-notify-html='contenu' style='display: inline;'></p>"+
                "</div>"
        });
    }else{
        $.notify.addStyle('style', {
            html:
                "<div id='notif' style='width: 440px;'>" +
                    "<button data-dismiss='alert' class='close' type='button'>" +
                        "&times;" +
                    "</button>" +
                    "<h4 class='alert-heading' data-notify-html='title'></h4>" +
                    "<p data-notify-html='contenu'></p>" +
                "</div>"
        });
    }
    $.notify.defaults({globalPosition: 'top left'})

    $.notify({
        title: titre,
        contenu: msg
    }, {
            style: 'style',
            className: classe,
            autoHide: autohide,
            autoHideDelay: temps,
            showAnimation: 'slideDown',
            hideAnimation: 'slideUp',
            clickToHide: true
        });
    // /DÉFINITION DU STYLE ET CONTENU DE NOTIFICATION

    $("#notif").removeClass("notifyjs-foo-base notifyjs-foo-alert");
    $("#notif").addClass("alert");
    $('.notifyjs-container').css('left', ($(".main-navigation").width()+32)+"px");
    $('.notifyjs-container').css('top', '99px');

}
// /GESTION DES NOTIFICATIONS