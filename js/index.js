window.onload = () => {
    displayStores();
}

var map;
var markers = [];
var infoWindow;

function searchStores() {
    let zipCode = document.getElementById("zip-code-input").value;
    displayStores(zipCode);
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    showStoresMarkers(zipCode)

}

function initMap() {
    var losAngeles = {lat: 34.063380, lng: -118.358080};
    map = new google.maps.Map(document.getElementById('map'), { //document.getElementById indicates where it's going to live the "map"
        center: losAngeles,
        zoom: 11,
        mapTypeId: 'roadmap',
        styles: [
            {elementType: 'geometry', stylers: [{color: '#f8ded2'}]},
            {elementType: 'labels.text.stroke', stylers: [{color: '#f3f3f3'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{color: '#76e385'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{color: '#f3f3f3'}]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#c7c7c7'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#f8ded2'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#76a4e3'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    });
    infoWindow = new google.maps.InfoWindow();
    showStoresMarkers();
}



function displayStores(zipCode){
    //stores.map(function(store,index))
    var storesHtml = '';
    let counter = 1;
    for(var [index, store] of stores.entries()){
        let storeaddress = store.addressLines;
        let storePhoneNumber = store.phoneNumber;
        if(storeaddress[1].includes(zipCode) || zipCode == null){
            storesHtml += `
                    <div class="store-container" onclick="setOnClickListener(${index});" >
                        <div class="store-container-background">
                            <div class="store-info-container">
                                <div class="store-address">
                                    <span> ${storeaddress[0]} </span> 
                                    <span> ${storeaddress[1]} </span>
                                </div>
                                <div class="store-phone-number">
                                ${storePhoneNumber}
                                </div>      
                            </div>
                            <div class= "store-number-container">
                                <div class="store-number">
                                    ${index+1}
                                </div>
                            </div>
                        </div>
                    </div>
            `
    }   
        document.querySelector('.store-list').innerHTML = storesHtml
    }
}


function setOnClickListener(index){
    google.maps.event.trigger(markers[index], 'click');
}

function showStoresMarkers(zipCode){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, store] of stores.entries()){

        
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude);
        var status = store.openStatusText;
        var name = store.name
        var phoneNumber = store.phoneNumber;
        var address = store.addressLines[0];
        bounds.extend(latlng)
        if(store.addressLines[1].includes(zipCode) || zipCode == null){
            createMarker(name, address, latlng, index +1, status, phoneNumber);
        }
    }
}

function createMarker(name, address, latlng, index, status, phoneNumber){

    var aux = `
                <div class="marker-container">
                    <div class="marker-store">
                        <div class="marker-store-name">
                            <label onclick="javascript:alert('TODO: Trigger google api for directions');"><b>${name}</b></label>
                        </div>
                        <div class="marker-store-status">
                        ${status}
                        </div>      
                    </div>
                    <div class= "marker-store-info">
                        <div class="marker-icons">
                            <div class="location-icon">
                                <i class="fas fa-location-arrow"></i>
                            </div>
                            <div class="phone-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                        </div>
                        <div class="marker-info">
                            <div class="marker-store-address">
                                ${address}
                            </div>
                            <div class="marker-store-phone">
                                ${phoneNumber}
                            </div>
                        </div>
                    </div>
                </div>
            `
    var html = "<b>" + name + "</b> <br/> " + status + " <hr/> <br/>" + address;
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: {
        url: "https://i.imgur.com/fa6vgMx.png"
      },
      label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.setContent(aux);
        infoWindow.open(map, marker);
      });
    markers.push(marker);
}