import express, { Router } from 'express';
import bookingsController from '../controllers/bookings';
import authenticateJWT from '../middlewares/authenticateJWT';
import isDeleted from '../middlewares/isDeleted';
const router: Router = express.Router();


router.post('/', [authenticateJWT, isDeleted, ...bookingsController.createBooking]);
router.get('/myBookings', [authenticateJWT, isDeleted, bookingsController.getBookings]);
router.get('/', [authenticateJWT, isDeleted, bookingsController.getBookingsByOwner]);

export default router;
