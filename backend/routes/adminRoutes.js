import express from 'express';
import { editUser, 
    deleteUser, 
    suspendUser,
    unSuspendUser,
    getAllUsers,
    addFundsToAccount,
    getUserById,
} from '../controllers/adminControllers.js';
import { authenticate, 
    authorizeAdmin 
} from '../middlewares/authMiddleware.js';
const router = express.Router();

//routes here
router.route('/users').get(authenticate, authorizeAdmin, getAllUsers);

router.route('/users/:id').get(authenticate, authorizeAdmin, getUserById);
router.route('/users/:id').put(authenticate, authorizeAdmin, editUser);
router.route('/users/:id').delete(authenticate, authorizeAdmin, deleteUser);
router.route('/users/suspend/:id').put(authenticate, authorizeAdmin, suspendUser);
router.route('/users/unsuspend/:id').put(authenticate, authorizeAdmin, unSuspendUser);
router.route('/users/:userId/accounts/fund').put(authenticate, authorizeAdmin, addFundsToAccount);
 

export default router;