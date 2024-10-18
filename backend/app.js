//Server
const express = require("express");
const mongoose = require("mongoose");
//
require("dotenv").config({ path: ".env" });
const path = require("path");
const mongoUri = process.env.MONGO_URI;
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const { log } = require("console");

// Créer une application Express
const app = express();

//Connexion à MongoDB
mongoose.connect(mongoUri,
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Traitement des requêtes et réponses
// Rendre les données exploitables en JSON
app.use(express.json());

// Éviter les problèmes de CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

// Routes
app.use('/api/books', bookRoutes);

app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
