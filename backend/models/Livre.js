const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  image_url: String,
  nb_pages: Number,
  categorie: String,
  progression: {
    type: Number, // ou un objet plus complexe si besoin
    default: 0
  }
});

module.exports = mongoose.model('Livre', livreSchema);
