const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const pool = require('../config/db-config');

const User = require('../models/User')
/* Controleur pour l'inscription d'une personne */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
       userInfo = req.body
        await pool.query("INSERT INTO users (email, password, name, fisrtname, civilite) VALUES ($1, $2, $3, $4, $5)", 
        [userInfo.email, hash, userInfo.name, userInfo.firstname, userInfo.civilite])
        .then(() => res.status(201).json({message: 'Utilisateur créé'}))
        .catch(err => res.status(400).json({err}))
    })
    .catch(err => res.status(500).json({err}))
};

/* Controlleur pour la connexion d'une personne */
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user){
            return res.status(401).json({ error: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401).json({ error: 'Mot de passe incorecte !'})
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id},
                        '7781e9b987b943a1d7bec478a41b02f0',
                        { expiresIn: '24h' }
                    )
                });
            })
            .catch(err => res.status(500).json({ err }))
    })
    .catch(err => res.status(500).json({ err }))
}