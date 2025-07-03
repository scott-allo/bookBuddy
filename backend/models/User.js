const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mdp_hash: { type: String, required: true },
  date_inscr: { type: Date, default: Date.now },
  date_of_birth: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  avatar_url: { type: String },
  livres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }],
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Badge' }],
  favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Livre' }]
});

module.exports = mongoose.model('User', userSchema);
