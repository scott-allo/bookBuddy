const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');

// Ajouter un nouveau livre
router.post('/', booksController.addBook);
// Récupérer tous les livres de l'utilisateur
router.get('/', booksController.getAllBooks);
// Récupérer les détails d'un livre spécifique
router.get('/:id', booksController.getBookById);
// Récupérer une liste de livres filtrés
router.get('/filter', booksController.filterBooks);
// Mettre à jour les informations d'un livre
router.put('/:id', booksController.updateBook);
// Mettre à jour la progression de lecture
router.put('/:id/progress', booksController.updateProgress);
// Ajouter un livre aux favoris
router.post('/:id/favorite', booksController.addFavorite);
// Retirer un livre des favoris
router.delete('/:id/favorite', booksController.removeFavorite);

module.exports = router;
