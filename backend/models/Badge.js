const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  label: String,
  description: String,
  icone_url: String
});

module.exports = mongoose.model('Badge', badgeSchema);
