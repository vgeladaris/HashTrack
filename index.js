const express = require('express');
//const bodyParser = require('body-parser');
//const logger = require('morgan');
const path = require('path');
const app = express();

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
//app.use('/routes', require(path.join(__dirname, 'routes')));

//app.use((req, res, next) => {
    //const err = new Error(`${req.method} ${req.url} Not Found`);
    //err.status = 404;
    //next(err);
//});

//app.use((err, req, res, next) => {
    //console.error(err);
    //res.status(err.status || 500);
    //res.json({
        //error: {
            //message: err.message
        //}
    //});
//});

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.post('/api/v1/create', async (req, res, next) => {
    res.send('Got a POST request')
    try {
        const docRef = db.collection('Events').doc('6weE4');

        await docRef.set({
            completed: true
        });

        //const data = fs.readFileSync(path.join(__dirname, './stats.json'));
        //const stats = JSON.parse(data);
        //const playerStats = stats.find(player => player.id === Number(req.params.id));
        //if (!playerStats) {
        //const err = new Error('Player stats not found');
        //err.status = 404;
        //throw err;
        //}
        //res.json(playerStats);
    } catch (e) {
        next(e);
    }
})

app.listen(PORT, () => {
    console.log(`Express Server started on Port ${app.get('port')} | Environment: ${app.get('env')}`);
});
