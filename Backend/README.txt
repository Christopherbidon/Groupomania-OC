Bonjour et bienvenu sur l'installation du backend de mon projet groupomania.

1°) assurer vous de vous trouvez dans le dossier backend

2°) Dans votre terminal taper la commande "npm install" afin d'installer toute les dépendances.

3°) Installer la base de donnée Postgresql sur votre machine

4°) Vous avez un fichier "database.sql" contenant tous le script nécéssaire pour créer la base de donnée avec toute les bonnes tables. Exécuter le afin que votre base de donnée soit fonctionnel.

5°) Dans le fichier ".env(exemple)" supprimer le "(exemple)" puis remplisser les informations qui vous correspondent concernant la base de donnée postgresql ainsi que la clé de sécurité pour Json Web Token. 

Une fois tous ceci fais vous êtes près à lancer votre serveur backend avec la commande "npm start"