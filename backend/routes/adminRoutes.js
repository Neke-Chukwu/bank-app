import express from 'express';
import { editUser, 
    deleteUser, 
    suspendUser,
    getAllUsers,
    addFundsToAccount
} from '../controllers/adminContollers.js';
import { authenticate, 
    authorizeAdmin 
} from '../middlewares/authMiddleware.js';
const router = express.Router();

//routes here
router.route('/users').get(authenticate, authorizeAdmin, getAllUsers);
router.route('/users/:id').put(authenticate, authorizeAdmin, editUser);
router.route('/users/:id').delete(authenticate, authorizeAdmin, deleteUser);
router.route('/users/suspend/:id').put(authenticate, authorizeAdmin, suspendUser);
router.route('/users/:userId/accounts/fund').put(authenticate, authorizeAdmin, addFundsToAccount);

export default router;