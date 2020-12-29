const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET users profile */
router.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res, next){
    var url = 'https://graph.facebook.com/'+req.user.id+'/accounts';
    var pageName;
    axios({
        method: 'get',
        url: url,
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
                    console.log(error);
                });
            });
            res.render('profile', { user: req.user, pages: pages });
        })
        .catch(function (error) {
            console.log(error);
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
        url: 'https://graph.facebook.com/' + req.params.id + '/events',
        params: {
            access_token: req.user.token
        }
    })
    .then(function (response) {
        res.render('page', { events: response.data.data });
    })
    .catch(function (error) {
        console.log(error);
        res.redirect('/');
    });
  }
);

module.exports = router;
