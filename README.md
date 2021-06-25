# open-facebook-data
## Présentation
Projet pour rendre libre et accessible via une API les événements des pages facebook par leurs administrateurs.
Pour accéder aux données des pages Facebook, il faut préalablement déclarer son application auprés de Facebook.
Cette application s'authentifiera auprés de Facebook au nom de l'application préalablement déclarée.

## Installation
* NodeJS et npm doivent être installé afin de télécharger les dépendances du projet et d'éxécuter l'application.
* Télécharger les sources via Git.
* Se placer dans le repertoire des sources.
* executer la commande npm install.

## Configuration
* Créer un compte Facebook Développeur en se rendant sur cette adresse : https://developers.facebook.com/apps/. Ce compte peut être relié à un compte facebook classique.
* Créer une application de type entreprise.
* Ajouter le produit Facebook Login à cette application.
* Paramétrer Facebook Login en activant la Connexion OAuth et en ajoutant l'URI sur laquelle sera déployé l'application à la liste des URI de redirection OAuth valide sous la forme : <URI>/facebook .
* Dans les paramétres généraux de l'application ajouter le nom de domaine sur lequel l'application sera déployé.
* Créer un fichier nommé .env dans le repertoire du projet contenant les variables d'environement.
* Ajouter une variable FACEBOOK_CLIENT_ID dans le fichier .env contenant l'identifiant Facebook de l'application créé plus tôt (récupérable dans les paramétres généraux).
* Ajouter une variable FACEBOOK_CLIENT_SECRET dans le fichier .env contenant la clé secrète Facebook de l'application créé plus tôt (récupérable dans les paramétres généraux).
* Créer une base de donnée MongoDB accessible en ligne avec un compte permettant de s'y connecter.
* Ajouter une variable MONGODB_URI dans le fichier .env contenant l'URI permettant d'accéder à la base MongoDB.
* Ajouter une variable MONGODB_USER dans le fichier .env contenant le nom d'utilisateur permettant d'accéder à la base MongoDB.
* Ajouter une variable MONGODB_PWD dans le fichier .env contenant le mot de passe permettant d'accéder à la base MongoDB.

## Execution
* Une fois l'application configurée, exécuter le fichier bin/www grâce à NodeJS : node bin/www .
