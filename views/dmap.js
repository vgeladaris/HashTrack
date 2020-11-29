window.onload = function() {
    document.getElementById("start").style.visibility = "visible";
    document.getElementById("stop").style.visibility = "hidden";
}

const db = firebase.firestore();
const id = document.getElementById('id').innerHTML;
const orderRef = db.collection('Events').doc(id.toString());
var driverMarker;
var map;
var isActive = false;

function initMap(){
    var destIcon = {
        url: "https://cdn3.iconfinder.com/data/icons/real-estate-20/512/1-33-512.png",
        scaledSize: new google.maps.Size(100, 100)
    };

    var driverIcon = {
        url: "https://images.vexels.com/media/users/3/199964/isolated/preview/ae782cab8ae7e722febb5869c09574cc-happy-delivery-boy-character-by-vexels.png",
        scaledSize: new google.maps.Size(100, 100)
    };

    orderRef.get().then(doc => {

            const destPos = {
                lat: doc.data().destination.latitude,
                lng: doc.data().destination.longitude
            }

            map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: destPos,
            });

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
        });
}

function activateOrder(){
    isActive = true;
    document.getElementById("start").style.visibility = "hidden";
    document.getElementById("stop").style.visibility = "visible";

    return orderRef.update({
        active: true
    }).then(() => {
        if(navigator.geolocation){
            setInterval(() => {
                navigator.geolocation.getCurrentPosition(updatePos)
            }, 3000);
        }
        else{
            alert("No Geolocation Support.")
        }
    });
}

function completeOrder(){
    isActive = false;
    document.getElementById("stop").style.visibility = "hidden";

    return orderRef.update({
        active: false,
        completed: true
    });
}

function updatePos(position){
    if(!isActive) return;

    return orderRef.update({
        driver: new firebase.firestore.GeoPoint(position.coords.latitude, position.coords.longitude)
    }).then(() => {
        driverMarker.setPosition(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        driverMarker.setMap(map);
    });
}
