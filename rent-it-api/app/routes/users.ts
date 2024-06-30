import express, { Router } from 'express';
import usersController from '../controllers/users';
import authenticateJWT from '../middlewares/authenticateJWT';
import isDeleted from '../middlewares/isDeleted';

const router: Router = express.Router();

router.get('/:id?', [authenticateJWT, isDeleted, ...usersController.getUser]);
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.patch('/', [authenticateJWT, ...usersController.updateUser]);
router.delete('/', authenticateJWT, usersController.deleteUser);

export default router;
