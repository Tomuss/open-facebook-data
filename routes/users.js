const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET users profile */
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next){
    axios({
        method: 'get',
        url: 'https://graph.facebook.com/'+req.user.id+'/accounts',
        params: {
            access_token: req.user.token
        }})
        .then(function (response) {
            var pages = response.data.data;
            pages.forEach(function(page){
                axios({
                    method: 'get',
                    url: 'https://graph.facebook.com/'+page.id+'/events',
                    params: {
                        access_token: req.user.token
                    }
                })
                .then(function (response) {
                    page.events = response.data.data;
                })
                .catch(function (error) {
                    console.log(`Erreur lors de la récupération des événements facebook: ${error}`);
                    return next(error);
                });
            });
            res.render('profile', { user: req.user, pages: pages });
        })
        .catch(function (error) {
            console.log(`Erreur lors de la récupération des pages facebook: ${error}`);
            return next(error);
        }
    );
  }
);

/* GET pages informations */
router.get('/pages/:id',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next){
    axios({
        method: 'get',
        url: 'https://graph.facebook.com/' + req.params.id + '/events?fields=cover,name,owner',
        params: {
            access_token: req.user.token
        }
    })
    .then(function (response) {
        res.render('page', { events: response.data.data, pageId: req.params.id });
    })
    .catch(function (error) {
        console.log(`Erreur lors de la récupération des événements facebook: ${error}`);
        return next(error);
    });
  }
);

router.get('/pages/:pageId/events/:eventId',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next){
    axios({
        method: 'get',
        url: 'https://graph.facebook.com/' + req.params.eventId + '?fields=cover',
        params: {
            access_token: req.user.token
        }
    })
    .then(function (response) {
        console.log(response.data);
        res.render('event', { event: response.data, pageId: req.params.pageId });
    })
    .catch(function (error) {
        console.log(`Erreur lors de la récupération d'un évenement facebook: ${error}`);
        return next(error);
    });
  }
);

module.exports = router;
