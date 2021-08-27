// FILTRAGE SUR LA DATE
var col_date_index, lignes_histo;
var allowFilter = ['#tableAttributaire'];
$.fn.dataTableExt.afnFiltering.push(
    function (oSettings, aData, iDataIndex) {

        if ($("#basicExampleModal").attr("class") == "modal fade in" ) {
            var iFini = document.getElementById('dateDebH').value;
            var iFfin = document.getElementById('dateFinH').value;
            var iStartDateCol = col_date_index;
            var iEndDateCol = col_date_index;
    
            iFini = iFini.substring(6, 10) + iFini.substring(3, 5) + iFini.substring(0, 2) + iFini.substring(11, 13) + iFini.substring(14, 16);
            iFfin = iFfin.substring(6, 10) + iFfin.substring(3, 5) + iFfin.substring(0, 2) + iFfin.substring(11, 13) + iFfin.substring(14, 16);
    
            var datofini = aData[iStartDateCol].substring(6, 10) + aData[iStartDateCol].substring(3, 5) + aData[iStartDateCol].substring(0, 2) + aData[iStartDateCol].substring(11, 13) + aData[iStartDateCol].substring(14, 16);
            var datoffin = aData[iEndDateCol].substring(6, 10) + aData[iEndDateCol].substring(3, 5) + aData[iEndDateCol].substring(0, 2) +  aData[iEndDateCol].substring(11, 13) + aData[iEndDateCol].substring(14, 16);

            if (iFini === "" && iFfin === "") {
                return true;
            }
            else if (iFini <= datofini && iFfin === "") {
                return true;
            }
            else if (iFfin >= datoffin && iFini === "") {
                return true;
            }
            else if (iFini <= datofini && iFfin >= datoffin) {
                return true;
            }
            return false;
        }

        if ($.inArray(oSettings.nTable.getAttribute('id'), allowFilter) == -1) {
            return true;
        }      
    }
);
// /FILTRAGE SUR LA DATE

