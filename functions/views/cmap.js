const db = firebase.firestore();
const id = document.getElementById('id').innerHTML;

var map;
var driverMarker;
function initMap(){

    var destIcon = {
        url: "https://raw.githubusercontent.com/VasileiosGeladaris/HashTrack/main/dest.png",
        scaledSize: new google.maps.Size(73, 100)
    };

    var driverIcon = {
        url: "https://raw.githubusercontent.com/VasileiosGeladaris/HashTrack/main/driver.png",
        scaledSize: new google.maps.Size(100, 100)
    };


    db.collection('Events').doc(id.toString())
        .get().then(doc => {

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

            trackDriver();
            return;

        }).catch(e => {
            console.error(e);
            return;
        });
}


function trackDriver(){
    console.log("tracking");
    db.collection('Events').doc(id.toString())
        .onSnapshot(doc => {

            if(!doc.data().completed && doc.data().active){
                driverMarker.setPosition(new google.maps.LatLng(doc.data().driver.latitude, doc.data().driver.longitude));
                driverMarker.setMap(map);

                if(doc.data().alerting) {
                    document.getElementById("alert").style.visibility = "visible";
                }
                else {
                    document.getElementById("alert").style.visibility = "hidden";
                }
            }
            else {
                driverMarker.setMap(null);
            }
        });
}
