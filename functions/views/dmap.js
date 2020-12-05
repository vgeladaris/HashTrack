const db = firebase.firestore();
const id = document.getElementById('id').innerHTML;
const orderRef = db.collection('Events').doc(id.toString());

var driverMarker;
var map;
var directionsDisplay;
var directionsService;
var isActive = false;
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
        url: "https://cdn3.iconfinder.com/data/icons/real-estate-20/512/1-33-512.png",
        scaledSize: new google.maps.Size(100, 100)
    };

    var driverIcon = {
        url: "https://images.vexels.com/media/users/3/199964/isolated/preview/ae782cab8ae7e722febb5869c09574cc-happy-delivery-boy-character-by-vexels.png",
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
