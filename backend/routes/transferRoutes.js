import express from 'express';

//import controller for transfer
import {localTransfer, 
    internationalTransfer, 
    getAllTransfers,
    payBill
} from '../controllers/transfer.js';
import {authenticate} from '../middlewares/authMiddleware.js'; 
const router = express.Router();

//routes here
router.route('/local').post(authenticate, localTransfer);
router.route('/international').post(authenticate, internationalTransfer); 
router.route('/paybill').post(authenticate, payBill);
router.route('/transactions').get(authenticate, getAllTransfers);

export default router;