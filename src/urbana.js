/**
 * Historic Urbana Map 
 * Author: Timothy Hodson
 ******************************************************************************/   
L.mapbox.accessToken = 
    'pk.eyJ1IjoidG9ob2Rzb24iLCJhIjoiY2llcHE3aGIwMDAwdmE1a3Q1ZzhiNTBwYiJ9.0_l-zvcvr0SrwNDwhoyl8w';


function makeTip( feature ) {

    var title = feature.title;
    // modal code
    // tooltip code
    var html = "<img class='sepia page-curl shadow-bottom' src=" + feature.properties.image + ">" + 
        "<br/>" +
            "<h2>" + feature.properties.title + "</h2>" +
            "<table id='tooltip'> <tr> <th>Architect:</th> <td>" + feature.properties.architect + "</td> </tr>" +
            "<tr> <th>Built:</th> <td>" + feature.properties.built + "</td> </tr>" +
            "<tr> <th>Style:</th> <td>" + feature.properties.style + "</td> </tr>" +
            "</table> <div class='tooltip-footer'>" +
            "<a align='center' class='modal-link' data-toggle='modal' data-target='#myModal' href='#myModal'>- More info -</a>" +
            "</div>";
    return html; 
}


function updateModal(feature) {

    $('#myModal .modal-title').text(feature.properties.title);
    $('#myModal .modal-body').load('modals/' + feature.properties.id, function() {
        $('.slider').slick({
             dots: true,
             lazyLoad: 'ondemand',
             infinite: true,
             speed: 300,
             slidesToShow: 1,
             variableWidth: true,
             centerMode: true,
        });
    });
}

function onEachFeature( feature, layer) {
    layer.on({
        click: updateModal
    });
}
var pushpinIcon = L.icon({
        iconUrl: 'img/pushpin2.svg',//'img/pushpin2.svg',
        iconSize: [20, 20],
});

var buildingIcon = L.divIcon({
                        'className': 'map-icon',
                        "html": "&#9733;",
                        'iconSize': 'null'
                        //'marker-symbol': 'building',
                    });
var buildingIcon = L.mapbox.marker.icon({
                        'marker-symbol': 'building',
                        'marker-color': '#ff3333',
                        'marker-size': 'small'
                    });
var publicIcon = L.mapbox.marker.icon({
                        'marker-symbol': 'town-hall',
                        'marker-color': '#ff3333',
                        'marker-size': 'small'
                    });
var churchIcon = L.mapbox.marker.icon({
                        'marker-symbol': 'religious-christian',
                        'marker-color': '#ff3333',
                        'marker-size': 'small'
                    });
var commercialIcon = L.mapbox.marker.icon({
                        'marker-symbol': 'commercial',
                        'marker-color': '#ff3333',
                        'marker-size': 'small'
                    });




String.prototype.capitalize = function(){
       return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
      };

function genListings(map,featureLayer) {
        var listings = $('#listings');
        listings.empty();
        featureLayer.eachLayer(function(locale) {
            
            var prop = locale.feature.properties;
            item = $('#listings').append(document.createElement("div"))
                          .children()
                          .last("div")
                          .addClass('item');
            var link = $('<a href=#>' + prop.title + '</a>').addClass('addr');
            item.append(link);
            

            link.click( function() {
                map.setView(locale.getLatLng(), 16);
                $('#tab-collapse-1').removeClass('in');
                locale.openPopup();
                updateModal(locale.feature);
            });
            

        });
        
    }
