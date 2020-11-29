function initMap(){
    const db = firebase.firestore();
    const id = document.getElementById('id').innerHTML;

    var map;
    var driverMarker;

    var destIcon = {
        url: "https://cdn3.iconfinder.com/data/icons/real-estate-20/512/1-33-512.png",
        scaledSize: new google.maps.Size(60, 60)
    };

    var driverIcon = {
        url: "https://images.vexels.com/media/users/3/199964/isolated/preview/ae782cab8ae7e722febb5869c09574cc-happy-delivery-boy-character-by-vexels.png",
        scaledSize: new google.maps.Size(70, 70)
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
        });

    db.collection('Events').doc(id.toString())
        .onSnapshot(doc => {

            if(!doc.data().completed && doc.data().active){
                driverMarker.setPosition(new google.maps.LatLng(doc.data().driver.latitude, doc.data().driver.longitude));
                driverMarker.setMap(map);
            }
            else {
                driverMarker.setMap(null);
            }
        });
}
