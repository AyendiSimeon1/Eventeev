import { Router } from 'express';
import { EventController } from '../controllers/EventController';
import { authenticateToken } from '../middleware/auth';

export const createEventRouter = (eventController: EventController) => {
  const router = Router();

  router.post('/', authenticateToken, eventController.createEvent);
  router.get('/:id', eventController.getEvent);
  router.put('/:id', authenticateToken, eventController.updateEvent);
  router.delete('/:id', authenticateToken, eventController.deleteEvent);

  return router;
};