function genChecks(featureLayer) {
    $('#tours').empty();
    $('#styles').empty();
    var tours = [];
    var styles = []
    featureLayer.eachLayer(function(locale) {
        var prop = locale.feature.properties;
        styleID = $(prop.style).text().replace(' ','-').toLowerCase();
        if (prop.tour && tours.indexOf(prop.tour) == -1) {
            tours.push(prop.tour)
            tourID = prop.tour.replace(" ", "-").toLowerCase();
            $('#tours').append(document.createElement("div"))
                    .children()
                    .last('div')
                    .addClass('tour')
                    .html("<input type='checkbox' class='filter' name='filter' "+
                        "id='" + tourID +"' value='" + tourID + "'/>" +
                        "<label for='" + tourID + "'>"+ prop.tour + "</label>");


        }
        if (styleID && styles.indexOf(styleID) == -1) {
            
            styles.push(styleID);
            $('#styles').append(document.createElement("div"))
                    .children()
                    .last('div')
                    .addClass('style')
                    .html("<input type='checkbox' class='filter' name='filter' "+
                        "id='" + styleID +"' value='" + styleID + "'/>" +
                        "<label for='" + styleID + "'>"+ prop.style + "</label>");


        }
    });
    // sort styles in alphabetical order
    $('#styles .style').sort(function(a,b) { 
        la = $(a).find('input').attr('id');
        lb = $(b).find('input').attr('id');
        return la.localeCompare(lb)
    }).appendTo('#styles');
}
/******************************************************************************/   
/*windowon () {*/
$(document).ready( function () {

    if (window.location.protocol=="file:") {alert("must load page via http");}
    L.mapbox.accessToken = 
    'pk.eyJ1IjoiY2l0eS1vZi11cmJhbmEiLCJhIjoiY2lnbXFneXl6MDAyeG5ra29nNDR1NzhlMyJ9.LnLnxgCECdz936gdFy_ttg';

    var map = L.mapbox.map('map-canvas', 'tohodson.55f8ddb6', {
        // the options here prevent mouse wheel or trackpad scrolling
        zoom: 15,
	    center: [40.1097, -88.2042],
        minZoom: 15,
        maxZoom: 18,
    });//                 }).setView([38.8906,-77.01313], 12);

    var featureLayer = L.mapbox.featureLayer()
        .loadURL('historic_places.geojson')
        .addTo(map);

    featureLayer.on('layeradd', function(e) {
        var marker = e.layer,
        feature = marker.feature;
        switch(feature.properties.category) {
            case 'house':
                marker.setIcon(buildingIcon);
                break;
            case 'public':
                marker.setIcon(publicIcon);
                break;
            case 'church':
                marker.setIcon(churchIcon);
                break;
            case 'commercial':
                marker.setIcon(commercialIcon);
                break;
        }  
         
        var content = makeTip(feature); 
        marker.bindPopup(content);
    });

    $('#search').keyup( function () {
        search();
        $('.filter').removeAttr('checked') 
    });
/* 
    $( ".well" ).on( "click", ".item", function() {
      search( $(this).text());
    });
*/
    featureLayer.on('click', function(e) {
        var feature = e.layer.feature;
        //map.setView(e.latlng);
        updateModal(feature);

    });

    featureLayer.on('ready', function() {

        genChecks(featureLayer);
        genListings(map,featureLayer);
    });

function search(string) {
    // get the value of the search input field
    if (string) {
        searchString = string.toLowerCase();
        $('#search').val(string);
    }
    else {
        var searchString = $('#search').val().toLowerCase();
    }

    featureLayer.setFilter(searchTitle)
    genListings(map,featureLayer);
    
    if (( bounds = featureLayer.getBounds()).isValid()) {// if bounds exist
        map.fitBounds(bounds); 
    }
    genChecks(featureLayer); 
    // here we're simply comparing the 'state' property of each marker
    // to the search string, seeing whether the former contains the latter.
    function searchTitle(feature) {
        var title = feature.properties.title.toLowerCase().indexOf(searchString) !== -1;
        var arch = feature.properties.architect.toLowerCase().indexOf(searchString) !== -1;
        var style = feature.properties.style.toLowerCase().indexOf(searchString) !== -1;
        var tour = feature.properties.tour.toLowerCase().indexOf(searchString) !== -1;
        return (arch || title || style || tour)
    }
}


function checked() {
    // the following code is redundant with previous and should be merged
    var searchString = $('#search').val().toLowerCase();
    function searchTitle(feature) {
        var title = feature.properties.title.toLowerCase().indexOf(searchString) !== -1;
        var arch = feature.properties.architect.toLowerCase().indexOf(searchString) !== -1;
        var style = feature.properties.style.toLowerCase().indexOf(searchString) !== -1;
        var tour = feature.properties.tour.toLowerCase().indexOf(searchString) !== -1;
        return (arch || title || style || tour)
    }

    // end of hack

    // Find all checkboxes that are checked and build a list of their values
    checkboxes = $('.filter')
    var on = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) on.push(checkboxes[i].value);
    }
    
 
    if (on.length) {
    // The filter function takes a GeoJSON feature object
    // and returns true to show it or false to hide it.
    //featureLayer.setFilter(filter );
    featureLayer.setFilter(testing);
    map.fitBounds(featureLayer.getBounds()); //testing XXX
    genListings(map,featureLayer); //testing XXX
    } 
    else {
       //featureLayer.setFilter( function() {return true;}); 
       featureLayer.setFilter( function () {search()} );
    }   
    function filter(feature) {
        // check each marker's symbol to see if its value is in the list
        // of symbols that should be on, stored in the 'on' array
        var tour = on.indexOf(feature.properties.tour.replace(' ','-')
            .toLowerCase()) !== -1;

        style = on.indexOf($(feature.properties.style).text().replace(' ','-').toLowerCase()) !==-1;
        return (style || tour);
    }
    function testing(feature) {
        checksResult = filter(feature);
        searchResult = searchTitle(feature);
        return (searchResult & checksResult);
    }   
    return false;
}

// 
function tabCollapse() {
    $('#tab-collapse-1').removeClass('in');
}

map.on({
    'mouseover' : tabCollapse,
    'click'     : tabCollapse
});

// when popups open pan the map as to not cut them off
map.on('popupopen', function(e) {
        var px = map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
            px.y -= e.popup._container.clientHeight/2 + 100 // 100 is testing XXX 
            // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
        map.panTo(map.unproject(px),{animate: true}); // pan to new center
        console.log('test');
});

// monitor for changes in checkboxes
$('#tours, #styles').change( checked );


    var tabheight = $('.tab-content').height();
    var bodyheight = $(document).height();
    $(".modal-body").css('height', bodyheight*0.7);

    }); // end of ready()
   
// resize certain elements when the window is resized
$(window).resize(function() {
    var tabheight = $('.tab-content').height(); // no effect 
    var bodyheight = $(document).height();
    $(".modal-body").css('height', bodyheight*0.7);
});