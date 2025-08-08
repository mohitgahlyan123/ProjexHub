import express from 'express';
import { body } from 'express-validator';

import{ register, login} from '../controllers/authController.js';
 const router =express.Router();
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
  ],
  register
);
 router.post('/login',login);

 export default router;