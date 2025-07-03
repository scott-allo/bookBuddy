const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  auteur: { type: String, required: true },
  image_url: String,
  nb_pages: Number,
  nb_tomes: Number,
  tomes_lus: { type: Number, default: 0 },
  categorie: { type: String },
  progression: {
    type: Number, // ou un objet plus complexe si besoin
    default: 0
  },
  status: { type: String },
  description: { type: String },
});

module.exports = mongoose.model('Livre', livreSchema);
