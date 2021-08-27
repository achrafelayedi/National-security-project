# Web GIS : National Security

This project consists of developing a Geoenriched Web GIS Platform to enhance national security. It presents features resulting in correct, quicker and better decisions and operations by mitigating threats and raising preparedness.

# Demo

[![Watch the video](https://user-images.githubusercontent.com/36647745/131191933-7e087ca2-d15b-4f54-807a-d19dde7dde34.png)](https://vimeo.com/manage/videos/593514206)

# Features

+ Points of interest layers Module
+ Agents Management Module
+ Accidentology Module
+ Criminology Module
+ Risk Activities Module
+ Real-time Tracking of Protests Module
+ Management of Processions Module
+ Data Analysis Dashboard Module

# Built with

+ [OpenLayers v4.6.5.](https://openlayers.org/en/v4.6.5/apidoc/)
+ [Ol-ext](https://viglino.github.io/ol-ext/)
+ [API Navcities](http://www.navcities.com/site/documentation/index.html)
+ [PostgreSQL 10.5](https://www.postgresql.org/docs/10/release-10-5.html)
+ [PostGIS](https://postgis.net/)
+ [Highcharts JS v6.1.1.](https://www.highcharts.com/blog/download/)
+ [Turf.js](http://turfjs.org/getting-started/)
+ [DataTables v1.10.19.](https://cdn.datatables.net/1.10.19/)
+ [SheetJS](https://sheetjs.com/)
+ [jQuery v2.1.1.](https://code.jquery.com/jquery/)
+ [jQuery UI - v1.10.2.](https://jqueryui.com/download/all/)
+ [MDB](https://mdbootstrap.com/docs/standard/getting-started/installation/)
+ Etc.

# Getting started
## Prerequisites

+ PHP 7.

+ PostgreSQL 10.5 or above.

+ PgAdmin 4.

+ Any PHP Server.

+ Activate mb_strtoupper extension :

    - In Windows :

       Edit your php.ini.

     - In a Linux-based system :
        
               $ sudo apt install php-mbstring // Installing the extension
               $ sudo service apache2 restart // Restarting the apache server

## Installation

1. Clone this repository to your local php server directory.

2. Open pgadmin, then create a PostgreSQL database.

3. Right click on your database, choose Restore and put [this database backup in Filename](https://github.com/achrafelayedi/National-security-project/blob/master/script_base_donnees/base_donnees_spatiale.backup), then click on Restore button.

4. Change the parameters of the connection_string in [assets/php/connect.php](https://github.com/achrafelayedi/National-security-project/blob/master/assets/php/connect.php) based on your credentials, see the example below :

   ```host=localhost
      port=5432
      dbname=postgres
      user=postgres
      password=postgres
   ```
5. Open your browser, then access to the web application, by default : localhost/national-security-project.

# Notes

+ If you get any warnings while restoring the database but the tables were imported successfully, just ignore them and continue.

+ To enable errors output in the browser's console, change this variable to **true** in [assets/js/GestionDesModules.js.](https://github.com/achrafelayedi/National-security-project/blob/master/assets/js/GestionDesModules.js)

   `var rappErreurs = true;`