// REMPLISSAGE DE LA TABLE ATTRIBUTAIRE
function remplirTableAttributaire(nom_couche, lien_php, data = {
    tableAttributaire: true
}, order = [[0, 'asc']]) {
    $("#chargement").css("display" ,"block");
    $("#titreTableAttributaire").parent().css("display", "block");
    $("#titreTableAttributaire").text("La liste des "+nom_couche+"s");
    tableName = "#tableAttributaire";
    
    if ( $.fn.DataTable.isDataTable(tableName) ) {
        $(tableName).DataTable().destroy();
        $(tableName + '>thead>tr').empty();
        $(tableName + '>tbody>tr').empty();
    }

    data = data

    error_fatale = function (jqXhr) {
        rapportErreurs(jqXhr);
        afficherNotif("erreur_fatale", "Une erreur est survenu lors du chargement de la table attributaire des " + nom_couche + "s");
    }

    success = function (data) {
        $("#chargement").css("display" ,"none");
        lignes_histo = data;
        $.each(data.columns, function (k, colObj) {
            str = '<th class="th-sm">' + colObj.name + '<i aria-hidden="true"></i></th>';
            $(str).appendTo(tableName + '>thead>tr');
            if(colObj.data == "dateheure"){
                col_date_index = k;
            }
        });
        data.columns[0].render = function (data, type, row) {
            return data;
        }
        table_attr = $(tableName).DataTable({
            destroy: true,
            "order": order,
            "lengthMenu": [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Tous"] ],
            "data": data.data,
            "columns": data.columns,
            dom: "<'row'<'col-sm-4'l><'col-sm-5'B><'col-sm-3'f>>" +
                "<'row'<'col-sm-12'tr>>" +
                "<'row'<'col-sm-5'i><'col-sm-7'p>>",
            buttons: [
                {
                    extend: 'copy',
                    text: 'Copier',
                    className: 'btn btn-default btn-xs'
                }
                , {
                    extend: 'csv',
                    className: 'btn btn-default btn-xs'
                }
                ,
                {
                    extend: 'excel',
                    messageTop: $("#titreTableAttributaire").text(),
                    className: 'btn btn-default btn-xs'
                },
                {
                    extend: 'pdf',
                    messageTop: $("#titreTableAttributaire").text(),
                    className: 'btn btn-default btn-xs'
                },
                {
                    extend: 'print',
                    text: 'Imprimer',
                    className: 'btn btn-default btn-xs',
                    messageTop: $("#titreTableAttributaire").text()
                }
            ],
            "language": {
                "sProcessing": "Traitement en cours...",
                "sSearch": "Rechercher&nbsp;:",
                "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
                "sInfo": "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                "sInfoEmpty": "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                "sInfoPostFix": "",
                "sLoadingRecords": "Chargement en cours...",
                "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
                "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
                "oPaginate": {
                    "sFirst": "Premier",
                    "sPrevious": "Pr&eacute;c&eacute;dent",
                    "sNext": "Suivant",
                    "sLast": "Dernier"
                },
                "oAria": {
                    "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                    "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
                }
            }
        });
    }

    ajax(lien_php, data, error_fatale, success);
}
// /REMPLISSAGE DE LA TABLE ATTRIBUTAIRE

// REMPLISSAGE DE LA TABLE D'HISTORIQUE
function remplirTableHistorique(nom_couche) {
    
    $("#historiqueTitre").text("L'historique des "+nom_couche+"s");
    tableName = "#tableHistorique";

    if ( $.fn.DataTable.isDataTable(tableName) ) {
        $("#dateDebH").val('');
        $("#dateFinH").val('');
        $(tableName).DataTable().destroy();
        $(tableName + '>thead>tr').empty();
        $(tableName + '>tbody>tr').empty();
    }

    $.each(lignes_histo.columns, function (k, colObj) {
        str = '<th class="th-sm">' + colObj.name + '<i aria-hidden="true"></i></th>';
        $(str).appendTo(tableName + '>thead>tr');
    });
    lignes_histo.columns[0].render = function (data, type, row) {
        return data;
    }

    table_hist = $(tableName).dataTable({
        destroy: true,
        lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Tous"] ],
        "data": lignes_histo.data,
        "columns": lignes_histo.columns,
        dom: "<'row'<'col-sm-3'l><'col-sm-6'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        buttons: [
            {
                extend: 'copy',
                text: 'Copier',
                className: 'btn btn-default btn-xs'
            }
            , {
                extend: 'csv',
                className: 'btn btn-default btn-xs'
            }
            ,
            {
                extend: 'excel',
                messageTop: $("#historiqueTitre").text(),
                className: 'btn btn-default btn-xs'
            },
            {
                extend: 'pdf',
                messageTop: $("#historiqueTitre").text(),
                className: 'btn btn-default btn-xs'
            },
            {
                extend: 'print',
                text: 'Imprimer',
                className: 'btn btn-default btn-xs',
                messageTop: $("#historiqueTitre").text()
            }
        ],
        "language": {
            "sProcessing": "Traitement en cours...",
            "sSearch": "Rechercher&nbsp;:",
            "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
            "sInfo": "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            "sInfoEmpty": "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
            "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            "sInfoPostFix": "",
            "sLoadingRecords": "Chargement en cours...",
            "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
            "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
            "oPaginate": {
                "sFirst": "Premier",
                "sPrevious": "Pr&eacute;c&eacute;dent",
                "sNext": "Suivant",
                "sLast": "Dernier"
            },
            "oAria": {
                "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
            }
        }
    });
    
  $('#dateDebH').change( function() { table_hist.fnDraw(); } );
  $('#dateFinH').change( function() { table_hist.fnDraw(); } );
    
}
// /REMPLISSAGE DE LA TABLE D'HISTORIQUE

