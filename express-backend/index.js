const express = require("express");
const mongoose = require("mongoose");
const Categorie = require("./models/Categorie");
const { v4: uuidv4 } = require('uuid'); // Import de la fonction uuidv4 pour générer des UUID
const app = express();
const path = require("path");

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "vues"));

app.use(express.json());
//cnx bd
mongoose.connect('mongodb://localhost:27017/mydatabase')
    .then(() => {
        console.log("Connected successfully to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });



// Création d'une nouvelle catégorie
app.post("/categories", async (req, res) => {
    const { libelle } = req.body;

    // Vérifie si le libellé est vide
    if (!libelle) {
        return res.status(400).json({ error: "Le libellé de la catégorie est requis" });
    }

    const newCategory = new Categorie({
        _id: uuidv4(), // Génération automatique de l'identifiant UUID
        libelle: libelle
    });

    try {
        await newCategory.save();
        res.status(201).json({ message: "Catégorie ajoutée avec succès" });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// Récupération de toutes les catégories
app.get("/categories", async (req, res) => {
    try {
        const categories = await Categorie.find();
        console.log("Les catégories sont :", categories);
        res.json(categories);
    } catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Récupération d'une catégorie par son ID
app.get("/categories/:categorieId", async (req, res) => {
    const categorieId = req.params.categorieId;
    try {
        const categorie = await Categorie.findById(categorieId);
        res.json(categorie);
    } catch (error) {
        console.error("Error fetching categorie by ID:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Suppression d'une catégorie par son ID
app.delete("/categories/:categorieId", async (req, res) => {
    const categorieId = req.params.categorieId;
    try {
        const categorie = await Categorie.findById(categorieId);
        if (!categorie) {
            return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        await Categorie.findByIdAndDelete(categorieId);

        res.status(200).json({ message: "Catégorie supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la catégorie :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});

// Mise à jour d'une catégorie par son ID
// Mise à jour d'une catégorie par son ID
app.put("/categories/:categorieId", async (req, res) => {
    const categorieId = req.params.categorieId;
    const { libelle } = req.body;

    try {
        let categorie = await Categorie.findByIdAndUpdate(categorieId, { libelle }, { new: true });
        if (!categorie) {
            return res.status(404).json({ error: "Catégorie non trouvée" });
        }

        res.status(200).json({ message: "Catégorie mise à jour avec succès", categorie });
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la catégorie :", error);
        res.status(500).json({ error: "Erreur interne du serveur" });
    }
});


// Affichage de l'interface de gestion des catégories
app.get("/showCategorie", async (req, res) => {
    // Rendre la vue EJS pour l'interface de gestion des catégories
    res.render("interfacecategorie");
});

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
