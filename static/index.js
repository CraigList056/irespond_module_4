// 
// MAP
//

// Initialize Map
var map;
var index = 0;
var curr_marker = null;
var markers = [];
var paths = [];
var specialPaths = []
var adjacencyMatrix = [];
var distanceMatrix = [];
var markerList = $("#markerList");
var pathList = $("#pathList");
var startSelect = $("#startSelect");
var endSelect = $("#endSelect");

function initMap() {
	var itb = {lat: 13.2409592, lng: 123.5368396};
  
    map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: itb,
          styles: [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#212121"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#181818"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1b1b1b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#2c2c2c"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8a8a8a"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#373737"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3c3c3c"
      }
    ]
  },
  {
    "featureType": "road.highway.controlled_access",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4e4e4e"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3d3d3d"
      }
    ]
  }
]
        }); 

  
  map.data.loadGeoJson('static/polygon/gadm41_PHL_2.json');
  map.data.setStyle({
    //fillColor: "green",
    strokeWeight: 0,
  });
  pushInitMarker(map);

  directionsService = new google.maps.DirectionsService,
  directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,

            
        })

  //const innerCoords = map.data.loadGeoJson('static/polygon-city-level.json');
  /**const outerCoords = map.data.loadGeoJson('static/gadm41_PHL_2.json');

  const polygonLigao = new google.maps.Polygon({
    paths: [outerCoords],
    strokeColor: 'red',
    strokeOpacity: 0.00001,
    strokeWeight: 0
  });

  polygonLigao.setMap(map);**/



	map.addListener('click', function(event) {
		addMarker(event.latLng, map)
	});


}

//
// MARKER & PATH
//

function pushInitMarker(map) {
  
	var marker_label = getUniqueLabel();
 
	var marker = new google.maps.Marker({
		position: {lat: 13.2366582, lng: 123.5321828}, 
		label: marker_label.toString(),
		map: map
		});
	markers.push({
		marker: marker,
		data: {
			position: marker['position'],
			label: marker_label
		}
	});
  updateMarkerList();
	updateSelect();
  //addPath(marker);
}

//Label for marker
function getUniqueLabel() {
	return (index++);		
}

// Add marker
function addMarker(location, map) {
  
	var marker_label = getUniqueLabel();
 
	var marker = new google.maps.Marker({
		position: location, 
		label: marker_label.toString(),
		map: map
		});
	markers.push({
		marker: marker,
		data: {
			position: marker['position'],
			label: marker_label
		}
	});

	//Update marker list
	updateMarkerList();
	updateSelect();
  addPath(marker);
	//Listener for path creation
	/**marker.addListener('click', function() {
		addPath(marker);
	});**/
}

//Remove all marker
function removeMarkers() {
	for (var i = 0; i < markers.length; i++) {
	  markers[i]['marker'].setMap(null);
	}
	markers = [];
	index = 0;
}

//Add path
function addPath(marker) {
  var curr_marker = new google.maps.Marker({
    position: {lat: 13.2366582, lng: 123.5321828},
    map: map,
    label: '0',
    data: {
			position: {lat: 13.2366582, lng: 123.5321828},
			label: '0'
    }
  });  
  //alert("hi" + JSON.stringify(initMarker))
	/*if (curr_marker == null) {
		curr_marker = marker;
		toggleBounce(marker);
	}
	else if (curr_marker == marker) {
		curr_marker = null;
		disableAnimation();
	}
	else { 
		disableAnimation();*/

		if (!checkPath(curr_marker, marker)) {
			var path = new google.maps.Polyline({
	          path: [curr_marker['position'], marker['position']],
	          //strokeColor: '#FF0000',
	          strokeOpacity: 0
	          //strokeWeight: 2
	        });
	        path.setMap(map);

	        paths.push({
	        	path: path,
	        	data: {
	        		first: curr_marker['label'],
	        		second: marker['label']
	        	}
	        });

	        //Update path list
	        updatePathList();
	    }
	    else {
	    	alert("Path already selected!");
	    }

        //curr_marker = null;
	//}
}

//Check if path exist
function checkPath(first, second) {
	for (var i = 0; i < paths.length; i++) {
		if (((paths[i]['data']['first'] == first['label'] && paths[i]['data']['second'] == second['label'])) ||
			((paths[i]['data']['first'] == second['label'] && paths[i]['data']['second'] == first['label']))) {
				return true;
		}
	}
	return false;
}

//Remove all paths
function removePaths() {
	for (var i = 0; i < paths.length; i++) {
		paths[i]['path'].setMap(null);
	}
  paths = [];
  curr_marker = null;
}

function addSpecialPath(first, second) {
  var path = new google.maps.Polyline({
            path: [markers[first]['data']['position'], markers[second]['data']['position']],
            strokeColor: '#2196F3',
            strokeOpacity: 1.0,
            strokeWeight: 4
          });
          path.setMap(map);

  specialPaths.push({
    path: path
  });
}