// REMPLISSAGE DE LA TABLE DES ACTIVITÉS À RISQUE
function remplirTableActivRisque(donnees) {
    
    $("#chargement").css("display" ,"block");
    $("#titreTableAttributaire").parent().css("display", "block");
    $("#titreTableAttributaire").text("La liste des bouchons");
    
    tableName = "#tableAttributaire";

    if ( $.fn.DataTable.isDataTable(tableName) ) {
        $(tableName).DataTable().destroy();
        $(tableName + '>thead>tr').empty();
        $(tableName + '>tbody>tr').empty();
    }

    $.each(donnees.columns, function (k, colObj) {
        str = '<th class="th-sm">' + colObj.name + '<i aria-hidden="true"></i></th>';
        $(str).appendTo(tableName + '>thead>tr');
    });
    donnees.columns[0].render = function (data, type, row) {
        return data;
    }

    $(tableName).dataTable({
        destroy: true,
        lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Tous"] ],
        "data": donnees.data,
        "columns": donnees.columns,
        dom: "<'row'<'col-sm-3'l><'col-sm-6'B><'col-sm-3'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        buttons: [
            {
                extend: 'copy',
                text: 'Copier',
                className: 'btn btn-default btn-xs'
            }
            , {
                extend: 'csv',
                className: 'btn btn-default btn-xs'
            }
            ,
            {
                extend: 'excel',
                messageTop: $("#titreTableAttributaire").text(),
                className: 'btn btn-default btn-xs'
            },
            {
                extend: 'pdf',
                messageTop: $("#titreTableAttributaire").text(),
                className: 'btn btn-default btn-xs'
            },
            {
                extend: 'print',
                text: 'Imprimer',
                className: 'btn btn-default btn-xs',
                messageTop: $("#titreTableAttributaire").text()
            }
        ],
        "language": {
            "sProcessing": "Traitement en cours...",
            "sSearch": "Rechercher&nbsp;:",
            "sLengthMenu": "Afficher _MENU_ &eacute;l&eacute;ments",
            "sInfo": "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
            "sInfoEmpty": "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
            "sInfoFiltered": "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
            "sInfoPostFix": "",
            "sLoadingRecords": "Chargement en cours...",
            "sZeroRecords": "Aucun &eacute;l&eacute;ment &agrave; afficher",
            "sEmptyTable": "Aucune donn&eacute;e disponible dans le tableau",
            "oPaginate": {
                "sFirst": "Premier",
                "sPrevious": "Pr&eacute;c&eacute;dent",
                "sNext": "Suivant",
                "sLast": "Dernier"
            },
            "oAria": {
                "sSortAscending": ": activer pour trier la colonne par ordre croissant",
                "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
            }
        }
    });
    $("#chargement").css("display" ,"none");
}
// /REMPLISSAGE DE LA TABLE DES ACTIVITÉS À RISQUE

// GESTION DE CLIQUE SUR LE BOUTON DE LA TABLE ATTRIBUTAIRE
$('.agent-toggle').bind('click', function () {
    if ($(this).hasClass('open')) {
        $(this).removeClass('open').addClass('close');
        $(this).empty();
        $(this).append('<i class="clip-chevron-up"></i>');
        $('#main_agent_list_content').hide();
    } else {
        $(this).removeClass('close').addClass('open');
        $(this).empty();
        $(this).append('<i class="clip-chevron-down"></i>');
        $('#main_agent_list_content').show();
    }
});
// /GESTION DE CLIQUE SUR LE BOUTON DE LA TABLE ATTRIBUTAIRE


// GESTION DE CLIQUE SUR UNE LIGNE DE LA TABLE ATTRIBUTAIRE
function cliqueLigneTableAttr(couche, nom_couche){
$('#tableAttributaire').on('click', 'tbody tr', function () {
    $("#tableAttributaire tbody tr").removeClass('row_selected');
    $(this).addClass('row_selected');
    var gid_table = $('#tableAttributaire').DataTable().row(this).data().gid;

    couche.getSource().forEachFeature(function (feature) {
        if (gid_table == feature.get('gid')) {
            popup.show(feature.getGeometry().getCoordinates(), nom_couche+" N° "+feature.get('gid'));
            var ext = feature.getGeometry().getExtent();
            map.getView().fit(ext, map.getSize());
            map.getView().setZoom(17);
        }
    });
});
}
// GESTION DE CLIQUE SUR UNE LIGNE DE LA TABLE ATTRIBUTAIRE