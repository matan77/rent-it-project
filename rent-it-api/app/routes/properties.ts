import express, { Router } from 'express';
import propertiesController from '../controllers/properties';
import authenticateJWT from '../middlewares/authenticateJWT';
import isDeleted from '../middlewares/isDeleted';
const router: Router = express.Router();


router.post('/', [authenticateJWT, isDeleted, ...propertiesController.createProperty]);
router.get('/', [authenticateJWT, isDeleted, propertiesController.getProperties]);
router.get('/:id', propertiesController.getPropertyById);

export default router;