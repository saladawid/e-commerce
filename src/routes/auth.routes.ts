import express from 'express';
import {login, logout, register} from '../controllers/auth.controller';

export const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);