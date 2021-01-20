const express = require('express');
const router = express.Router();
const passport = require('passport');
const axios = require('axios');

router.use(passport.initialize());
router.use(passport.session());

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {user: req.user, error: req.query.error, error_fb: req.query.error_fb});
});

/* Facebook auth routes */
router.get('/login/facebook',
    passport.authenticate('facebook', {scope: ['pages_show_list']})
);

router.get('/facebook',
        passport.authenticate('facebook', {failureRedirect: '/'}),
        function (err, req, res, next) {
            // Erreur facebook lors de l'authentification
            res.redirect('/?error_fb='+req.query.error_message);
        },
        function (req, res, next) {
            var url = 'https://graph.facebook.com/' + req.user.id + '/accounts';
            var pages;
            axios({
                method: 'get',
                url: url,
                params: {
                    access_token: req.user.token
                }
            })
            .then(function (response) {
                pages = response.data.data;

                pages.forEach(function(page){
                    axios({
                        method: 'get',
                        url: 'https://graph.facebook.com/' + page.id,
                        params: {
                            access_token: req.user.token,
                            fields: 'access_token'
                        }
                    })
                    .then(function (response) {
                        page.access_token = response.data.access_token;

                        const collection = req.app.locals.db.collection("pages");
                        var mongoPage = {
                            $set: {
                              fbId : page.id,
                              name : page.name,
                              token : page.access_token
                            }
                        }
                        collection.updateOne({fbId : page.id}, mongoPage, {upsert : true})
                        .then(function (result) {
                          res.redirect('/');
                        })
                        .catch(function (error) {
                          console.error(`Erreur lors de l'écriture en base: ${error}`);
                          res.redirect('/?error=true');
                        });
                    })
                    .catch(function (error) {
                        console.error(`Erreur lors de la récupération des données facebook: ${error}`);
                        res.redirect('/?error=true');
                    });
                });
                // Si l'on ne récupére pas de page
                res.redirect('/');
            })
            .catch(function (error) {
                console.error(`Erreur lors de la récupération des données facebook: ${error}`);
                res.redirect('/?error=true');
            });
        }
);

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
