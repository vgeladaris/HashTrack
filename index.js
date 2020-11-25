const express = require('express');
const path = require('path');
const app = express();

// Setting server/firebase attributes
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const admin = require("firebase-admin");

const serviceAccount = require("/home/masterofreality/serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://hashtrackapi.firebaseio.com"
});

const db = admin.firestore();

app.set('port', PORT);
app.set('env', NODE_ENV);


// Handling map requests for the delivery person
app.get('/api/v1/:id/d', (req, res) => {
    res.sendFile(__dirname + '/dmap.html')
})


// Creating an event
app.post('/api/v1/create/:dest/:timeout', async (req, res, next) => {
    try {
        const dest = req.params.dest;
        const time = parseInt(req.params.timeout);

        if(time < 0){
            // Request in invalid, respond with an error
            res.status(400).send('InvalidInput: timeout value cannot be negative!')
        }
        else{
            // Request is valid, generate an ID and create a record for the database.
            const id = makeId(8);
            const docRef = db.collection('Events').doc(id);

            await docRef.set({
                destination: dest,
                timeout: time,
                completed: false
            });

            // Create the link for the delivery person
            const dlink = 'localhost:3000/api/v1/' + id + '/d'
            res.send('Delivery: ' + dlink);
        }
    } catch (e) {
        next(e);
    }
})


// Generate a random ID for each event
function makeId(length){
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;

    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


// Run the server
app.listen(PORT, () => {
    console.log(`Express Server started on Port ${app.get('port')} | Environment: ${app.get('env')}`);
});
