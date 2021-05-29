const express = require('express');
const router = express.Router();
const axios = require('axios');
const createError = require('http-errors');
const ObjectID = require('mongodb').ObjectID;
const querystring = require('querystring');

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
                url: 'https://graph.facebook.com/' + page.fbId + '/events?fields=id',
                params: {
                    access_token: page.token
                }
            })
            .then(function (response) {
                var events = response.data.data;
                console.log(response.data.data.length+'events');
                var eventRequest = [];
                events.forEach(function (event){
                    eventRequest.push({method: 'GET', relative_url: event.id+ '?fields=id,name,start_time,end_time,place,cover,owner,parent_group'});
                });
                var parms = {
                        batch : JSON.stringify(eventRequest),
                        access_token: page.token
                    };
                axios({
                    method: 'post',
                    url: 'https://graph.facebook.com/',
                    params: parms
                    
                })
                .then(function (response) {
                    var events = [];
                    response.data.forEach(function (event){
                        var json = JSON.parse(event.body);
                        json.url = 'https://graph.facebook.com/'+json.id;
                        events.push(json);
                    });
                    res.json(events);
                    res.end();
                })
                .catch(function (error) {
                    console.error(`Erreur lors de la récupération des données facebook: ${error}`);
                    return next(error);
                });
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