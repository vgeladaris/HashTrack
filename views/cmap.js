const db = firebase.firestore();
const id = document.getElementById('id').innerHTML;


function initMap(){
    var pin;

    db.collection('Events').doc(id.toString())
        .onSnapshot(doc => {
            if(doc.data().position){
                pin = {
                    lat: doc.data().position.latitude,
                    lng: doc.data().position.longitude
                }
            }
            else {
                pin = {
                    lat: 0,
                    lng: 0
                }
            }

            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 15,
                center: pin,
            });

            const marker = new google.maps.Marker({
                position: pin,
                map: map,
            });

        })
}
