const express = require('express');
const router = express.Router();
const axios = require('axios');
const createError = require('http-errors');

/* GET home page. */
router.get('/', function (req, res, next) {
        const collection = req.app.locals.db.collection("pages");
        var projection = {
          _id: true,
          name:true
        };
        collection.find({}, {projection : projection}).toArray()
//            axios({
//                method: 'get',
//                url: 'https://graph.facebook.com/' + page.fbId + '/events',
//                params: {
//                    access_token: page.token
//                }
//            })
//            .then(function (response) {
//                page.events = response.data.data;
//                console.log(page);
//                pages.push(page);
//            })
//            .catch(function (error) {
//                console.error(`Erreur lors de la récupération des données facebook: ${error}`);
//            });
        .then(function (pages) {
            res.setHeader('Content-Type', 'application/json');
            res.json(pages);
            res.end();
        })
        .catch(function (error) {
            console.error(`Erreur de lecture en base: ${error}`);
            return next(error);
        });
});

module.exports = router;