function removeSpecialPaths() {
  for (var i = 0; i < specialPaths.length; i++) {
    specialPaths[i]['path'].setMap(null);
  }
  specialPaths = [];
}

//
// LISTENER
//

//Reset all
$('#resetButton').on('click', function() {
  removeMarkers();
  removePaths();
  removeSpecialPaths();
  removeMarkerList();
  removePathList();
  removeSelect();
  pushInitMarker();
  updateRoadRoute();
  //clearRoutes();
});

// Submit data
$('#submitButton').on('click', function() {
 

  if (document.getElementById('cb1').checked) {
    // cb1 is checked
    removeSpecialPaths();
    fitBounds();
    displayRoadRoute();
    

} else if (document.getElementById('cb2').checked) {
    // cb2 is checked
    removeSpecialPaths();
    updateRoadRoute();
    fitBounds();
    createMatrix();
    createJSON();
    

    $.ajax ({
      url: '/submit',
      data: createJSON(),
      type: 'POST',
      success: function(response) {
        displayOnMap(response);
        displayResult(response);
      },
      error: function(error) {
        alert("Error "+error);
      }
    });

}





});

//
// INCOMING HANDLER
//
function displayOnMap(result) {
  for (var i = 1; i < result.length; i++) {
    var path = paths.find(function(x) {
      
      return (x['data']['first'] == result[i] && x['data']['second'] == result[i-1]) || 
      (x['data']['first'] == result[i-1] && x['data']['second'] == result[i])
    });
    
    if (path != null) {
      addSpecialPath(result[i], result[i-1]);
    }
  }
}

function displayResult(result) {
  var text = "Shortest Path: ";
  var total_distance = 0.0;
  for (var i = 0; i < result.length; i++) {
    if (i != 0) {
      text = text.concat("- ");
      total_distance += distanceMatrix[result[i-1]][result[i]];
      total_distance_km = total_distance / 1000;
      time = total_distance / 72.2222222;
      d = Number(time);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

      travel_time = hDisplay + mDisplay + sDisplay
    }
    text = text.concat(result[i]+" ");
  }
  text = text.concat("| Distance: "+total_distance_km.toFixed(2).toString()+" km | ETA: "+travel_time);

  $('.toastBox').text(text).fadeIn(400);
  
}

$('.toastBox').on('click', function() {
  $('.toastBox').fadeOut(400);
});

//
// DISTANCE AND POST
//

//Calculate distance
function getDistance(latLng_1, latLng_2) {
  return google.maps.geometry.spherical.computeDistanceBetween(latLng_1,latLng_2);
}

//Create matrix for transport
function createMatrix() {
  distanceMatrix = [];
  adjacencyMatrix = [];
  //Distance Matrix and initialize Adjacency Matrix
  for (var i = 0; i < markers.length; i++) {
    var row = [];
    var row_init = [];
    for (var j = 0; j < markers.length; j++) {
      row.push(getDistance(markers[i]['data']['position'], markers[j]['data']['position']));
      row_init.push(0);
    }
    distanceMatrix.push(row);
    adjacencyMatrix.push(row_init);
  }

  //Adjacency matrix
  for (var i = 0; i < paths.length; i++) {
    adjacencyMatrix[parseInt(paths[i]['data']['first'])][parseInt(paths[i]['data']['second'])] = 1;
    adjacencyMatrix[parseInt(paths[i]['data']['second'])][parseInt(paths[i]['data']['first'])] = 1;
  }
}

function createJSON() {
  return JSON.stringify ({
    adjacency: adjacencyMatrix,
    distance: distanceMatrix,
    start: $(startSelect).val(),
    end: $(endSelect).val()
  });
}

//
// MISC
//

//Animation
function toggleBounce(marker) {
	marker.setAnimation(google.maps.Animation.BOUNCE);
}

function disableAnimation() {
	for (var i = 0; i < markers.length; i++) {
		markers[i]['marker'].setAnimation(null);
	}
}

//Select start and end points
function updateSelect() {
	startSelect.empty();
	endSelect.empty();
  
  $(startSelect).append($("<option></option>")
  .attr("value", '0')
  .text('0'));
	for (var i = 0; i < markers.length; i++) {
  
		$(endSelect).append($("<option></option>")
                    .attr("value", markers[i]['data']['label'])
                    .text(markers[i]['data']['label'].toString()));
	}
}

function removeSelect() {
  startSelect.empty();
  endSelect.empty();
}

//Print path & marker (update & remove)
function updateMarkerList() {
	markerList.empty();

	for(var i = 0; i < markers.length; i++) {
		$( "<li>"+markers[i]['data']['label']+": ("+markers[i]['marker'].getPosition().lat().toFixed(5)+", "
			+markers[i]['marker'].getPosition().lng().toFixed(5)+")"+"</li>" ).appendTo(markerList);

	}
}

