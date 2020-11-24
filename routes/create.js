const express = require('express');
const fs = require('fs');
const path = require('path');

const admin = require("firebase-admin");

const serviceAccount = require("/home/masterofreality/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://hashtrackapi.firebaseio.com"
});

const db = admin.firestore();


const router = express.Router();

const createOrder = async (req, res, next) => {
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
};

router
  .route('/api/v1/create/:id')
  .post(createOrder);

module.exports = router;
