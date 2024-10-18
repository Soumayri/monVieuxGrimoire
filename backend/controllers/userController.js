const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
const secretToken = process.env.JWT_SECRET_TOKEN;


exports.signup = (req, res, next) => {

// Checks inputs if they match regEx
if (!emailRegex.test(req.body.email)) {
    return res.status(410).json({message:"Email non conforme"})
}

if(!passwordRegex.test(req.body.password)){
    return res.status(410).json({message: "Le mot de passe doit contenir au moins 8 catactères, dont une majuscule et un chiffre"})
}

    // Vérifie si l'utilisateur est déja existant dans la dB
    User.findOne({email: req.body.email}).then(user => {
        if(user){
            return res.status(409).json({message: "Utilisateur déjà existant"})
        } else {
            // Enregistre l'utilisateur et hash le mdp
            bcrypt.hash(req.body.password, 10)
             .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
                })
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }))
      })
      .catch(error => res.status(500).json({ error }))
        }
    })
    
  }

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // Vérifie si l'email est dans la dB
            if (!user) {
                return res.status(401).json({ message: `L'adresse email ou le mot de passe est incorrect` })
            }
            // Vérifie les hash de mdp
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: `L'adresse email ou le mot de passe est incorrect` })
                    }
                    // Authorise l'authentification et génère un token de 24h
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            secretToken,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
 }