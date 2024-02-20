

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Définition du schéma de la catégorie
const categorieSchema = new Schema({
    _id: String, // Utilisation d'une chaîne de caractères pour l'UUID
    libelle: String
});

// Définition du modèle Catégorie
const Categorie = mongoose.model("Categorie", categorieSchema);

module.exports = Categorie;
