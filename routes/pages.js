const express = require('express');
const router = express.Router();
const axios = require('axios');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function (req, res, next) {
        const collection = req.app.locals.db.collection("pages");
        var projection = {
          _id: true,
          name:true
        };
        collection.find({}, {projection : projection}).toArray()
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

router.get('/:id', function(req, res, next){
    var id = req.params.id;
    if(id.length !== 24) {
        var error = new Error('Page inexistante.');
        error.status = 404;
        return next(error);
    }
    const collection = req.app.locals.db.collection("pages");
    id = ObjectID.createFromHexString(req.params.id);
    collection.findOne({_id: id}, function (error, page) {
        if(error){
            console.error(`Erreur lors de lecture en base: ${error}`);
            return next(error);
        }
        if(page){
            axios({
                method: 'get',
                url: 'https://graph.facebook.com/' + page.fbId + '/events',
                params: {
                    access_token: page.token
                }
            })
            .then(function (response) {
                res.json(response.data.data);
                res.end();
            })
            .catch(function (error) {
                console.error(`Erreur lors de la récupération des données facebook: ${error}`);
                return next(error);
            });
        } else {
            var error = new Error('Page inexistante.');
            error.status = 404;
            return next(error);
        }
    });
  }
);

module.exports = router;