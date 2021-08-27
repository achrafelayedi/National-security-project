// DECLARATION DES VARIABLES
var mindate_accident;
var mindate_crime;
// /DECLARATION DES VARIABLES

// CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]
$("#iconeTabBord").attr('class', $('#tableauBord').prev().attr("class"));
$("#tabBord").text("");
// /CHANGEMENT DE TEXTE DANS LE TITRE DU BORD [ TABLEAU DE BORD / ... ]

// ENLÈVEMENT DE LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu
$('.main-navigation-menu li').each(function () {
    this.className = '';
});
// /ENLÈVEMENT LA CLASSE "active open" DE TOUS LES SOUS ÉLÉMENTS DE LA CLASSE main-navigation-menu

// CHANGEMENT DE LA COULEUR DU MENU
$(".main-navigation-menu li:eq(0)").attr('class', 'active open');
// /CHANGEMENT DE LA COULEUR DU MENU

// LE STYLE CSS DU CONTENU HTML
if (!$('head').find('link[href="modules/tableauBord/tableauBord.css"][rel="stylesheet"]').length) {
    $("<link>").attr("rel", "stylesheet").attr("type", "text/css").attr("href", "modules/tableauBord/tableauBord.css").appendTo("head");
}
// /LE STYLE CSS DU CONTENU HTML

// LE CONTENU HTML
$.get("modules/tableauBord/tableauBord.html", function (data) {
    $("#sectionTabBord").after().html(data);
});
// /LE CONTENU HTML

// PANEL STATISTIQUES ACCIDENTOLOGIE
// FAIRE RESSORTIR LA DATE MIN
data = {
    mindate: true
}
success = function (resultat) {
    mindate_accident = resultat;
}
complete = function () {
    statistiquesAccidentTabBord();
}
ajax("modules/accidentologie/accidentologie.php", data, undefined, success, complete);

data = {
    mindatec: true
}
success = function (resultat) {
    mindate_crime = resultat;
}
complete = function () {
    statistiquesCrimeTabBord();
}
ajax("modules/criminologie/criminologie.php", data, undefined, success, complete);

// /FAIRE RESSORTIR LA DATE MIN


// PANEL STATISTIQUES ACCIDENTOLOGIE
function statistiquesAccidentTabBord() {
    data = {
        statistiques: true,
        dateHeureDeb: mindate_accident,
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        $("#tabBordAccident").css("display", "none");
        if(JSON.stringify(jqXhr).includes("division by zero") || JSON.stringify(jqXhr).includes("division par zéro")){
            afficherNotif("erreur", "Pas d'accidents disponibles");  
        }else{
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'affichage du tableau de bord");
        }
    }
    success = function (resultat) {
        titre1 = "Nombre de victimes des accidents depuis " + mindate_accident;
        titre2 = "Pourcentage de Morts et de Blessés depuis " + mindate_accident;
        titre3 = "Pourcentage de la gravité des accidents depuis " + mindate_accident;
        titre4 = "Nombre de Morts et de Blessés des accidents depuis " + mindate_accident;
        titre5 = "Pourcentage de la densité des accidents selon les tranches horaires depuis " + mindate_accident;
        titre6 = "Pourcentage de la gravité des accidents selon les tranches horaires depuis " + mindate_accident;

        chartZoomable("chartZoomableTab", resultat.chartZoomable, titre1, "Nombre de victimes");
        chartPie("piePourceBlesMortsTab", resultat.piePourceBlesMorts, titre2, ['#ff4444', '#33b5e5']);
        chartPie("piePourceGraviteTab", resultat.piePourceGravite, titre3, ['#1b5e20', '#4caf50', '#c8e6c9']);

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

        chartLigne("chartLigneBlesMortsTab", donnees, titre4, ["#CC0000", "#FF8800"]);

        chartPie("piePourceTranchesHTab", resultat.piePourceTranchesH, titre5, ["#795548", '#aa66cc', '#00C851', '#2BBBAD']);

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

        chartBar("chartBarGravTranchesHTab", donnees, titre6, ["#ff4444", '#ffbb33', '#1de9b6'], "Accidents");

    }
    complete = function(){
        $("#divtabBord").css("display", "block");
        $("#chargementTabBord").css("display", "none");
    }
    
    ajax("modules/accidentologie/accidentologie.php", data, error_fatale, success, complete);
}
// /PANEL STATISTIQUES ACCIDENTOLOGIE

// PANEL STATISTIQUES CRIMINOLOGIE
function statistiquesCrimeTabBord() {
    data = {
        statistiques: true,
        dateHeureDeb: mindate_crime
    }
    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        $("#tabBordCrime").css("display", "none");
        if(JSON.stringify(jqXhr).includes("division by zero") || JSON.stringify(jqXhr).includes("division par zéro")){
            afficherNotif("erreur", "Pas de crimes disponibles");
        }else{
            afficherNotif("erreur_fatale", "Une erreur est survenu lors de l'affichage du tableau de bord");
        }
    }
    success = function (resultat) {
        titre1 = "Nombre de crimes depuis " + mindate_crime;
        titre2 = "Pourcentage des  crimes par type depuis " + mindate_crime;
        titre3 = "Pourcentage de la gravité des crimes depuis " + mindate_crime;
        titre4 = "Pourcentage de la densité des crimes selon les tranches horaires depuis " + mindate_crime;
        titre5 = "Pourcentage de la gravité des crimes selon les tranches horaires depuis " + mindate_crime;

        chartZoomable("chartZoomableCrimeTab", resultat.chartZoomableCrime, titre1, "Nombre de crimes");

        chartPie("piePourceCrimeTab", resultat.piePourceCrime, titre2, ['#ff4444', '#33b5e5', '#e8a0a0', '#aebae2', '#934848', '#338c8c']);
        chartPie("piePourceGraviteCrimeTab", resultat.piePourceGraviteCrime, titre3, ['#1b5e20', '#4caf50', '#c8e6c9']);


        chartPie("piePourceTranchesHCrimeTab", resultat.piePourceTranchesHCrime, titre4, ["#795548", '#aa66cc', '#00C851', '#2BBBAD']);

        donnees = [{
            name: 'Plus grave',
            data: resultat.chartBarGravTranchesHCrime[0].p
        }, {
            name: 'Grave',
            data: resultat.chartBarGravTranchesHCrime[0].g
        }, {
            name: 'Moins grave',
            data: resultat.chartBarGravTranchesHCrime[0].m
        }];

        chartBar("chartBarGravTranchesHCrimeTab", donnees, titre5, ["#ff4444", '#ffbb33', '#1de9b6'], "Crimes");

    }
    complete = function(){
        $("#divtabBord").css("display", "block");
        $("#chargementTabBord").css("display", "none");
    }

    ajax("modules/criminologie/criminologie.php", data, error_fatale, success, complete);
}
// /PANEL STATISTIQUES CRIMINOLOGIE