function removeMarkerList() {
  markerList.empty();
}

function updatePathList() {
	pathList.empty();
	for(var i = 0; i < paths.length; i++) {
		$( "<li>"+paths[i]['data']['first']+" <--> "+paths[i]['data']['second']+"</li>" ).appendTo(pathList);
	}
}

function removePathList() {
  pathList.empty();
}

//Zoom map based on the markers
function fitBounds(){
  var bounds = new google.maps.LatLngBounds();
  if (markers.length>0) { 
      for (var i = 0; i < markers.length; i++) {
         bounds.extend(markers[i]['marker'].getPosition());
        }    
        map.fitBounds(bounds);
    }
}

//Drive Route
function displayRoadRoute(){
  startPoint = markers[$(startSelect).val()]['marker'].getPosition();
  endPoint = markers[$(endSelect).val()]['marker'].getPosition();

  //alert(markers[$(endSelect).val()]['marker'].getPosition())
  


  
    directionsService.route({
        origin: startPoint,
        destination: endPoint,
        avoidTolls: true,
        avoidHighways: false,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        unitSystem: google.maps.UnitSystem.metric
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {

          var routes = response.routes;
          var colors = ['red', 'green', 'blue', 'orange', 'yellow', 'black'];
          var directionsDisplays = [];

      // Reset the start and end variables to the actual coordinates
      start = response.routes[0].legs[0].start_location;
      end = response.routes[0].legs[0].end_location;

			// Loop through each route
      for (var i = 0; i < routes.length; i++) {

        var directionsDisplay = new google.maps.DirectionsRenderer({
          map: map,
          directions: response,
          routeIndex: i,
          suppressMarkers: true,
          draggable: false,
          polylineOptions: {

            strokeColor: colors[i],
            strokeWeight: 4,
            strokeOpacity: .3
          }
        });

        // Push the current renderer to an array
        directionsDisplays.push(directionsDisplay);
       

        
        $('#submitButton').on('click', function() {
          for (var j = 0; j < directionsDisplays.length; j++) {

            directionsDisplays[j].setMap(null);
          }
        });



          } // End route loop
        }
      });
          /**
            directionsDisplay.setDirections(response)
            
            var summaryPanel = document.getElementById('directions-panel');
            summaryPanel.innerHTML = '';
            
            
             
            const legCoordinates = [];

            response.routes.forEach(route => {
              route.legs.forEach(leg => {
                const {start_location, end_location} = leg;

                legCoordinates.push({ start_location, end_location });
              });
            });
            alert("hi" + JSON.stringify(legCoordinates));            
           
            
            for (var x = 0; x < response.routes.length; x++) {
              
              directionsDisplay.setOptions({
                map: map,
                directions: response,
                routeIndex: x
              });
              
              summaryPanel.innerHTML += '<hr><br><b> Route ' + (x + 1) + ':<br>';
              var route = response.routes[x];
              for (var y = 0; y < route.legs.length; y++) {
                var routeSegment = y + 1;
      
                summaryPanel.innerHTML += route.legs[y].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[y].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[y].distance.text + '<br><br>';
      
                var steps = route.legs[y].steps;
                for (var z = 0; z < steps.length; z++) {
                  var nextSegment = steps[z].path;
                  summaryPanel.innerHTML += "<li>" + steps[z].instructions;
      
                  var dist_dur = "";
                  if (steps[z].distance && steps[z].distance.text) dist_dur += steps[z].distance.text;
                  if (steps[z].duration && steps[z].duration.text) dist_dur += "&nbsp;" + steps[z].duration.text;
                  if (dist_dur != "") {
                    summaryPanel.innerHTML += "(" + dist_dur + ")<br /></li>";
                  } else {
                    summaryPanel.innerHTML += "</li>";
                  }
      
                }
      
                summaryPanel.innerHTML += "<br>";
              }
            }
             
            var distance = 0;
            var duration = 0;
            var routes = response.routes[0];

            for (i = 0; i < routes.legs.length; i++) {
              distance += routes.legs[i].distance.value;
              duration += routes.legs[i].duration.value;
            } 
            d = Number(duration);
            var h = Math.floor(d / 3600);
            var m = Math.floor(d % 3600 / 60);
            var s = Math.floor(d % 3600 % 60);

            var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
            var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
            var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";

            travel_time = hDisplay + mDisplay + sDisplay

            var text = "Shortest Path: " + $(startSelect).val() + " - " + $(endSelect).val() + " | Distance: " + (distance / 1000).toFixed(2) + " km | ETA: " + travel_time;

            $('.toastBox').text(text).fadeIn(400);
           

            
            
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });*/




}//calculateAndDisplayRoute(directionsService, directionsDisplay, startPoint, endPoint);




function updateRoadRoute(){
  for (var i = 0; i < markers.length; i++ ) {
    directionsDisplay.set('directions', null);
    
  }
}


  