import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
//import controller for user
import {registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    getUserAccounts,
    getUserData,
    getSavingsAccounts,
    getInvestmentAccounts
} from '../controllers/userControllers.js';

const router = express.Router();

//place routes here
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/profile/:_id").get(authenticate, getUserProfile); 
router.route("/logout").post(logoutUser);
router.route("/accounts").get(authenticate, getUserAccounts);
router.route("/accounts/savings").get(authenticate, getSavingsAccounts);
router.route("/accounts/investment").get(authenticate, getInvestmentAccounts);
router.route("/user").get(authenticate, getUserData); 


export default router;