import { Request, Response, NextFunction } from 'express';
import { EventService } from '@/core/domain/events/EventService';
import { validateEventInput } from '../validation/eventValidation';

export class EventController {
  constructor(private eventService: EventService) {}

  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = validateEventInput(req.body);
      const event = await this.eventService.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  };

  getEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.getEvent(req.params.id);
      res.json(event);
    } catch (error) {
      next(error);
    }
  };

  updateEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const event = await this.eventService.updateEvent(req.params.id, req.body);
      res.json(event);
    } catch (error) {
      next(error);
    }
  };

  deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.eventService.deleteEvent(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
