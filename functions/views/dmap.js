const db = firebase.firestore();
const id = document.getElementById('id').innerHTML;
const orderRef = db.collection('Events').doc(id.toString());

var driverMarker;
var map;
var directionsDisplay;
var directionsService;
var isActive = false;
var isAlerting = false;
var destPos;

window.onload = function() {

    orderRef.get().then((doc) => {
        if(!doc.data().active){
            document.getElementById("start").style.visibility = "visible";
            document.getElementById("stop").style.visibility = "hidden";
        }
        else{
            document.getElementById("start").style.visibility = "hidden";
            document.getElementById("stop").style.visibility = "visible";
            activateOrder();
            if(doc.data().alerting) {
                isAlerting = true;
                document.getElementById("start_alert").style.visibility = "hidden";
                document.getElementById("stop_alert").style.visibility = "visible";
            }
        }
        return;
    }).catch((err) => {
        console.error(err);
        return;
    });
}

function initMap(){
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsService = new google.maps.DirectionsService();

    var destIcon = {
        url: "https://raw.githubusercontent.com/VasileiosGeladaris/HashTrack/main/dest.png",
        scaledSize: new google.maps.Size(73, 100)
    };

    var driverIcon = {
        url: "https://raw.githubusercontent.com/VasileiosGeladaris/HashTrack/main/driver.png",
        scaledSize: new google.maps.Size(100, 100)
    };

    orderRef.get().then(doc => {

        destPos = {
            lat: doc.data().destination.latitude,
            lng: doc.data().destination.longitude
        }

        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 15,
            center: destPos,
        });

        directionsDisplay.setMap(map);

        const destMarker = new google.maps.Marker({
            position: destPos,
            map: map,
            title: "Your Location",
            icon: destIcon
        });

        driverMarker = new google.maps.Marker({
            position: {lat: 0, lng: 0},
            title: "Driver",
            icon: driverIcon
        });

        return;

    }).catch(e => {
        console.error(e);
        return;
    });
}

function activateOrder(){
    isActive = true;
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "visible";
    document.getElementById("start_alert").style.visibility = "visible";
    document.getElementById("credit").style.top = "155px";

    if(navigator.geolocation){
        navigator.geolocation.watchPosition(updatePos, (error) => {console.error(error)}, {enableHighAccuracy: true});
    }
    else{
        console.err("No Geolocation Support.")
    }

    return orderRef.update({
        active: true
    });
}


function updatePos(position){
    if(!isActive) return;

    return orderRef.update({
        driver: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)
    }).then(() => {
        driverMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));

        var request = {
            origin: new google.maps.LatLng(driverMarker.getPosition().lat(), driverMarker.getPosition().lng()),
            destination: new google.maps.LatLng(destPos.lat, destPos.lng),
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                directionsDisplay.setMap(map);
                driverMarker.setMap(map);
            } else {
                console.err("Directions Request failed: " + status);
            }
        });

        return;
    });
}


function ensure(){
    document.getElementById("stop").style.visibility = "hidden";
    document.getElementById("confirm").style.visibility = "visible";
    document.getElementById("cancel").style.visibility = "visible";
}


function completeOrder(){
    isActive = false;
    document.getElementById("stop").style.visibility = "hidden";
    document.getElementById("start_alert").style.visibility = "hidden";
    document.getElementById("stop_alert").style.visibility = "hidden";

    orderRef.delete().then(() => {
        console.log("Order Deleted");
        window.close();
        return;
    }).catch((er) => {
        console.error(er);
        return;
    })
}

function cancel(){
    document.getElementById("stop").style.visibility = "visible";
    document.getElementById("confirm").style.visibility = "hidden";
    document.getElementById("cancel").style.visibility = "hidden";
}

function startAlert() {
    isAlerting = true;
    document.getElementById("start_alert").style.visibility = "hidden";
    document.getElementById("stop_alert").style.visibility = "visible";

    return orderRef.update({
        alerting: true
    });
}

function stopAlert() {
    isAlerting = false;
    document.getElementById("start_alert").style.visibility = "visible";
    document.getElementById("stop_alert").style.visibility = "hidden";

    return orderRef.update({
        alerting: false
    });
}
