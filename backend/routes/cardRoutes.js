import express from 'express';
import { generateCard, deleteCard, getCardDetails, getCards} from '../controllers/cardController.js';
import {authenticate} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route to generate a credit or debit card
router.post('/generate', authenticate, generateCard);
router.delete('/delete/:cardId', authenticate, deleteCard);
router.get('/details/:cardId', authenticate, getCardDetails);
router.get('/all', authenticate, getCards);







export default router;